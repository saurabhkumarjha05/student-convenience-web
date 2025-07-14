const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    college: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePic: {
      type: String,
      default: '' // URL to profile image
    },
    role: {
      type: String,
      default: 'Student'
    },
    userId: { type: String, unique: true, sparse: true }, // Permanent unique user ID

    // ✅ Optional references to user activities
    lostItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LostItem'
      }
    ],
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery'
      }
    ],
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
      }
    ],
    forumPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
