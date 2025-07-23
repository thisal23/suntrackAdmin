const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fea72bbf58b952d502f3386a8a59b4b29dfe0f98b8a15be5e9de5e2eb763d980'


const OTP_EXPIRY_MINUTES = 10;
const ADMIN_ROLE_ID = 1;
const EMAIL_FROM = process.env.EMAIL_FROM || 'wickramadharay@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'xaeyllhdwpgrfoll';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
});

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, roleId: ADMIN_ROLE_ID, isActive: true } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, roleId: user.roleId }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const register = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hash,
      roleId: ADMIN_ROLE_ID,
      isActive: true,
    });
    res.status(201).json({ message: 'Admin registered successfully', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email, roleId: ADMIN_ROLE_ID, isActive: true } });
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expires;
    await user.save();
    // Send OTP email
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: 'SunTrack Admin Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    });
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email, roleId: ADMIN_ROLE_ID, isActive: true } });
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    if (!user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'No OTP requested' });
    }
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email, roleId: ADMIN_ROLE_ID, isActive: true } });
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    if (!user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'No OTP requested' });
    }
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
