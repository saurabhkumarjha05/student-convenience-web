const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getProfile, uploadProfilePic, updateProfile, getActivityTimeline, getLeaderboard } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});
const searchController = require('../controllers/searchController');

// @route   GET /api/user/profile
// @desc    Get user profile and activity counts
// @access  Private
router.get('/profile', verifyToken, getProfile);

// @route   POST /api/user/profile-pic
// @desc    Upload profile picture
// @access  Private
router.post('/profile-pic', verifyToken, upload.single('profilePic'), uploadProfilePic);

// @route   PUT /api/user/profile
// @desc    Update user profile info
// @access  Private
router.put('/profile', verifyToken, updateProfile);

// @route   GET /api/user/activity-timeline
// @desc    Get user activity timeline for last 7 days
// @access  Private
router.get('/activity-timeline', verifyToken, getActivityTimeline);

// @route   GET /api/user/leaderboard
// @desc    Get top 5 users by total contributions
// @access  Private
router.get('/leaderboard', verifyToken, getLeaderboard);

// Global search route
router.get('/search', verifyToken, searchController.searchAll);

module.exports = router; 