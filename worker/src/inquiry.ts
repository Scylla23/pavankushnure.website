import type { Env } from './index';

interface Inquiry {
  name: string;
  email: string;
  product: string;
  launchDate: string;
  message: string;
}

interface InquiryResult {
  status: number;
  body: { ok: true } | { error: string };
}

const EMAIL = 'pavankushnure2000@gmail.com';
const SINGLE_LINE_CONTROLS = /[\u0000-\u001F\u007F-\u009F]/g;
const MESSAGE_CONTROLS = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g;

function validateInquiry(input: unknown): Inquiry | { error: string } | { bot: true } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Invalid name' };
  const fields = input as Record<string, unknown>;
  const company = fields.company === undefined ? '' : fields.company;
  if (typeof company !== 'string') return { error: 'Invalid company' };
  if (company.length > 0) return { bot: true };

  const inquiry: Inquiry = { name: '', email: '', product: '', launchDate: '', message: '' };
  const limits: Record<keyof Inquiry, [number, number]> = {
    name: [1, 100],
    email: [1, 254],
    product: [1, 300],
    launchDate: [0, 60],
    message: [10, 2000],
  };
  for (const field of Object.keys(limits) as (keyof Inquiry)[]) {
    const raw = fields[field] === undefined && field === 'launchDate' ? '' : fields[field];
    if (typeof raw !== 'string') return { error: `Invalid ${field}` };
    const value = field === 'message'
      ? raw.replace(/\r\n?/g, '\n').replace(MESSAGE_CONTROLS, '').trim()
      : raw.replace(/\s+/g, ' ').replace(SINGLE_LINE_CONTROLS, '').trim();
    const [min, max] = limits[field];
    if (value.length < min || value.length > max) return { error: `Invalid ${field}` };
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { error: 'Invalid email' };
    inquiry[field] = value;
  }
  return inquiry;
}

async function emailInquiry(inquiry: Inquiry, id: number, ts: number, env: Env): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.info(`Inquiry ${id} stored only: RESEND_API_KEY is not set.`);
    return;
  }
  const time = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium', timeStyle: 'long', timeZone: 'Asia/Kolkata',
  }).format(new Date(ts));
  const text = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Product: ${inquiry.product}`,
    `Launch date: ${inquiry.launchDate || 'Not specified'}`,
    `Time (IST): ${time}`,
    '',
    'Message:',
    inquiry.message,
    '',
    'Reply to this email to answer them directly.',
  ].join('\n');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Launch films <onboarding@resend.dev>',
        to: [env.INQUIRY_TO],
        reply_to: inquiry.email,
        subject: `Launch film inquiry: ${inquiry.product}`.slice(0, 120),
        text,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      const body = (await response.text()).replaceAll(env.RESEND_API_KEY, '[redacted]').slice(0, 300);
      console.error(`Inquiry ${id} email failed: Resend ${response.status}: ${body}`);
      return;
    }
    const updated = await env.LOG.prepare('UPDATE inquiries SET emailed = 1 WHERE id = ?1').bind(id).run();
    if (!updated.success) console.error(`Inquiry ${id} email sent but emailed flag could not be saved.`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Inquiry ${id} email failed: ${detail.replaceAll(env.RESEND_API_KEY, '[redacted]').slice(0, 300)}`);
  }
}

export async function handleInquiry(input: unknown, env: Env, ctx: ExecutionContext, ipHash: string): Promise<InquiryResult> {
  const inquiry = validateInquiry(input);
  if ('error' in inquiry) return { status: 400, body: inquiry };
  if ('bot' in inquiry) return { status: 200, body: { ok: true } };

  const ts = Date.now();
  const configuredLimit = Number.parseInt(env.INQUIRY_LIMIT_PER_HOUR || '5', 10);
  const limit = Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 5;
  let inserted: D1Result;
  try {
    // Count and insert in one statement so concurrent requests cannot exceed the cap.
    inserted = await env.LOG.prepare(
      `INSERT INTO inquiries (ts, ip_hash, name, email, product, launch_date, message)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7
       WHERE (SELECT COUNT(*) FROM inquiries WHERE ip_hash = ?2 AND ts > ?8) < ?9`
    ).bind(ts, ipHash, inquiry.name, inquiry.email, inquiry.product, inquiry.launchDate, inquiry.message, ts - 3_600_000, limit).run();
    if (!inserted.success) throw new Error('Insert failed');
  } catch {
    console.error('Inquiry could not be stored in D1.');
    return { status: 500, body: { error: `That didn't send. Email ${EMAIL} instead.` } };
  }
  if (inserted.meta.changes === 0) return { status: 429, body: { error: 'Too many inquiries. Try again in an hour.' } };

  ctx.waitUntil(emailInquiry(inquiry, inserted.meta.last_row_id, ts, env));
  return { status: 200, body: { ok: true } };
}
