const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  createLostItem,
  getAllLostItems,
  getMyLostItems
} = require('../controllers/lostController');

// 🔒 POST - Create new lost item (user must be logged in)
router.post('/create', verifyToken, createLostItem);

// 🟢 GET - Public route to fetch all lost items
router.get('/all', getAllLostItems);

// 🔒 GET - Get only logged-in user's lost items
router.get('/mine', verifyToken, getMyLostItems);

module.exports = router;
