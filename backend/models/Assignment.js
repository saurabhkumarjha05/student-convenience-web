const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // requester
  subject: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  urgency: { type: String, enum: ['Immediate', 'Within 24 hrs', 'Flexible'], required: true },
  fileUrl: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedFile: { type: String }, // completed work
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema); 