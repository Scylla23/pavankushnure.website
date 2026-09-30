#!/usr/bin/env bash
# Real local HTTP and D1 checks; no Gemini or Resend key needed.
set -euo pipefail

cd "$(dirname "$0")/.."

PORT=${PORT:-8798}
BASE="http://localhost:$PORT"
TEST_DIR=$(mktemp -d "${TMPDIR:-/tmp}/inquiry-smoke.XXXXXX")
STATE="$TEST_DIR/state"
pass=0

cleanup() {
  if [[ -n "${WRANGLER_PID:-}" ]]; then
    kill "$WRANGLER_PID" 2>/dev/null || true
    wait "$WRANGLER_PID" 2>/dev/null || true
  fi
  rm -rf "$TEST_DIR"
}
trap cleanup EXIT

# Explicit env file prevents loading keys from the developer's .dev.vars.
printf 'RESEND_API_KEY=\nGEMINI_API_KEY=\n' > "$TEST_DIR/empty.env"
npx wrangler d1 migrations apply LOG --local --persist-to "$STATE" > "$TEST_DIR/migrations.log" 2>&1
npx wrangler dev --port "$PORT" --inspector-port 0 --persist-to "$STATE" \
  --env-file "$TEST_DIR/empty.env" --var INQUIRY_LIMIT_PER_HOUR:2 \
  > "$TEST_DIR/dev.log" 2>&1 &
WRANGLER_PID=$!

ready=0
for _ in $(seq 1 120); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -X OPTIONS "$BASE/ask" \
    -H 'Origin: http://localhost:3000') || code=000
  if [[ "$code" == 204 ]]; then ready=1; break; fi
  if ! kill -0 "$WRANGLER_PID" 2>/dev/null; then break; fi
  sleep 0.5
done
if [[ "$ready" != 1 ]]; then
  echo 'FAIL: wrangler dev did not start'
  tail -20 "$TEST_DIR/dev.log"
  exit 1
fi

check_status() {
  local name=$1 expected=$2
  shift 2
  local actual
  actual=$(curl -sS --max-time 15 -o "$TEST_DIR/response.json" -w '%{http_code}' "$@")
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL: $name (expected $expected, got $actual)"
    cat "$TEST_DIR/response.json"
    exit 1
  fi
  echo "PASS: $name"
  pass=$((pass + 1))
}

post() {
  local name=$1 expected=$2 data=$3
  check_status "$name" "$expected" -X POST "$BASE/inquiry" \
    -H 'Origin: http://localhost:3000' -H 'Content-Type: application/json' --data-binary "$data"
}

query() {
  npx wrangler d1 execute LOG --local --persist-to "$STATE" --json --command "$1"
}

check_count() {
  local expected=$1
  query 'SELECT COUNT(*) AS n FROM inquiries' > "$TEST_DIR/rows.json"
  node -e 'const a=require("node:assert/strict"); const r=JSON.parse(require("node:fs").readFileSync(process.argv[1],"utf8")); a.equal(r[0].results[0].n,Number(process.argv[2]));' "$TEST_DIR/rows.json" "$expected"
  echo "PASS: D1 contains $expected inquiries"
  pass=$((pass + 1))
}

VALID='{"name":"Ada Lovelace","email":"ada@example.com","product":"Example app","launchDate":"Oct 14","message":"Show how the product saves time.","company":""}'

check_status 'inquiry preflight' 204 -X OPTIONS "$BASE/inquiry" \
  -H 'Origin: http://localhost:3000' -H 'Access-Control-Request-Method: POST'
post 'valid inquiry' 200 "$VALID"
node -e 'require("node:assert/strict").equal(JSON.parse(require("node:fs").readFileSync(process.argv[1],"utf8")).ok,true)' "$TEST_DIR/response.json"
check_count 1

post 'honeypot is silently accepted' 200 '{"company":"a bot"}'
check_count 1
post 'bad email' 400 '{"name":"Ada","email":"bad-email","product":"Example","message":"A useful product."}'
node -e 'require("node:assert/strict").match(JSON.parse(require("node:fs").readFileSync(process.argv[1],"utf8")).error,/email/)' "$TEST_DIR/response.json"

node -e 'process.stdout.write(JSON.stringify({message:"x".repeat(9000)}))' > "$TEST_DIR/oversize.json"
check_status 'body over 8 KB' 413 -X POST "$BASE/inquiry" \
  -H 'Origin: http://localhost:3000' -H 'Content-Type: application/json' --data-binary "@$TEST_DIR/oversize.json"
