const normalize = require('normalize-url');
const fs = require('fs');

const { createError } = require('../middleware/helpers/error');

const usersServices = require('../services/usersServices');

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
  const { user } = req;
  const {
    avatar,
    realName,
    location,
    bio,
    kind,
    platforms,
    gameMode,
    payModel,
    genres,
    streamer,
    link,
    gamerBio,
    firstGame,
    favoriteGame,
    facebook,
    twitter,
    instagram,
    youtube,
    twitch,
    patreon,
  } = req.body;

  const newProfile = {
    avatar,
    profile: {
      personalData: {
        realName,
        location,
        bio,
      },
      gamerData: {
        kind,
        platforms,
        gameMode,
        payModel,
        genres,
        twitchChannel: {
          streamer,
          link,
        },
        bio: gamerBio,
        firstGame,
        favoriteGame,
      },
      social: {
        facebook,
        twitter,
        instagram,
        youtube,
        twitch,
        patreon,
      },
    },
  };

  try {
    // VALIDATE: kind, platforms, gameMode and payModel fields (also streamer)
    // field: Array.isArray(field) ? field : field.split(',').map((field) => ' ' + field.trim())

    // Normalize All Links
    if (avatar && avatar.length > 0) newProfile.avatar = normalize(avatar, { forceHttps: true });

    if (link && link.length > 0) newProfile.profile.gamerData.twitchChannel[link] = normalize(link, { forceHttps: true });

    Object.entries(newProfile.profile.social).forEach(([key, value]) => {
      if (value && value.length > 0) newProfile.profile.social[key] = normalize(value, { forceHttps: true });
    });

    // Supposing everything is ok, insert to DB
    const updatedProfile = await usersServices.updateProfile(user.id, newProfile, { new: true });

    res.status(200).json({ message: 'User profile has been updated successfully.', updatedProfile });
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

    res.status(200).json({ message: 'User avatar has been updated successfully.', user });
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

    res.status(200).json({ message: 'User cover has been updated successfully.', user });
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
