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
    console.log('getProfile called for user:', req.user); // Debug log
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