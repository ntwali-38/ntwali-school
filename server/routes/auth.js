const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// POST /api/auth/register - Register new user
router.post('/register', AuthController.register);

// POST /api/auth/login - Login user
router.post('/login', AuthController.login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', authenticateToken, AuthController.getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authenticateToken, AuthController.updateProfile);

// Admin routes
// GET /api/auth/admin/users - Get all users (admin only)
router.get('/admin/users', authenticateToken, requireAdmin, AuthController.getAllUsers);

// DELETE /api/auth/admin/users/:userId - Delete user (admin only)
router.delete('/admin/users/:userId', authenticateToken, requireAdmin, AuthController.deleteUser);

// PUT /api/auth/admin/users/:userId/role - Update user role (admin only)
router.put('/admin/users/:userId/role', authenticateToken, requireAdmin, AuthController.updateUserRole);

// GET /api/admin/stats - Get admin statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, AuthController.getStats);

// GET /api/admin/messages - Get admin messages (admin only)
router.get('/messages', authenticateToken, requireAdmin, AuthController.getMessages);

module.exports = router;
