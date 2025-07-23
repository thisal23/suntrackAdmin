const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/fleet-manager-registrations', userController.getFleetManagerRegistrations);
router.get('/registration-stats', userController.getRegistrationStats);
router.get('/recent-registrations', userController.getRecentRegistrations);

module.exports = router;