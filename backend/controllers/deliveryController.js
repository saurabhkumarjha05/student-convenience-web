const Delivery = require('../models/Delivery');

// Create a new delivery request
exports.createDelivery = async (req, res) => {
  try {
    const { pickup, drop, description, urgency, preferredTime } = req.body;
    const delivery = await Delivery.create({
      userId: req.user.id,
      pickup,
      drop,
      description,
      urgency,
      preferredTime,
      status: 'open',
      createdAt: new Date()
    });
    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create delivery', error: err.message });
  }
};

// Get all open deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: 'open' }).populate('userId', 'firstName lastName email');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch deliveries', error: err.message });
  }
};

// Get deliveries created by the logged-in user
exports.getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ userId: req.user.id });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your deliveries', error: err.message });
  }
};

// Accept a delivery request
exports.acceptDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { _id: req.params.id, status: 'open' },
      { status: 'accepted', acceptedBy: req.user.id },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ message: 'Delivery not found or already accepted' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept delivery', error: err.message });
  }
};

// Mark a delivery as completed
exports.completeDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { _id: req.params.id, status: 'accepted', acceptedBy: req.user.id },
      { status: 'delivered' },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ message: 'Delivery not found or not accepted by you' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete delivery', error: err.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ _id: req.params.id, user: req.user.id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch delivery', error: err.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update delivery', error: err.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ message: 'Delivery deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete delivery', error: err.message });
  }
}; 