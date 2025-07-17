const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const UserController = require('../controllers/user.controller');
const validateRequest = require('../middleware/validator');

// All routes require authentication and admin role
router.use(protect, adminOnly);

// Search and list fleet managers with pagination
router.get('/', UserController.getFleetManagers);

// Get fleet manager by ID
router.get('/:id', UserController.getFleetManagerById);

// Update fleet manager
router.put('/:id', UserController.updateFleetManager);

// Delete fleet manager
router.delete('/:id', UserController.deleteFleetManager);

module.exports = router;
