const User = require('../models/User');
const LostItem = require('../models/LostItem');
const ForumPost = require('../models/ForumPost');
const Note = require('../models/Note');
const Assignment = require('../models/Assignment');
const Event = require('../models/Event');

exports.searchAll = async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.json({ users: [], notes: [], assignments: [], lostItems: [], events: [], forumPosts: [] });
  const regex = new RegExp(q, 'i');
  try {
    const [users, lostItems, forumPosts, notes, assignments, events] = await Promise.all([
      User.find({ $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex }
      ] }).select('_id firstName lastName email'),
      LostItem.find({ $or: [
        { item: regex },
        { description: regex }
      ] }).select('_id item description'),
      ForumPost.find({ $or: [
        { title: regex },
        { content: regex }
      ] }).select('_id title content'),
      Note.find({ $or: [
        { subject: regex },
        { description: regex }
      ] }).select('_id subject description'),
      Assignment.find({ $or: [
        { subject: regex },
        { title: regex }
      ] }).select('_id subject title'),
      Event.find({ title: regex }).select('_id title'),
    ]);
    res.json({
      users: users.map(u => ({ _id: u._id, name: `${u.firstName} ${u.lastName}`, email: u.email })),
      lostItems,
      forumPosts,
      notes,
      assignments,
      events
    });
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
}; 