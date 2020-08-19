const mongoose = require('mongoose');

const { Schema } = mongoose;

const momentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  text: {
    type: String,
    required: true,
    maxlength: 150,
  },
  image: {
    type: String,
  },
  reactions: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model('Moment', momentSchema);
