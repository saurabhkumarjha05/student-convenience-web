const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  text: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, required: true }, // e.g. 'general', 'study-help'
  fileUrl: { type: String },
  reactions: [
    {
      emoji: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', messageSchema); 