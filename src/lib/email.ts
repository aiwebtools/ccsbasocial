import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // For Microsoft 365, use false and let Nodemailer handle STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: '"CCSBA Platform" <info@ctcannabisalliance.org>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to CCSBA Platform!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"CCSBA Platform" <info@ctcannabisalliance.org>',
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

export async function sendWelcomeEmail(email: string, password: string) {
  await transporter.sendMail({
    from: '"CCSBA Platform" <info@ctcannabisalliance.org>',
    to: email,
    subject: 'Welcome to CCSBA Platform',
    html: `
      <h1>Welcome to CCSBA Platform!</h1>
      <p>Your account has been created with the following credentials:</p>
      <p>Email: ${email}</p>
      <p>Temporary Password: ${password}</p>
      <p>Please login and change your password immediately.</p>
      <p>Login at: ${process.env.NEXT_PUBLIC_APP_URL}</p>
    `,
  });
}