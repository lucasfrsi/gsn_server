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
  const { statusCode, message } = err;
  if (res.headersSent) {
    return next(err);
  }
  res.status(statusCode || 500);
  res.json({
    statusCode: statusCode || 500,
    msg: message || 'An unknown server error occurred.',
  });
};

exports.CustomError = CustomError;
exports.createError = createError;
exports.handleError = handleError;
