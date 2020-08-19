const mongoose = require('mongoose');

const { Schema } = mongoose;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalData: {
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  gamerData: {
    kind: {
      type: String,
    },
    streamer: {
      type: Boolean,
    },
    platforms: {
      type: [String],
    },
    gameMode: {
      type: [String],
    },
    payModel: {
      type: [String],
    },
    genres: {
      type: [String],
    },
    twitchChannel: {
      owner: {
        type: Boolean,
      },
      link: {
        type: String,
      },
    },
    bio: {
      type: String,
    },
  },
  social: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    youtube: {
      type: String,
    },
    twitch: {
      type: String,
    },
    patreon: {
      type: String,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
