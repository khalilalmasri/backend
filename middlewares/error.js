// not found error handler middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : err.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : null,
    // error: err
    // error: err.message
    // error: err.stack
  });
};

module.exports = {  errorHandler , notFound };
