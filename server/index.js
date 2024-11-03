import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'info@ctcannabisalliance.org',
    pass: 'Thc123'
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, content } = req.body;

  try {
    await transporter.sendMail({
      from: '"CCSBA Platform" <info@ctcannabisalliance.org>',
      to,
      subject,
      html: content
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});