var ApiError = require('../util/apiError');
var jwtUtil = require('../util/jwt');
var database = require('../util/database');

function getBearerToken(req) {
  var authorization = req.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice(7).trim();
}

async function authMiddleware(req, res, next) {
  try {
    var token = getBearerToken(req);

    if (!token) {
      throw new ApiError(401, 'Authorization token is required');
    }

    var payload = jwtUtil.verifyAccessToken(token);
    var userId = payload.sub || payload.userId || payload.id;

    if (!userId) {
      throw new ApiError(401, 'Invalid token payload');
    }

    var user = await database.db.User.findByPk(userId);

    if (!user || user.status !== 'active') {
      throw new ApiError(401, 'User is not allowed to access this service');
    }

    req.auth = payload;
    req.user = user.toJSON();
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'));
    }

    return next(error);
  }
}

module.exports = authMiddleware;
