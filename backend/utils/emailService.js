// backend/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();                     // <-- load .env

// ---------- TRANSPORTER ----------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,             // <-- APP PASSWORD
  },
  // Gmail already uses TLS, no need for rejectUnauthorized
});

// Verify on start
transporter.verify((err, success) => {
  if (err) console.error('SMTP transporter error:', err);
  else console.log('SMTP ready – emails will be sent');
});

/* --------------------------------------------------------------
   SEND VERIFICATION EMAIL
   -------------------------------------------------------------- */
const sendVerificationEmail = async (user) => {
  if (!user?.email || !user?.verificationToken) {
    console.error('Invalid user data for verification email');
    return;
  }

  const verificationUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/auth/verify/${user.verificationToken}`;

  const mailOptions = {
    from: `"Eco Bright" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verify Your Eco Bright Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:12px;background:#fff;">
        <h2 style="color:#27ae60;text-align:center;">Welcome to Eco Bright!</h2>
        <p>Hi <strong>${user.username}</strong>,</p>
        <p>You're one step away from managing e-waste responsibly.</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${verificationUrl}" style="background:#27ae60;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">
            Verify Email Now
          </a>
        </p>
        <p style="font-size:14px;color:#666;">
          Or copy: <br>
          <code style="background:#f4f4f4;padding:6px 10px;border-radius:4px;font-size:13px;word-break:break-all;">
            ${verificationUrl}
          </code>
        </p>
        <p style="font-size:13px;color:#999;"><em>Link expires in 24 hours.</em></p>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#999;text-align:center;">
          © 2025 Eco Bright E-Waste Management<br>Pune, India
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email} | ${info.messageId}`);
  } catch (err) {
    console.error(`Failed to send verification email to ${user.email}:`, err.message);
    throw err;               // let caller handle
  }
};

/* --------------------------------------------------------------
   SEND WELCOME EMAIL
   -------------------------------------------------------------- */
const sendWelcomeEmail = async (user) => {
  if (!user?.email) {
    console.error('Invalid user data for welcome email');
    return;
  }

  const locatorUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const mailOptions = {
    from: `"Eco Bright" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Welcome to Eco Bright!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:12px;background:#fff;">
        <h2 style="color:#27ae60;text-align:center;">Account Verified!</h2>
        <p>Congratulations <strong>${user.username}</strong>!</p>
        <p>Your account is now active. Start locating e-waste bins near you.</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${locatorUrl}/locator" style="background:#27ae60;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">
            Go to Bin Locator
          </a>
        </p>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#999;text-align:center;">
          © 2025 Eco Bright E-Waste Management<br>Pune, India
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email} | ${info.messageId}`);
  } catch (err) {
    console.error(`Failed to send welcome email to ${user.email}:`, err.message);
    throw err;
  }
};

/* --------------------------------------------------------------
   BIN FULL NOTIFICATION (to collectors)
   -------------------------------------------------------------- */
const sendBinFullNotification = async (bin) => {
  if (!bin?.name || !bin?.address) {
    console.error('Invalid bin data for notification');
    return;
  }

  const User = require('../models/User');
  const collectors = await User.find({ role: 'collector' }).select('email');

  for (const c of collectors) {
    const mapLink = `https://www.google.com/maps?q=${bin.location.coordinates[1]},${bin.location.coordinates[0]}`;
    const mailOptions = {
      from: `"Eco Bright Alert" <${process.env.EMAIL_USER}>`,
      to: c.email,
      subject: `URGENT: Bin Full – ${bin.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:12px;background:#fff9f9;">
          <h2 style="color:#e74c3c;text-align:center;">BIN FULL ALERT</h2>
          <p><strong>Bin Name:</strong> ${bin.name}</p>
          <p><strong>Address:</strong> ${bin.address}</p>
          <p><strong>Fill Level:</strong> <span style="color:#e74c3c;font-weight:bold;">100%</span></p>
          <p><strong>Location:</strong> 
            <a href="${mapLink}" target="_blank">Open in Google Maps</a>
          </p>
          <p style="background:#fff3cd;padding:12px;border-radius:6px;border-left:4px solid #ffc107;">
            <strong>Action Required:</strong> Please collect e-waste immediately.
          </p>
          <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
          <p style="font-size:12px;color:#999;text-align:center;">
            © 2025 Eco Bright E-Waste Management
          </p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Bin-full alert sent to ${c.email} | ${info.messageId}`);
    } catch (err) {
      console.error(`Failed to alert ${c.email}:`, err.message);
    }
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendBinFullNotification,
};