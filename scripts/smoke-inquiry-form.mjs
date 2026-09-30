import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';

const [page, url = 'http://localhost:3000/films/'] = process.argv.slice(2);
assert.ok(page, 'Usage: node scripts/smoke-inquiry-form.mjs <Orca page id> [local films URL]');
assert.ok(['localhost', '127.0.0.1'].includes(new URL(url).hostname), 'Use a local preview');
const run = promisify(execFile);
let mode;
let received;
const server = createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': new URL(url).origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers).end();
    return;
  }
  let body = '';
  for await (const chunk of request) body += chunk;
  received = JSON.parse(body);
  if (mode === 'body') {
    response.writeHead(200, headers);
    response.write('{"ok":');
  } else if (mode === 'success') {
    await delay(1500);
    response.writeHead(200, headers).end('{"ok":true}');
  }
  // The headers and body cases intentionally keep the HTTP request open.
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const endpoint = `http://127.0.0.1:${server.address().port}/inquiry`;

async function orca(command, ...args) {
  const { stdout } = await run('rtk', ['proxy', 'orca', command, '--page', page, ...args, '--json']);
  const result = JSON.parse(stdout);
  assert.equal(result.ok, true, JSON.stringify(result.error));
  return result.result;
}

async function evaluate(expression) {
  return JSON.parse((await orca('eval', '--expression', expression)).result);
}

async function state() {
  return evaluate(`(() => {
    const form = document.querySelector('#inquiry form');
    const fields = form ? [...form.querySelectorAll('input, textarea')] : [];
    return {
      busy: form?.getAttribute('aria-busy') === 'true',
      disabled: form?.querySelector('button')?.disabled,
      locked: fields.length === 6 && fields.every(field => field.readOnly),
      values: Object.fromEntries(fields.map(field => [field.name, field.value])),
      error: form?.innerText.includes("That didn't send. Email me at"),
      mailto: form?.querySelector('a[href^="mailto:"]')?.getAttribute('href'),
      success: !form && document.body.innerText.includes('Thanks, Test.'),
      focused: document.activeElement?.textContent?.includes('Thanks, Test.'),
    };
  })()`);
}

const values = {
  name: 'Test Visitor',
  email: 'test@example.com',
  product: 'A product worth launching',
  launchDate: 'Oct 14',
  message: 'Make the main benefit clear in twenty seconds.',
  company: '',
};

try {
  for (mode of ['headers', 'body', 'success']) {
    received = undefined;
    await orca('goto', '--url', url);
    await delay(300);
    await evaluate(`(() => {
      const original = window.fetch.bind(window);
      window.__inquiryOriginalFetch = original;
      window.fetch = (input, init) => original(
        String(input).endsWith('/inquiry') ? ${JSON.stringify(endpoint)} : input, init
      );
      const form = document.querySelector('#inquiry form');
      for (const [name, value] of Object.entries(${JSON.stringify(values)})) {
        const field = form.elements.namedItem(name);
        const prototype = field.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(prototype, 'value').set.call(field, value);
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
      form.requestSubmit();
      return true;
    })()`);
    await delay(150);
    const sending = await state();
    assert.equal(sending.busy, true, `${mode}: enters sending state`);
    assert.equal(sending.disabled, true, `${mode}: disables submit`);
    if (mode !== 'success') {
      await evaluate('(() => { const name = document.querySelector("input[name=name]"); name.scrollIntoView(); name.focus(); return true; })()');
      await orca('keypress', '--key', 'x');
      assert.deepEqual((await state()).values, values, `${mode}: rejects editing during submission`);
    }
    const started = Date.now();
    let settled;
    do {
      settled = await state();
      if (!settled.busy) break;
      await delay(500);
    } while (Date.now() - started < 20_000);
    assert.equal(settled.busy, false, `${mode}: request must settle within twenty seconds`);
    assert.equal(sending.locked, true, `${mode}: fields must be read-only while sending`);
    assert.deepEqual(received, values, `${mode}: sends the original input`);
    if (mode === 'success') {
      assert.equal(settled.success, true, 'success replaces the form');
      assert.equal(settled.focused, true, 'success receives focus');
    } else {
      assert.equal(settled.error, true, `${mode}: shows the error fallback`);
      assert.equal(settled.mailto, 'mailto:pavankushnure2000@gmail.com', `${mode}: offers email`);
      assert.equal(settled.disabled, false, `${mode}: enables retry`);
      assert.equal(settled.locked, false, `${mode}: restores editing`);
      assert.deepEqual(settled.values, values, `${mode}: preserves all input`);
    }
    console.log(`PASS: ${mode === 'success' ? 'delayed success' : `stalled ${mode}`} recovery`);
  }
} finally {
  await evaluate('(() => { if (window.__inquiryOriginalFetch) window.fetch = window.__inquiryOriginalFetch; return true; })()').catch(() => {});
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
