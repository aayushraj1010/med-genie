import { NextRequest, NextResponse } from 'next/server';
import { InputSanitizer } from '@/lib/input-sanitizer';
import { sendEmail } from '@/lib/email';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

const MAX_MESSAGE_LEN = 5000;

async function handler(req: NextRequest) {
  if (req.method !== 'POST') return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, message } = body || {};
  if (!name || !email || !message) {
    return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
  }

  const nameVal = InputSanitizer.validateInput(String(name), 200);
  const msgVal = InputSanitizer.validateInput(String(message), MAX_MESSAGE_LEN);
  const emailSan = InputSanitizer.sanitizeEmail(String(email));

  if (!nameVal.isValid) return NextResponse.json({ success: false, message: 'Invalid name.' }, { status: 400 });
  if (!msgVal.isValid) return NextResponse.json({ success: false, message: 'Invalid message.' }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailSan)) return NextResponse.json({ success: false, message: 'Invalid email.' }, { status: 400 });

  const safeName = nameVal.sanitizedValue;
  const safeEmail = emailSan;
  const safeMessage = InputSanitizer.sanitizeHTML(msgVal.sanitizedValue).replace(/\n/g, '<br/>');

  const html = `<p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p><div>${safeMessage}</div>`;

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendEmail({ to: process.env.CONTACT_RECIPIENT || process.env.SMTP_USER!, subject: `Contact form: ${safeName}`, html });
    } else {
      // fallback: log message so maintainers can fetch from logs
      console.info('Contact submission (no SMTP):', { name: safeName, email: safeEmail, message: msgVal.sanitizedValue.substring(0, 1000) });
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
  }
}

export const POST = withRateLimit(RATE_LIMIT_CONFIGS.GENERAL)(handler);
