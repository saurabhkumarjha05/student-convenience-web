const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getForumPosts, getForumPostById, createForumPost, updateForumPost, deleteForumPost, getUserPosts } = require('../controllers/forumController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/forum/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('file'), createForumPost);
router.get('/', verifyToken, getForumPosts);
router.get('/:id', verifyToken, getForumPostById);
router.put('/:id', verifyToken, updateForumPost);
router.delete('/:id', verifyToken, deleteForumPost);
router.get('/user/:userId/posts', verifyToken, getUserPosts);

module.exports = router; 