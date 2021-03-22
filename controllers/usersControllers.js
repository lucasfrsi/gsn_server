const normalize = require('normalize-url');
const fs = require('fs');

const { createError } = require('../middleware/helpers/error');

const usersServices = require('../services/usersServices');

const SOCIAL = ['facebook', 'twitter', 'instagram', 'youtube', 'twitch', 'patreon'];
const PLATFORMS = ['nintendoswitch', 'playstation', 'xbox', 'epicgames', 'steam', 'discord'];
const GENRES = ['action', 'adventure', 'rpg', 'simulation', 'strategy', 'sports', 'mmo', 'card', 'fighting', 'platform'];
const KIND = ['casual', 'pro', ''];

const isObject = (obj) => {
  const type = typeof obj;
  // eslint-disable-next-line no-mixed-operators
  return type === 'function' || type === 'object' && !!obj;
};

const getUsersByNickname = async (req, res, next) => {
  let { query } = req.params;
  query = query.trim();
  if (!query) return next();
  try {
    const users = await usersServices.getUsers({ nickname: { $regex: query, $options: 'i' } }, 'nickname avatar profile.personalData.realName', 4);
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await usersServices.getUserById(id, 'moments posts');
    res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

// [{
//   path: 'moments',
//   model: 'Moment',
//   populate: {
//     path: 'user',
//     model: 'User',
//     select: 'nickname avatar',
//   },
// }, {
//   path: 'posts',
//   model: 'Post',
// }]

const updateProfile = async (req, res, next) => {
  const userId = req.user.id;

  try {
    if (!req.body.profile) throw createError(400, 'Invalid data.');
    if (!isObject(req.body.profile)) throw createError(400, 'Invalid data.');

    const {
      realName = '',
      location = '',
      kind = '',
      platforms = {
        nintendoswitch: '',
        playstation: '',
        xbox: '',
        epicgames: '',
        steam: '',
        discord: '',
      },
      genres = [],
      streamer = false,
      link = '',
      bio = '',
      social = {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        twitch: '',
        patreon: '',
      },
    } = req.body.profile;

    const user = await usersServices.getUserById({ _id: userId });
    if (!user) throw createError(400, 'User does not exist, could not update profile.');

    // Data Validation

    if (typeof realName !== 'string') throw createError(400, 'Invalid data. (realName)');

    if (typeof location !== 'string') throw createError(400, 'Invalid data. (location)');

    if (typeof kind !== 'string') throw createError(400, 'Invalid data. (kind)');
    if (KIND.includes(kind) === false) throw createError(400, 'Invalid data. (kind type)');

    if (!isObject(platforms)) throw createError(400, 'Invalid data. (platforms)');
    Object.entries(platforms).forEach(([key]) => {
      if (PLATFORMS.includes(key) === false) throw createError(400, 'Invalid data. (platform type)');
    });

    if (!Array.isArray(genres)) throw createError(400, 'Invalid data. (genres)');
    if (genres.length > 0) {
      genres.forEach((genre) => {
        if (GENRES.includes(genre) === false) throw createError(400, 'Invalid data. (genre types)');
      });
    }

    if (typeof streamer !== 'boolean') throw createError(400, 'Invalid data. (streamer)');

    if (typeof link !== 'string') throw createError(400, 'Invalid data. (link)');

    if (typeof bio !== 'string') throw createError(400, 'Invalid data. (bio)');
    if (bio.length > 250) throw createError(400, 'Invalid data. (bio char exceeded, max 250)');

    if (!isObject(social)) throw createError(400, 'Invalid data. (social)');
    Object.entries(social).forEach(([key, value]) => {
      if (SOCIAL.includes(key) === false) throw createError(400, 'Invalid data. (social type)');
      if (value && value.length > 0) social[key] = normalize(value, { forceHttps: true });
    });

    user.profile.personalData = {
      realName,
      location,
    };

    user.profile.gamerData = {
      kind,
      platforms,
      genres,
      twitchChannel: {
        streamer,
        link,
      },
      bio,
    };

    user.profile.social = social;

    await user.save();
    res.status(200).json({ message: 'User profile has been updated successfully.', updatedProfile: user.profile });
  } catch (err) {
    return next(err);
  }
};

const getRandomUser = async (req, res, next) => {
  try {
    const randomUser = await usersServices.getRandomUser();
    res.status(200).json({ randomUser });
  } catch (err) {
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const userId = req.user.id;
  let user;

  try {
    user = await usersServices.getUserById({ _id: userId });
    if (!user) throw createError(400, 'User does not exist, could not update avatar.');
    if (user.id !== userId) throw createError(403, 'You are not allowed to do this.');

    const avatarPath = user.avatar;

    if (avatarPath) {
      fs.unlink(avatarPath, (err) => {
        console.error(err);
      });
    }

    user.avatar = req.file.path;
    await user.save();

    res.status(200).json({ message: 'User avatar has been updated successfully.', avatar: user.avatar });
  } catch (err) {
    return next(err);
  }
};

const updateCover = async (req, res, next) => {
  const userId = req.user.id;
  let user;

  try {
    user = await usersServices.getUserById({ _id: userId });
    if (!user) throw createError(400, 'User does not exist, could not update cover.');
    if (user.id !== userId) throw createError(403, 'You are not allowed to do this.');

    const avatarPath = user.profile.cover;

    if (avatarPath) {
      fs.unlink(avatarPath, (err) => {
        console.error(err);
      });
    }

    user.profile.cover = req.file.path;
    await user.save();

    res.status(200).json({ message: 'User cover has been updated successfully.', cover: user.profile.cover });
  } catch (err) {
    return next(err);
  }
};

// Exports
exports.getUsersByNickname = getUsersByNickname;
exports.getUserById = getUserById;
exports.updateProfile = updateProfile;
exports.getRandomUser = getRandomUser;
exports.updateAvatar = updateAvatar;
exports.updateCover = updateCover;
