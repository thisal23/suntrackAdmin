const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/fleet-manager-registrations', userController.getFleetManagerRegistrations);
router.get('/registration-stats', userController.getRegistrationStats);
router.get('/recent-registrations', userController.getRecentRegistrations);
router.get('/fleet-managers', userController.getFleetManagers);
router.post('/fleet-managers', userController.addFleetManager);
router.put('/fleet-managers/:id', userController.editFleetManager);
router.delete('/fleet-managers/:id', userController.deleteFleetManager);

// Auth routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;