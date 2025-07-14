const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  description: { type: String, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  preferredTime: { type: Date },
  status: { type: String, enum: ['open', 'accepted', 'delivered'], default: 'open' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', DeliverySchema);
