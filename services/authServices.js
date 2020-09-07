const { createError } = require('../middleware/helpers/error');

const User = require('../models/User');

const getUserBy = async (query, select) => {
  try {
    const user = await User.findOne(query).select(select);
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

const getUserById = async (id, select) => {
  try {
    const user = await User.findById(id).select(select);
    return user;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching the user, try again later.');
  }
};

exports.getUserBy = getUserBy;
exports.createUser = createUser;
exports.getUserById = getUserById;
