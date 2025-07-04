const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: String, required: true },
  description: { type: String },
  found: { type: Boolean, default: false },
  // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
