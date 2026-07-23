// src/utils/mailer.js
const nodemailer = require('nodemailer');

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    if (process.env.SMTP_HOST) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      });
    }
    // No SMTP configured: use an Ethereal throwaway test account so
    // welcome emails still generate a viewable preview link.
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  })();

  return transporterPromise;
}

async function sendWelcomeEmail(email, displayName) {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: '"Nimbus" <hello@nimbus.shop>',
      to: email,
      subject: 'Welcome to Nimbus',
      text: `Hi ${displayName}, thanks for creating a Nimbus account.`,
      html: `<p>Hi ${displayName},</p><p>Thanks for creating a Nimbus account. Happy shopping!</p>`,
    });
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log(`[mailer] preview welcome email: ${preview}`);
  } catch (err) {
    console.warn('[mailer] failed to send welcome email:', err.message);
  }
}

module.exports = { sendWelcomeEmail };
