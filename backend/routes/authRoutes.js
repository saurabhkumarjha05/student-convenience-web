const express = require('express');
const { loginUser, signupGetUserIds, signupFinalize } = require('../controllers/authController');
const router = express.Router();

// router.post('/register', signupUser); // Removed old signup route
router.post('/login', loginUser);
router.post('/suggest-userids', signupGetUserIds);
router.post('/finalize-signup', (req, res, next) => {
  console.log('HIT /auth/finalize-signup', req.body);
  next();
}, signupFinalize);

module.exports = router;
