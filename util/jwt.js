var jwt = require('jsonwebtoken');
var config = require('./config');

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = {
  createAccessToken: createAccessToken,
  verifyAccessToken: verifyAccessToken,
};
