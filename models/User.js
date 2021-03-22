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
    default: '',
  },
  profile: {
    cover: {
      type: String,
      default: '',
    },
    personalData: {
      realName: {
        type: String,
        default: '',
      },
      location: {
        type: String,
        default: '',
      },
    },
    gamerData: {
      kind: {
        type: String,
        default: '',
      },
      platforms: {
        nintendoswitch: {
          type: String,
          default: '',
        },
        playstation: {
          type: String,
          default: '',
        },
        xbox: {
          type: String,
          default: '',
        },
        epicgames: {
          type: String,
          default: '',
        },
        steam: {
          type: String,
          default: '',
        },
        discord: {
          type: String,
          default: '',
        },
      },
      genres: {
        type: [String],
      },
      twitchChannel: {
        streamer: {
          type: Boolean,
          default: false,
        },
        link: {
          type: String,
          default: '',
        },
      },
      bio: {
        type: String,
        default: '',
      },
    },
    social: {
      facebook: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
      youtube: {
        type: String,
        default: '',
      },
      twitch: {
        type: String,
        default: '',
      },
      patreon: {
        type: String,
        default: '',
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
