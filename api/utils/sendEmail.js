import { Resend } from 'resend';

export async function sendEmail({ to, subject, text, html }) {
  // 1. Google Apps Script Relay (100% Free, No Domain Needed, Never Expiring)
  if (process.env.GOOGLE_SCRIPT_URL) {
    try {
      const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text, html }),
        redirect: 'follow',
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('Email sent successfully via Google Apps Script');
      return result;
    } catch (err) {
      console.error('Google Script email failed:', err);
      throw err;
    }
  }

  // 2. Resend (if you configure a custom domain later)
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM || process.env.SENDER_EMAIL || process.env.SMTP_USER;
    const { data, error } = await resend.emails.send({ from, to, subject, text });
    if (error) throw new Error(error.message || 'Resend error');
    return data;
  }

  // 3. Fallback to Nodemailer for local development
  const from = process.env.SENDER_EMAIL || process.env.SMTP_USER;
  const { default: transporter } = await import('../config/nodemailer.js');
  return await transporter.sendMail({ from, to, subject, text });
}
