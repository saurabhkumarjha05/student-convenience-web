const LostItem = require('../models/LostItem');

exports.createLostItem = async (req, res) => {
  try {
    const item = new LostItem({ ...req.body, user: req.user.id });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create lost item', error: err.message });
  }
};

exports.getLostItems = async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 }).populate('user', 'firstName lastName profilePic');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lost items', error: err.message });
  }
};

exports.getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id).populate('user', 'firstName lastName profilePic');
    if (!item) return res.status(404).json({ message: 'Lost item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lost item', error: err.message });
  }
};

exports.updateLostItem = async (req, res) => {
  try {
    const item = await LostItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Lost item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update lost item', error: err.message });
  }
};

exports.deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Lost item not found' });
    res.json({ message: 'Lost item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete lost item', error: err.message });
  }
}; 