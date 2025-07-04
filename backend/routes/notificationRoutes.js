const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// Get all notifications for user
router.get('/', verifyToken, notificationController.getNotifications);
// Mark one notification as read
router.patch('/:id/read', verifyToken, notificationController.markAsRead);
// Mark all as read
router.patch('/read-all', verifyToken, notificationController.markAllAsRead);

module.exports = router; 