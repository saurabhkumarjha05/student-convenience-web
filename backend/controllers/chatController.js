const Message = require('../models/Message');
const Channel = require('../models/Channel');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  const { channel } = req.query;
  const messages = await Message.find({ channel }).populate('sender', 'firstName lastName profilePic').sort({ createdAt: 1 });
  res.json(messages);
};

// Create a new group chat
exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ message: 'Group name and at least 2 members required.' });
    }
    const group = await Channel.create({
      name,
      members: [...new Set([...members, req.user.id])],
      admins: [req.user.id],
      isGroup: true
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create group', error: err.message });
  }
};

// List all groups the user is a member of
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Channel.find({ members: req.user.id, isGroup: true });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch groups', error: err.message });
  }
};

// Add member(s) to group
exports.addMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body;
    const group = await Channel.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.admins.includes(req.user.id)) return res.status(403).json({ message: 'Only admins can add members' });
    group.members = Array.from(new Set([...group.members, ...members]));
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add members', error: err.message });
  }
};

// Remove member from group
exports.removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const group = await Channel.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.admins.includes(req.user.id)) return res.status(403).json({ message: 'Only admins can remove members' });
    group.members = group.members.filter(id => id.toString() !== memberId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove member', error: err.message });
  }
}; 