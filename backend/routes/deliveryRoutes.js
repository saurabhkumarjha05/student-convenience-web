const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const deliveryController = require('../controllers/deliveryController');

router.post('/', verifyToken, deliveryController.createDelivery);
router.get('/', verifyToken, deliveryController.getDeliveries);
router.get('/:id', verifyToken, deliveryController.getDeliveryById);
router.put('/:id', verifyToken, deliveryController.updateDelivery);
router.delete('/:id', verifyToken, deliveryController.deleteDelivery);

module.exports = router; 