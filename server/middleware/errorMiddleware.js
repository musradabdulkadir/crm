const mongoose = require("mongoose");

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || res.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map((item) => item.message).join(", ");
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource ID.";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists.";
  } else if (statusCode >= 500) {
    console.error("Unhandled API error:", err);
    message = "Internal server error.";
  }

  if (res.headersSent) return next(err);
  return res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };
