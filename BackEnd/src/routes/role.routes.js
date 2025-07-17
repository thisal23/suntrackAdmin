const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const RoleController = require('../controllers/role.controller');

router.use(protect); // All role routes are protected

// Get all roles (accessible by any authenticated user)
router.get('/', RoleController.getAllRoles);

// Get role by ID (accessible by any authenticated user)
router.get('/:id', RoleController.getRoleById);

// Create new role (admin only, typically not used in production)
router.post('/', adminOnly, RoleController.createRole);

module.exports = router;
