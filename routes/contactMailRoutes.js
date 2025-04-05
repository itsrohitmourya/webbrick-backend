const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// ✅ Route Handling for Contact Us
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // ✅ Nodemailer Config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Email Configuration
    const mailOptions = {
      from: `"WebBrick Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `Contact Us Message from ${name}`,
      html: `
        <h2>Contact Us Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    // ✅ Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
