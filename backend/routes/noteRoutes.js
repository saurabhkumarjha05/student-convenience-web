const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/notes/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('file'), noteController.createNote);
router.get('/', verifyToken, noteController.getNotes);
router.get('/:id', verifyToken, noteController.getNoteById);
router.put('/:id', verifyToken, noteController.updateNote);
router.delete('/:id', verifyToken, noteController.deleteNote);

module.exports = router; 