const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const UserController = require('../controllers/user.controller');
const validateRequest = require('../middleware/validator');
const { userSchema } = require('../validations/user.schema');

// Protected admin routes
router.use(protect, admin);

// CRUD operations
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', validateRequest(userSchema), UserController.createUser);
router.put('/:id', validateRequest(userSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// Search users
router.get('/search/:term', UserController.searchUsers);

module.exports = router;
