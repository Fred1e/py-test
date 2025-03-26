const express = require('express');
const router = express.Router();
const User = require('../models/user');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Twilio configuration
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// User Sign-Up (Phone Number Verification)
router.post('/signup', async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user with unverified phone and email
  const user = new User({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  await user.save();

  // Send SMS with OTP using Twilio
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  // Save OTP to database temporarily for verification
  user.phoneOtp = otp;
  await user.save();

  // Send SMS via Twilio
  twilioClient.messages.create({
    body: `Your verification OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  }).then(() => {
    res.status(200).json({ message: 'OTP sent to phone number' });
  }).catch(err => {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  });
});

// Verify Phone Number OTP
router.post('/verify-phone', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (!user || user.phoneOtp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Update phone verification status
  user.isPhoneVerified = true;
  user.phoneOtp = undefined;
  await user.save();

  res.status(200).json({ message: 'Phone number verified successfully' });
});

// Send Email Verification Link
router.post('/send-email-verification', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Generate email verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  // Send email with verification link
  const verificationUrl = `http://localhost:3000/api/auth/verify-email/${verificationToken}`;
  const mailOptions = {
    to: email,
    subject: 'Email Verification',
    text: `Click on the link to verify your email: ${verificationUrl}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }
    res.status(200).json({ message: 'Verification email sent' });
  });
});

// Verify Email Address
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: 'Email verified successfully' });
});

// Profile Settings Update
router.put('/update-profile', async (req, res) => {
  const { userId, name, profilePicture } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  if (name) user.name = name;
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();

  res.status(200).json({ message: 'Profile updated successfully' });
});

module.exports = router;
