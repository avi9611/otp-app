import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let otpStore = {}; 

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 30 * 1000;

  otpStore[email] = { otp, expiry };

  try {
    const result = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Acme <onboarding@resend.dev>', 
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 30 seconds.</p>`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({ message: 'OTP sent via Resend' });
  } catch (error) {
    console.error('Resend Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
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
  return res.status(200).json({ message: 'OTP verified' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
