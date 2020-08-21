const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createError } = require('../middleware/helpers/error');

const userServices = require('../services/userServices');

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  if (!email || !password) return next(createError(400, 'Both email and password are required.'));

  // Check if the user exists with the email
  try {
    user = await userServices.getUserBy({ email }, '+password');
    if (!user) throw createError(401, "The email you've entered doesn't match any account, please try again.");
  } catch (err) {
    return next(err);
  }

  // Check if the entered password is valid
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw createError(401, "The password you've entered is incorrect.");
  } catch (err) {
    return next(err);
  }

  // Generate a JSON Web Token (JWT), if successful send a response with the token
  try {
    const tokenPayload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: '1 day' }, (err, token) => {
      if (err) throw createError(500, 'Login failed, please try again later.');
      res.status(200).json({ message: 'Logged in successfully!', token });
    });
  } catch (err) {
    return next(err);
  }
};

const signUp = async (req, res, next) => {
  const { nickname, email, password } = req.body;

  // Body Validators (to-do: turn into a separate function for cleaner code purpose)
  try {
    // Nickname
    if (nickname.trim().length < 1 || nickname.trim().length > 24) throw createError(400, 'Nicknames must be between 1 and 24 characters.');
    const nicknameRegex = /^[a-zA-Z0-9]+( ?[a-zA-Z0-9]+)*$/;
    if (!nicknameRegex.test(nickname)) throw createError(400, 'Nicknames must only contain alphanumeric characters and , if needed, a space in between.');

    // Email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) throw createError(400, 'Invalid email.');

    // Password
    if (password.length < 8) throw createError(400, 'Passwords must have a minimum length of 8 characters.');
  } catch (err) {
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

  // Generate a JSON Web Token (JWT), if successful send a response with the token
  try {
    const tokenPayload = {
      user: {
        id: createdUser.id,
      },
    };
    jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: '1 day' }, (err, token) => {
      if (err) throw createError(500, 'User has been created, but token generation has failed.');
      res.status(201).json({ message: 'User has been created successfully!', token });
    });
  } catch (err) {
    return next(err);
  }
};

// Exports
exports.login = login;
exports.signUp = signUp;
