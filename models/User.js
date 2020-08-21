const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    maxlength: 24,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
  moments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Moment',
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
