const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');

router.post('/', verifyToken, eventController.createEvent);
router.get('/', verifyToken, eventController.getEvents);
router.get('/:id', verifyToken, eventController.getEventById);
router.put('/:id', verifyToken, eventController.updateEvent);
router.delete('/:id', verifyToken, eventController.deleteEvent);

module.exports = router; 