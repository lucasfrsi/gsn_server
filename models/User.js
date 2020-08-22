const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    select: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  nickname: {
    type: String,
    required: true,
    maxlength: 24,
  },
  avatar: {
    type: String,
  },
  profile: {
    personalData: {
      realName: {
        type: String,
      },
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
      firstGame: {
        type: String,
      },
      favoriteGame: {
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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
