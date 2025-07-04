const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER CONTROLLER
exports.signupUser = async (req, res) => {
  try {
    const { firstName, lastName, college, email, password } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !college || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save New User
    const newUser = await User.create({
      firstName,
      lastName,
      college,
      email,
      password: hashedPassword
    });

    // Create JWT Token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password before sending
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: userData
    });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({
      message: 'Signup failed',
      error: err.message
    });
  }
};

// LOGIN CONTROLLER
exports.loginUser = async (req, res) => {
  try {
    console.log('Received Body:', req.body); // ✅ Debug log

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({ message: 'Login successful', token, user: userData });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({
      message: 'Login failed',
      error: err.message,
    });
  }
};
