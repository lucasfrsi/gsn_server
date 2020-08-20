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

const handleError = (err, res, next) => {
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
