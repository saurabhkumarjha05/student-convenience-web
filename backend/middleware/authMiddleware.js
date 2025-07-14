const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from the Authorization header
 * and attach the decoded user info to the request object.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded will contain { id: user._id }
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = verifyToken; // Default export
// Optional named export for flexibility
exports.verifyToken = verifyToken;
