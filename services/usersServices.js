const mongoose = require('mongoose');
const fs = require('fs');
const { createError } = require('../middleware/helpers/error');

const User = require('../models/User');
const Post = require('../models/Post');
const Moment = require('../models/Moment');

const getUsers = async (query, select, limit) => {
  try {
    const users = await User.find(query).select(select).limit(limit);
    return users;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching users, try again later.');
  }
};

const getUserBy = async (query, select) => {
  try {
    const user = await User.findOne(query).select(select);
    return user;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching the user, try again later.');
  }
};

const getUserById = async (query, ...populateParams) => {
  try {
    const user = await User.findById(query).populate(...populateParams);
    return user;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching the user, try again later.');
  }
};

const createUser = async (user) => {
  const createdUser = new User(user);
  try {
    await createdUser.save();
    return createdUser;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while saving the user, try again later.');
  }
};

const getRandomUser = async () => {
  try {
    const count = await User.countDocuments({});
    const randomNumber = Math.floor(Math.random() * count);
    const randomUser = await User.find().limit(1).skip(randomNumber);
    return randomUser;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching a random user, try again later.');
  }
};

const deleteUser = async (userId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find user to get hold of the avatar and cover images
    const user = await User.findOne({ _id: userId }).session(session);
    const userAvatarUrl = user.avatar;
    const userCoverUrl = user.profile.cover;

    // Find all the user moments to get hold of their images
    const userMoments = await Moment.find({ user: userId }).session(session);

    // Remove User Posts
    await Post.deleteMany({ user: userId }).session(session);

    // Remove User Moments
    await Moment.deleteMany({ user: userId }).session(session);

    // Remove User Likes and Comments
    await Post.updateMany({}, {
      $pull: {
        comments: {
          user: userId
        }
    }}).session(session);

    await Post.updateMany({}, {
      $pull: {
        likes: {
          user: userId
        }
    }}).session(session);

    // Remove User Reactions
    await Moment.updateMany({}, {
      $pull: {
        reactions: {
          user: userId
        }
    }}).session(session);

    // Remove User Itself
    await User.findOneAndDelete({ _id: userId }).session(session);

    // Remove User Moments Images
    if (userMoments.length > 0) {
      await Promise.all(userMoments.map(async ({ imageUrl }) => {
        await fs.unlink(imageUrl, (err) => {
          if (err) console.error(err);
        });
      }));
    }

    // Remove User Avatar
    if (userAvatarUrl) {
      await fs.unlink(userAvatarUrl, (err) => {
        if (err) console.error(err);
      });
    }

    // Remove User Cover
    if (userCoverUrl) {
      await fs.unlink(userCoverUrl, (err) => {
        if (err) console.error(err);
      });
    }

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    throw createError(500, 'Something went wrong while deleting user, try again later.');
  }
};

exports.getUsers = getUsers;
exports.getUserBy = getUserBy;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.getRandomUser = getRandomUser;
exports.deleteUser = deleteUser;
