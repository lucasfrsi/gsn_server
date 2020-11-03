const normalize = require('normalize-url');
const fs = require('fs');

const { createError } = require('../middleware/helpers/error');

const usersServices = require('../services/usersServices');

const SOCIAL = ['facebook', 'twitter', 'instagram', 'youtube', 'twitch', 'patreon'];
const PLATFORMS = ['nintendoswitch', 'playstation', 'xbox', 'epicgames', 'steam', 'discord'];
const GENRES = ['action', 'adventure', 'rpg', 'simulation', 'strategy', 'sports', 'mmo', 'card', 'fighting', 'platform'];

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
  const { userId } = req.user.id;
  let user;

  const { profile } = req.body.profile;

  const {
    personalData: {
      realName,
      location,
    },
    gamerData: {
      kind, // check if casual OR pro, else return ERROR
      platforms, // check if nintendoswitch, playstation, xbox, epicgames, steam or discord, else return ERROR
      genres, // check available genres, else return ERROR
      twitchChannel: {
        streamer, // true or false ONLY, else error
        link, // twitch channel name
      },
      bio, // limit to 250 characters
    },
    social, // check if facebook, twitter, instagram, youtube, twitch or patreon, else return ERROR
  } = profile;

  try {
    user = await usersServices.getUserById({ _id: userId });
    if (!user) throw createError(400, 'User does not exist, could not update profile.');
    if (user.id !== userId) throw createError(403, 'You are not allowed to do this.');

    // VALIDATE: kind, platforms, gameMode and payModel fields (also streamer)
    // field: Array.isArray(field) ? field : field.split(',').map((field) => ' ' + field.trim())

    // Normalize All Links

    // Object.entries(social).forEach(([key, value]) => {
    //   if (SOCIAL.includes(social[key]) && value && value.length > 0) social[key] = normalize(value, { forceHttps: true });
    // });

    // Supposing everything is ok, insert to DB
    // const updatedProfile = await usersServices.updateProfile(user.id, newProfile, { new: true });

    res.status(200).json({ message: 'User profile has been updated successfully.', updatedProfile: user });
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
