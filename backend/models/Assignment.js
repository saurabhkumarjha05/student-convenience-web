const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String },
  deadline: { type: Date },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema); 