check_status 'foreign origin' 403 -X POST "$BASE/inquiry" \
  -H 'Origin: https://evil.example' -H 'Content-Type: application/json' --data-binary "$VALID"
check_status 'JSON content type required' 400 -X POST "$BASE/inquiry" \
  -H 'Origin: http://localhost:3000' -H 'Content-Type: text/plain' --data-binary "$VALID"
post 'malformed JSON' 400 '{'
post 'null JSON body' 400 'null'

# Validation does not consume the visitor's quota.
for field in name email product launchDate message company; do
  invalid=$(node -e 'const x=JSON.parse(process.argv[1]); x[process.argv[2]]=123; process.stdout.write(JSON.stringify(x))' "$VALID" "$field")
  post "non-string $field" 400 "$invalid"
  node -e 'require("node:assert/strict").match(JSON.parse(require("node:fs").readFileSync(process.argv[1],"utf8")).error,new RegExp(process.argv[2]))' "$TEST_DIR/response.json" "$field"
done

post 'null honeypot field' 400 '{"name":"Ada","email":"ada@example.com","product":"Example","message":"A useful product.","company":null}'

for entry in name:101 email:255 product:301 launchDate:61 message:2001; do
  field=${entry%:*}
  length=${entry#*:}
  invalid=$(node -e 'const x=JSON.parse(process.argv[1]); x[process.argv[2]]="x".repeat(Number(process.argv[3])); process.stdout.write(JSON.stringify(x))' "$VALID" "$field" "$length")
  post "oversize $field" 400 "$invalid"
done
post 'message below 10 characters' 400 '{"name":"Ada","email":"ada@example.com","product":"Example","message":"Short"}'
check_count 1

CLEAN='{"name":"  Ada\t Lovelace\u0000  ","email":" ada@example.com ","product":"Example\n app","message":"First line\r\nSecond\u0007 line","ignored":{"anything":true}}'
post 'sanitization and omitted optional fields' 200 "$CLEAN"
query 'SELECT name, email, product, launch_date, message, emailed FROM inquiries ORDER BY id DESC LIMIT 1' > "$TEST_DIR/clean.json"
node - "$TEST_DIR/clean.json" <<'JS'
const assert = require('node:assert/strict');
const row = JSON.parse(require('node:fs').readFileSync(process.argv[2], 'utf8'))[0].results[0];
assert.deepEqual(row, { name: 'Ada Lovelace', email: 'ada@example.com', product: 'Example app', launch_date: '', message: 'First line\nSecond line', emailed: 0 });
JS
echo 'PASS: sanitized values and emailed=0 persisted in D1'
pass=$((pass + 1))
check_count 2
post 'third valid inquiry is rate limited' 429 "$VALID"
check_count 2

check_status 'unknown route stays 404' 404 "$BASE/unknown"
check_status 'inquiry GET is not allowed' 405 "$BASE/inquiry" -H 'Origin: http://localhost:3000'
check_status 'ask preflight still works' 204 -X OPTIONS "$BASE/ask" -H 'Origin: http://localhost:3000'
check_status 'ask validation still works' 400 -X POST "$BASE/ask" \
  -H 'Origin: http://localhost:3000' -H 'Content-Type: application/json' --data-binary '{"messages":[]}'

# Old inquiries must not consume this hour's quota; simultaneous requests share the cap.
query 'UPDATE inquiries SET ts = ts - 7200000' > /dev/null
pids=()
for i in $(seq 1 6); do
  curl -sS --max-time 15 -o "$TEST_DIR/parallel-$i.json" -w '%{http_code}' -X POST "$BASE/inquiry" \
    -H 'Origin: http://localhost:3000' -H 'Content-Type: application/json' --data-binary "$VALID" \
    > "$TEST_DIR/parallel-$i.code" &
  pids+=("$!")
done
for pid in "${pids[@]}"; do wait "$pid"; done
node - "$TEST_DIR" <<'JS'
const assert = require('node:assert/strict');
const fs = require('node:fs');
const codes = Array.from({ length: 6 }, (_, i) => fs.readFileSync(`${process.argv[2]}/parallel-${i + 1}.code`, 'utf8')).sort();
assert.deepEqual(codes, ['200', '200', '429', '429', '429', '429']);
JS
echo 'PASS: hour rollover and six parallel requests respect the cap of two'
pass=$((pass + 1))
check_count 4

echo "$pass passed, 0 failed"
