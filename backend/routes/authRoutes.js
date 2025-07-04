const express = require('express');
const { signupUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', signupUser);
router.post('/login', loginUser);

module.exports = router;
