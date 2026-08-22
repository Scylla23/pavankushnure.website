(() => {
  'use strict';

  // Paste the URL `wrangler deploy` prints (ask-pavan.<your-subdomain>.workers.dev).
  const WORKER_URL = 'https://ask-pavan.pavankumarkushnure.workers.dev';
  const MAX_HISTORY = 8;
  const EMAIL = 'pavankushnure2000@gmail.com';

  const SPARKLES =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>';
  const TYPING = '<span class="apv-dots" aria-label="Thinking"><i></i><i></i><i></i></span>';

  const el = (tag, cls) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  };

  if (!document.querySelector('link[href="/ask-pavan.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/ask-pavan.css';
    document.head.appendChild(css);
  }

  const bubble = el('button', 'apv-bubble');
  bubble.type = 'button';
  bubble.setAttribute('aria-label', 'Ask AI about Pavan');
  bubble.setAttribute('aria-expanded', 'false');
  bubble.innerHTML = SPARKLES;

  const panel = el('div', 'apv-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Ask AI about Pavan');
  panel.hidden = true;

  const head = el('div', 'apv-head');
  const title = el('span', 'apv-title');
  title.innerHTML = '<span class="apv-chevron" aria-hidden="true">❯</span> ask my AI';
  const closeBtn = el('button', 'apv-close');
  closeBtn.type = 'button';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close chat');
  head.append(title, closeBtn);

  const log = el('div', 'apv-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');

  const form = el('form', 'apv-form');
  const chevron = el('span', 'apv-chevron');
  chevron.textContent = '❯';
  chevron.setAttribute('aria-hidden', 'true');
  const input = el('input', 'apv-input');
  input.type = 'text';
  input.placeholder = 'ask about Pavan…';
  input.maxLength = 1000;
  input.autocomplete = 'off';
  input.setAttribute('aria-label', 'Your question');
  const send = el('button', 'apv-send');
  send.type = 'submit';
  send.setAttribute('aria-label', 'Send');
  send.textContent = '↵';
  form.append(chevron, input, send);

  panel.append(head, log, form);
  document.body.append(bubble, panel);

  let history = [];
  let generating = false;
  let greeted = false;

  const scrollDown = () => {
    log.scrollTop = log.scrollHeight;
  };

  const addBubble = (role, text) => {
    const row = el('div', `apv-msg apv-msg-${role}`);
    if (text) row.textContent = text;
    log.appendChild(row);
    scrollDown();
    return row;
  };

  function renderError(row, err) {
    row.classList.add('apv-msg-error');
    row.textContent = '';
    const p = el('p');
    p.textContent =
      err.status === 429
        ? 'Rate limited — try again in a bit.'
        : err.status === 503
          ? 'Pavan\u2019s AI is taking a breather.'
          : 'Something went wrong reaching my brain.';
    row.appendChild(p);

    if (err.status === 503) {
      const a = el('a');
      a.href = `mailto:${EMAIL}`;
      a.textContent = `Email ${EMAIL}`;
      row.appendChild(a);
    } else {
      const retry = el('button', 'apv-retry');
      retry.type = 'button';
      retry.textContent = 'Retry';
      retry.addEventListener('click', () => {
        if (generating) return;
        row.remove();
        run();
      });
      row.appendChild(retry);
    }
    scrollDown();
  }

  async function streamAnswer(messages, row) {
    const res = await fetch(`${WORKER_URL}/ask`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw Object.assign(new Error(data.error || 'request failed'), { status: res.status });
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let started = false;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const events = buf.split('\n\n');
      buf = events.pop() ?? '';
      for (const event of events) {
        const line = event.split('\n').find((l) => l.startsWith('data:'));
        if (!line) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload);
          if (typeof parsed.t === 'string' && parsed.t) {
            if (!started) {
              started = true;
              row.textContent = '';
              row.classList.add('apv-streaming');
            }
            row.textContent += parsed.t;
            scrollDown();
          }
        } catch {}
      }
    }
    row.classList.remove('apv-streaming');
    return started ? row.textContent : null;
  }

  async function run() {
    generating = true;
    input.disabled = true;
    send.disabled = true;

    const row = addBubble('assistant');
    row.innerHTML = TYPING;
    try {
      const reply = await streamAnswer(history.slice(-MAX_HISTORY), row);
      history.push({ role: 'assistant', content: reply ?? '' });
      history = history.slice(-MAX_HISTORY);
    } catch (err) {
      renderError(row, err);
    } finally {
      generating = false;
      input.disabled = false;
      send.disabled = false;
      scrollDown();
      input.focus();
    }
  }

  function submit(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || generating) return;
    input.value = '';
    history.push({ role: 'user', content: text });
    history = history.slice(-MAX_HISTORY);
    addBubble('user', text);
    run();
  }

  const focusables = () =>
    [closeBtn, input, send].filter((n) => !n.disabled && n.offsetParent !== null);

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab' || panel.hidden) return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function setOpen(openState) {
    panel.hidden = !openState;
    bubble.setAttribute('aria-expanded', String(openState));
    if (openState) {
      if (!greeted) {
        greeted = true;
        addBubble(
          'assistant',
          "Hi! I'm Pavan's AI avatar — ask about his work, stack, or projects."
        );
      }
      input.focus();
      document.addEventListener('keydown', onKeydown);
    } else {
      document.removeEventListener('keydown', onKeydown);
      bubble.focus();
    }
  }

  bubble.addEventListener('click', () => setOpen(panel.hidden));
  closeBtn.addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', submit);
})();
