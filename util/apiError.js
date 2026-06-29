function ApiError(statusCode, message, details) {
  this.name = 'ApiError';
  this.statusCode = statusCode;
  this.message = message;
  this.details = details;
  Error.captureStackTrace(this, ApiError);
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;
