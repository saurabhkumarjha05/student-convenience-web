const Note = require('../models/Note');
const path = require('path');

// Upload a new note (PDF)
exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { subject, title, chapter, branch } = req.body;
    const fileUrl = `/uploads/notes/${req.file.filename}`;
    const note = await Note.create({
      userId: req.user.id,
      subject,
      title,
      chapter,
      branch,
      fileUrl,
      createdAt: new Date()
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload note', error: err.message });
  }
};

// Get all notes (with optional filters)
exports.getAllNotes = async (req, res) => {
  try {
    const { subject, branch, uploader } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (branch) filter.branch = branch;
    if (uploader) filter.userId = uploader;
    const notes = await Note.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes', error: err.message });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('userId', 'firstName lastName email');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch note', error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update note', error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note', error: err.message });
  }
}; 