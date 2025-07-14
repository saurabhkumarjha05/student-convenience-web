const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getProfile, uploadProfilePic, updateProfile, getActivityTimeline, getLeaderboard, getAllUsers, getUserActivity, getPublicProfile, getFriendStatus, addFriendRequest, setUsername } = require('../controllers/userController');
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

// Add route to get all users
router.get('/all', verifyToken, getAllUsers);

// Global search route
router.get('/search', verifyToken, searchController.searchAll);

// @route   GET /api/:userId/activity
// @desc    Get user activity for a specific user
// @access  Private
router.get('/:userId/activity', verifyToken, getUserActivity);

// @route   GET /api/user/public/:userId
// @desc    Get public profile of a user
// @access  Public
router.get('/public/:userId', getPublicProfile);

// @route   GET /api/:userId/friend-status
// @desc    Get friend status of a user
// @access  Private
router.get('/:userId/friend-status', verifyToken, getFriendStatus);

// @route   POST /api/:userId/add-friend
// @desc    Add a friend request to a user
// @access  Private
router.post('/:userId/add-friend', verifyToken, addFriendRequest);

// @route   PATCH /api/user/username
// @desc    Set a unique username for the user
// @access  Private
router.patch('/username', verifyToken, setUsername);

module.exports = router; 