const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const lostItemController = require('../controllers/lostItemController');

router.post('/', verifyToken, lostItemController.createLostItem);
router.get('/', verifyToken, lostItemController.getLostItems);
router.get('/:id', verifyToken, lostItemController.getLostItemById);
router.put('/:id', verifyToken, lostItemController.updateLostItem);
router.delete('/:id', verifyToken, lostItemController.deleteLostItem);

module.exports = router;
