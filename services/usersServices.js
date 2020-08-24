const { createError } = require('../middleware/helpers/error');

const User = require('../models/User');

const getUsers = async (query, select) => {
  try {
    const users = await User.find(query).select(select);
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

const getUserById = async (query) => {
  try {
    const user = await User.findById(query);
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

const updateProfile = async (id, update, options) => {
  try {
    const updatedProfile = await User.findByIdAndUpdate(id, update, options);
    return updatedProfile;
  } catch (err) {
    console.error(err);
    throw createError(500, "Something went wrong while updating user's profile, try again later.");
  }
};

exports.getUsers = getUsers;
exports.getUserBy = getUserBy;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateProfile = updateProfile;
