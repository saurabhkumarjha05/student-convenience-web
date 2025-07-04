const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const forumController = require('../controllers/forumController');
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

router.post('/', verifyToken, upload.single('file'), forumController.createForumPost);
router.get('/', verifyToken, forumController.getForumPosts);
router.get('/:id', verifyToken, forumController.getForumPostById);
router.put('/:id', verifyToken, forumController.updateForumPost);
router.delete('/:id', verifyToken, forumController.deleteForumPost);

module.exports = router; 