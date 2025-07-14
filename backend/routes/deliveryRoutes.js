const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const deliveryController = require('../controllers/deliveryController');

// Create a new delivery request
router.post('/', verifyToken, deliveryController.createDelivery);
// Get all open deliveries
router.get('/all', verifyToken, deliveryController.getAllDeliveries);
// Get deliveries created by the logged-in user
router.get('/my', verifyToken, deliveryController.getMyDeliveries);
// Accept a delivery request
router.put('/:id/accept', verifyToken, deliveryController.acceptDelivery);
// Mark a delivery as completed
router.put('/:id/complete', verifyToken, deliveryController.completeDelivery);

module.exports = router; 