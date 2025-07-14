const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateUserIdSuggestions(firstName) {
  const base = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const suggestions = [];
  while (suggestions.length < 3) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const id = `${base}${num}`;
    if (!suggestions.includes(id)) suggestions.push(id);
  }
  return suggestions;
}

// Step 1: Signup - get userId suggestions
exports.signupGetUserIds = async (req, res) => {
  try {
    const { firstName } = req.body;
    if (!firstName) return res.status(400).json({ message: 'First name required' });
    let suggestions = generateUserIdSuggestions(firstName);
    // Ensure uniqueness in DB
    for (let i = 0; i < suggestions.length; i++) {
      while (await User.findOne({ userId: suggestions[i] })) {
        const num = Math.floor(1000 + Math.random() * 9000);
        suggestions[i] = `${firstName.toLowerCase()}${num}`;
      }
    }
    // Create a signed token with the suggestions
    const suggestionsToken = jwt.sign({ suggestions }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.json({ suggestions, suggestionsToken });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate user IDs', error: err.message });
  }
};

// Step 2: Finalize signup with chosen userId
exports.signupFinalize = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userId, suggestionsToken } = req.body;
    if (!firstName || !lastName || !email || !password || !userId || !suggestionsToken) return res.status(400).json({ message: 'All fields required' });
    // Verify the suggestions token
    let decoded;
    try {
      decoded = jwt.verify(suggestionsToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired suggestions token' });
    }
    if (!decoded.suggestions || !Array.isArray(decoded.suggestions)) {
      return res.status(400).json({ message: 'Invalid suggestions token' });
    }
    if (!decoded.suggestions.includes(userId)) {
      return res.status(400).json({ message: 'User ID not in allowed suggestions' });
    }
    if (await User.findOne({ userId })) return res.status(400).json({ message: 'User ID already taken' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashed, userId });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
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
