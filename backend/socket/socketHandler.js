const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');
const Channel = require('../models/Channel');

const channels = ['general', 'study-help', 'events', 'lost-found', 'random'];

function socketHandler(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      if (!token) return next(new Error('Auth error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id);
      if (!socket.user) return next(new Error('User not found'));
      next();
    } catch (err) {
      next(new Error('Auth error'));
    }
  });

  io.on('connection', (socket) => {
    // Join all default channels
    channels.forEach(channel => socket.join(channel));
    // Join all group channels the user is a member of
    Channel.find({ members: socket.user._id }).then(groups => {
      groups.forEach(group => socket.join(`group_${group._id}`));
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ text, channel, fileUrl }) => {
      // Allow default channels, DMs, and group channels
      if (!channels.includes(channel) && !channel.startsWith('dm_') && !channel.startsWith('group_')) return;
      const message = await Message.create({
        text, channel, fileUrl, sender: socket.user._id
      });
      const populated = await message.populate('sender', 'firstName lastName profilePic');
      io.to(channel).emit('newMessage', populated);
    });

    // Handle message reactions
    socket.on('reactToMessage', async ({ messageId, emoji }) => {
      const message = await Message.findById(messageId);
      if (!message) return;
      // Remove previous reaction by this user for this emoji
      message.reactions = message.reactions.filter(r => !(r.user.equals(socket.user._id) && r.emoji === emoji));
      // Add new reaction
      message.reactions.push({ emoji, user: socket.user._id });
      await message.save();
      const populated = await message.populate('sender', 'firstName lastName profilePic');
      io.to(message.channel).emit('messageReaction', { messageId, reactions: message.reactions });
    });

    // User presence
    socket.broadcast.emit('userOnline', { userId: socket.user._id, name: socket.user.firstName });

    socket.on('disconnect', () => {
      socket.broadcast.emit('userOffline', { userId: socket.user._id });
    });
  });
}

module.exports = socketHandler; 