import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let otpStore = {};

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint: Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 30 * 1000;

  otpStore[email] = { otp, expiry };

  const mailOptions = {
    from: `"OTP Auth App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 30 seconds.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Endpoint: Verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record || Date.now() > record.expiry) {
    return res.status(400).json({ error: 'OTP expired or not found' });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  delete otpStore[email];
  return res.status(200).json({ message: 'OTP verified successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
