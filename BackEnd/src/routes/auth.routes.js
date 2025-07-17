const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const AuthController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validator');
const { 
  userSchema, 
  loginSchema, 
  resetPasswordSchema, 
  verifyOtpSchema 
} = require('../validations/user.schema');

// Public routes
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/reset-password', validateRequest(resetPasswordSchema), AuthController.resetPasswordRequest);
router.post('/verify-otp', validateRequest(verifyOtpSchema), AuthController.verifyOTPAndResetPassword);
router.post('/register-admin', validateRequest(userSchema), AuthController.registerAdmin);



// Protected routes
router.get('/profile', protect, AuthController.getProfile);

// Admin only routes
router.post('/register/fleet-manager', protect, adminOnly, validateRequest(userSchema), AuthController.registerFleetManager);

module.exports = router;
