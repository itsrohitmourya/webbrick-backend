const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const router = express.Router();

// ✅ Improved Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Unique filename
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ✅ Route Handling
router.post('/', upload.single('screenshot'), async (req, res) => {

  const { name, email, message } = req.body;
  const screenshot = req.file;

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
      from: `"WebBrick Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Bug Report from ${name}`,
      html: `
        <h2>Bug Report</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${screenshot ? `<p>Screenshot Attached ✅</p>` : `<p>No Screenshot Provided ❌</p>`}
      `,
      attachments: screenshot ? [
        {
          filename: screenshot.originalname,      // Use original filename
          path: `uploads/${screenshot.filename}`, // Correct path reference
        }
      ] : []
    };

    // ✅ Send Email
    await transporter.sendMail(mailOptions);

    // ✅ Delete temp file after sending
    if (screenshot) {
      fs.unlinkSync(`uploads/${screenshot.filename}`);
    }

    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to send massage' });
  }
});

module.exports = router;
