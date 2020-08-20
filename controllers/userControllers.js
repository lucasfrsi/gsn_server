const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createError } = require('../middleware/helpers/error');

const userServices = require('../services/userServices');

const login = async (req, res, next) => {

};

const signUp = async (req, res, next) => {
  const { nickname, email, password } = req.body;

  // Body Validators (to-do: turn into a separate function for cleaner code purpose)
  try {
    // Nickname
    if (!nickname) throw createError(400, 'Username is required.');
    if (nickname.length > 24) throw createError(400, 'Usernames must have a maximum length of 24 characters.');

    // Email
    if (!email) throw createError(400, 'Email is required.');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) throw createError(400, 'Invalid email.');

    // Password
    if (!password) throw createError(400, 'Password is required.');
    if (password.length < 10) throw createError(400, 'Passwords must have a minimum length of 10 characters.');
  } catch (err) {
    console.error(`Validation error! Status: [${err.statusCode}] | Message: [${err.message}]`);
    return next(err);
  }

  // Check if nickname or email are already in use
  try {
    let user;
    user = await userServices.getUserBy({ nickname });
    if (user) throw createError(400, 'Nickname already in use.');
    user = await userServices.getUserBy({ email });
    if (user) throw createError(400, 'Email already in use.');
  } catch (err) {
    return next(err);
  }

  // Hash user password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    return next(createError(500, 'Signing up failed, please try again later.'));
  }

  // Create a user document and save it to the database
  let createdUser;
  try {
    const user = {
      nickname,
      email,
      password: hashedPassword,
    };
    createdUser = await userServices.createUser(user);
  } catch (err) {
    return next(createError(500, 'Signing up failed, please try again later.'));
  }

  // Generate a JSON Web Token (JWT) and send a successful response
  const tokenPayload = {
    user: {
      id: createdUser.id,
    },
  };

  jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: '1 day' }, (err, token) => {
    if (err) throw createError(500, 'Signing up failed, please try again later.');
    res.status(201).json({ message: 'User has been created successfully!', token });
  });
};

// Utility Functions
//

// Exports
exports.login = login;
exports.signUp = signUp;
