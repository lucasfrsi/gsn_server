const jwt = require('jsonwebtoken');
const { createError } = require('./helpers/error');

module.exports = (req, res, next) => {
  try {
    // Check if Authorization: 'Bearer TOKEN'
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw createError(401, 'No token, authorization failed.');

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) throw createError(401, 'Invalid token, authorization failed.');
      req.user = decodedToken.user;
      next();
    });
  } catch (err) {
    return next(err);
  }
};
