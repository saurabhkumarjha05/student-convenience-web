const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/chat/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.get('/messages', verifyToken, chatController.getMessages);
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ fileUrl: `/uploads/chat/${req.file.filename}` });
});

// Group chat routes
router.post('/group', verifyToken, chatController.createGroup);
router.get('/groups', verifyToken, chatController.getUserGroups);
router.post('/group/:groupId/add', verifyToken, chatController.addMembers);
router.post('/group/:groupId/remove', verifyToken, chatController.removeMember);

module.exports = router; 