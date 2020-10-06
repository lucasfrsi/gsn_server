const fs = require('fs');

class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createError = (statusCode, message) => {
  const error = new CustomError(statusCode, message);
  return error;
};

const handleError = (err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error) => {
      console.error(error);
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  const { statusCode, message } = err;

  res.status(statusCode || 500);
  res.json({
    statusCode: statusCode || 500,
    message: message || 'An unknown error occurred.',
  });
};

exports.CustomError = CustomError;
exports.createError = createError;
exports.handleError = handleError;
