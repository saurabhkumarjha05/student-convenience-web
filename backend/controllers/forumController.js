const ForumPost = require('../models/ForumPost');

// Create a new forum post
exports.createForumPost = async (req, res) => {
  try {
    const postData = { ...req.body, user: req.user.id };
    if (req.file) {
      postData.fileUrl = `/uploads/forum/${req.file.filename}`;
    }
    const post = new ForumPost(postData);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

// Get all forum posts
exports.getForumPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('user', 'firstName lastName').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};

// Get a single forum post by ID
exports.getForumPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate('user', 'firstName lastName');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  }
};

// Update a forum post
exports.updateForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post', error: err.message });
  }
};

// Delete a forum post
exports.deleteForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};

// Get all posts by a specific user
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: err.message });
  }
}; 