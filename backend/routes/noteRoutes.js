const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const noteController = require('../controllers/noteController');

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/notes/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed!'));
}});

// Upload a new note (PDF)
router.post('/upload', verifyToken, upload.single('file'), noteController.uploadNote);
// Get all notes (with optional filters)
router.get('/all', noteController.getAllNotes);
// Get a single note by ID
router.get('/:id', noteController.getNoteById);

module.exports = router; 