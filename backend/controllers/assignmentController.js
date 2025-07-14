const Assignment = require('../models/Assignment');
const path = require('path');

// Create a new assignment request
exports.createAssignment = async (req, res) => {
  try {
    const { subject, description, deadline, urgency } = req.body;
    const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : undefined;
    const assignment = await Assignment.create({
      userId: req.user.id,
      subject,
      description,
      deadline,
      urgency,
      fileUrl,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create assignment', error: err.message });
  }
};

// Get all assignments (for helpers/admins)
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('userId', 'firstName lastName email').populate('acceptedBy', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: err.message });
  }
};

// Get assignments created by the logged-in user
exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your assignments', error: err.message });
  }
};

// Helper accepts an assignment
exports.acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { status: 'accepted', acceptedBy: req.user.id, updatedAt: new Date() },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Assignment not found or already accepted' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept assignment', error: err.message });
  }
};

// Helper submits completed work
exports.submitAssignment = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const submittedFile = `/uploads/assignments/${req.file.filename}`;
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, status: 'accepted', acceptedBy: req.user.id },
      { submittedFile, status: 'completed', updatedAt: new Date() },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Assignment not found or not accepted by you' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit completed work', error: err.message });
  }
};

// Student marks assignment as received/completed
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['completed', 'received'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Assignment not found or not yours' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update assignment status', error: err.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, user: req.user.id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignment', error: err.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update assignment', error: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete assignment', error: err.message });
  }
}; 