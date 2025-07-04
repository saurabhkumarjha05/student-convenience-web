const LostItem = require('../models/LostItem');
const User = require('../models/User');

// ✅ POST /api/lost/create — Create a lost item (requires token)
exports.createLostItem = async (req, res) => {
  try {
    const { title, description, location, dateLost, imageUrl, status } = req.body;
    const userId = req.user.id;

    const lostItem = await LostItem.create({
      title,
      description,
      location,
      dateLost,
      imageUrl,
      status,
      user: userId, // 🔗 Link to user
    });

    // Optionally push to user's activity array
    await User.findByIdAndUpdate(userId, {
      $push: { lostItems: lostItem._id }
    });

    res.status(201).json({ message: 'Lost item created successfully', lostItem });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create lost item', error: err.message });
  }
};

// ✅ GET /api/lost/all — Public: Fetch all lost items
exports.getAllLostItems = async (req, res) => {
  try {
    const items = await LostItem.find().populate('user', 'firstName lastName college');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lost items', error: err.message });
  }
};

// ✅ GET /api/lost/mine — Private: Fetch items posted by current user
exports.getMyLostItems = async (req, res) => {
  try {
    const myItems = await LostItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(myItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your items', error: err.message });
  }
};
