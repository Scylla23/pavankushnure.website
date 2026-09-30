// Email boundary checks alongside the bash/D1 smoke setup, using Node's stdlib.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/inquiry.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { handleInquiry } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
const valid = { name: 'Ada Lovelace', email: 'ada@example.com', product: 'Example app', launchDate: 'Oct 14', message: 'Show how the product saves time.' };
let pass = 0;

function fixture({ changes = 1, storageError = false, key = 'test-only-key' } = {}) {
  const state = { stored: false, emailed: 0, pending: [] };
  const env = {
    RESEND_API_KEY: key,
    INQUIRY_TO: 'pavankushnure2000@gmail.com',
    INQUIRY_LIMIT_PER_HOUR: '5',
    LOG: {
      prepare(sql) {
        return { bind() { return { async run() {
          if (sql.startsWith('UPDATE')) {
            state.emailed = 1;
            return { success: true, meta: { changes: 1 } };
          }
          if (storageError) throw new Error('Storage unavailable');
          state.stored = changes === 1;
          return { success: true, meta: { changes, last_row_id: 42 } };
        } }; } };
      },
    },
  };
  const ctx = { waitUntil(promise) { state.pending.push(promise); } };
  return { state, env, ctx };
}

const originalFetch = globalThis.fetch;
const originalError = console.error;
const originalInfo = console.info;
const errors = [];
console.error = (...args) => errors.push(args.join(' '));
console.info = () => {};
try {
  const f = fixture();
  let completeEmail;
  let payload;
  globalThis.fetch = async (url, options) => {
    assert.equal(f.state.stored, true, 'inquiry must be stored before email starts');
    assert.equal(url, 'https://api.resend.com/emails');
    payload = JSON.parse(options.body);
    return new Promise(resolve => { completeEmail = resolve; });
  };
  const result = await handleInquiry(valid, f.env, f.ctx, 'test-ip');
  assert.deepEqual(result, { status: 200, body: { ok: true } });
  assert.equal(f.state.emailed, 0, 'a slow email must not delay the visitor');
  assert.equal(f.state.pending.length, 1);
  assert.equal(payload.from, 'Launch films <onboarding@resend.dev>');
  assert.deepEqual(payload.to, ['pavankushnure2000@gmail.com']);
  assert.equal(payload.reply_to, 'ada@example.com');
  assert.equal(payload.subject, 'Launch film inquiry: Example app');
  for (const text of ['Ada Lovelace', 'ada@example.com', 'Example app', 'Oct 14', valid.message, 'IST', 'Reply to this email to answer them directly.']) assert.ok(payload.text.includes(text));
  completeEmail(new Response('{"id":"sent"}', { status: 200 }));
  await Promise.all(f.state.pending);
  assert.equal(f.state.emailed, 1);
  console.log('PASS: stored first, immediate response, Resend payload, IST, and emailed=1');
  pass++;

  for (const failure of ['http', 'network']) {
    const f = fixture();
    globalThis.fetch = async () => {
      if (failure === 'network') throw new Error('Network unavailable');
      return new Response('Email rejected', { status: 403 });
    };
    assert.equal((await handleInquiry(valid, f.env, f.ctx, 'test-ip')).status, 200);
    await Promise.all(f.state.pending);
    assert.equal(f.state.stored, true);
    assert.equal(f.state.emailed, 0);
    console.log(`PASS: ${failure} email failure preserves the inquiry`);
    pass++;
  }
  assert.ok(errors.some(line => line.includes('403') && line.includes('Email rejected')));

  globalThis.fetch = async () => { assert.fail('email must not be sent'); };
  for (const [options, expected] of [[{ storageError: true }, 500], [{ changes: 0 }, 429], [{ key: '' }, 200]]) {
    const f = fixture(options);
    const result = await handleInquiry(valid, f.env, f.ctx, 'test-ip');
    assert.equal(result.status, expected);
    if (expected === 500) assert.ok(result.body.error.includes('pavankushnure2000@gmail.com'));
    await Promise.all(f.state.pending);
    assert.equal(f.state.emailed, 0);
    console.log(`PASS: storage/quota/no-key scenario returns ${expected} without email`);
    pass++;
  }

  const subjectFixture = fixture();
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.subject.length, 120);
    assert.equal(/[\r\n]/.test(body.subject), false);
    return new Response('{}', { status: 200 });
  };
  await handleInquiry({ ...valid, product: 'x'.repeat(300) }, subjectFixture.env, subjectFixture.ctx, 'test-ip');
  await Promise.all(subjectFixture.state.pending);
  console.log('PASS: email subject is a single line capped at 120 characters');
  pass++;
} finally {
  globalThis.fetch = originalFetch;
  console.error = originalError;
  console.info = originalInfo;
}
console.log(`${pass} passed, 0 failed`);
