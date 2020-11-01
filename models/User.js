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
    cover: {
      type: String,
    },
    personalData: {
      realName: {
        type: String,
      },
      location: {
        type: String,
      },
    },
    gamerData: {
      kind: {
        type: String,
      },
      platforms: {
        nintendoswitch: {
          type: String,
        },
        playstation: {
          type: String,
        },
        xbox: {
          type: String,
        },
        epicgames: {
          type: String,
        },
        steam: {
          type: String,
        },
        discord: {
          type: String,
        },
      },
      genres: {
        type: [String],
      },
      twitchChannel: {
        streamer: {
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
