const User = require('../models/User');
const LostItem = require('../models/LostItem');
const Delivery = require('../models/Delivery');
const Note = require('../models/Note');
const ForumPost = require('../models/ForumPost');

// @desc    Get user profile and activity counts
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // Remove or comment out the debug log in getProfile
    // console.log('getProfile called for user:', req.user); // Debug log
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Aggregate activity counts
    const [lostCount, deliveryCount, notesCount, forumCount] = await Promise.all([
      LostItem.countDocuments({ user: userId }),
      Delivery.countDocuments({ user: userId }),
      Note.countDocuments({ user: userId }),
      ForumPost.countDocuments({ user: userId })
    ]);

    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        college: user.college,
        role: user.role,
        profilePic: user.profilePic,
        createdAt: user.createdAt
      },
      activity: {
        lostCount,
        deliveryCount,
        notesCount,
        forumCount
      }
    });
  } catch (err) {
    console.error('getProfile error:', err); // Debug log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const userId = req.user.id;
    // Save relative path for frontend access (e.g., /uploads/filename)
    const profilePicUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(userId, { profilePic: profilePicUrl });
    res.json({ profilePic: profilePicUrl });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, college, role } = req.body;
    const update = {};
    if (firstName) update.firstName = firstName;
    if (lastName) update.lastName = lastName;
    if (college) update.college = college;
    if (role) update.role = role;
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

const getDateNDaysAgo = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
};

exports.getActivityTimeline = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = 7;
    const activity = [];
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = getDateNDaysAgo(i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const [lost, delivery, notes, forum] = await Promise.all([
        LostItem.countDocuments({ user: userId, createdAt: { $gte: dayStart, $lt: dayEnd } }),
        Delivery.countDocuments({ user: userId, createdAt: { $gte: dayStart, $lt: dayEnd } }),
        Note.countDocuments({ user: userId, createdAt: { $gte: dayStart, $lt: dayEnd } }),
        ForumPost.countDocuments({ user: userId, createdAt: { $gte: dayStart, $lt: dayEnd } })
      ]);
      activity.push({
        date: dayStart.toISOString().slice(0, 10),
        lost,
        delivery,
        notes,
        forum
      });
    }
    res.json({ activity });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch activity timeline', error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Aggregate total contributions for each user
    const users = await User.aggregate([
      {
        $project: {
          firstName: 1,
          lastName: 1,
          profilePic: 1,
          totalScore: {
            $add: [
              { $size: { $ifNull: ['$lostItems', []] } },
              { $size: { $ifNull: ['$deliveries', []] } },
              { $size: { $ifNull: ['$notes', []] } },
              { $size: { $ifNull: ['$forumPosts', []] } }
            ]
          }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 5 }
    ]);
    res.json({ leaderboard: users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName profilePic _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.getUserActivity = async (req, res) => {
  try {
    // Only public activity, e.g., posts, comments, returns, etc.
    const userId = req.params.userId;
    // Example: fetch forum posts and lost/found actions
    const posts = await ForumPost.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
    // You can add more activity sources here
    const activity = [
      ...posts.map(post => ({ type: 'post', description: `Posted in forum: ${post.title}`, date: post.createdAt }))
      // Add more activity types as needed
    ];
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user activity', error: err.message });
  }
};

// Get public profile by userId (no personal info)
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).select('firstName lastName userId profilePic _id');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public profile', error: err.message });
  }
};

// Get friend status
exports.getFriendStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.friends?.includes(otherId)) return res.json({ status: 'friends' });
    if (user.friendRequests?.includes(otherId)) return res.json({ status: 'pending' });
    res.json({ status: 'none' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch friend status', error: err.message });
  }
};

// Add friend request
exports.addFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherId = req.params.userId;
    if (userId.toString() === otherId) return res.status(400).json({ message: 'Cannot add yourself' });
    const user = await User.findById(userId);
    const other = await User.findById(otherId);
    if (!user || !other) return res.status(404).json({ message: 'User not found' });
    if (user.friends?.includes(otherId)) return res.status(400).json({ message: 'Already friends' });
    if (other.friendRequests?.includes(userId)) return res.status(400).json({ message: 'Request already sent' });
    other.friendRequests = other.friendRequests || [];
    other.friendRequests.push(userId);
    await other.save();
    res.json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send friend request', error: err.message });
  }
};

// PATCH /api/user/username
exports.setUsername = async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ message: 'Username is required and must be at least 3 characters' });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const user = await User.findByIdAndUpdate(userId, { username }, { new: true });
    return res.status(200).json({ message: 'Username set successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error setting username', error: err.message });
  }
};