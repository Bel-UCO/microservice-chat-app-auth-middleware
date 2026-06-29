var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();

var ApiError = require('../util/apiError');
var asyncHandler = require('../util/asyncHandler');
var jwtUtil = require('../util/jwt');
var database = require('../util/database');
var authMiddleware = require('../middleware/authMiddleware');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validateRegisterBody(body) {
  var name = String(body.name || '').trim();
  var email = normalizeEmail(body.email);
  var password = String(body.password || '');

  if (!name) {
    throw new ApiError(422, 'Name is required');
  }

  if (!email) {
    throw new ApiError(422, 'Email is required');
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError(422, 'Email format is invalid');
  }

  if (!password) {
    throw new ApiError(422, 'Password is required');
  }

  if (password.length < 8) {
    throw new ApiError(422, 'Password must be at least 8 characters');
  }

  return {
    name: name,
    email: email,
    password: password,
  };
}

function validateLoginBody(body) {
  var email = normalizeEmail(body.email);
  var password = String(body.password || '');

  if (!email) {
    throw new ApiError(422, 'Email is required');
  }

  if (!password) {
    throw new ApiError(422, 'Password is required');
  }

  return {
    email: email,
    password: password,
  };
}

router.post(
  '/register',
  asyncHandler(async function register(req, res) {
    var body = validateRegisterBody(req.body);
    var existingUser = await database.db.User.unscoped().findOne({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      throw new ApiError(409, 'Email is already registered');
    }

    var passwordHash = await bcrypt.hash(body.password, 12);
    var user = await database.db.User.create({
      name: body.name,
      email: body.email,
      passwordHash: passwordHash,
      role: 'user',
      status: 'active',
    });

    var token = jwtUtil.createAccessToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token: token,
      user: publicUser(user),
    });
  })
);

router.post(
  '/login',
  asyncHandler(async function login(req, res) {
    var body = validateLoginBody(req.body);
    var user = await database.db.User.unscoped().findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'User account is not active');
    }

    var passwordIsValid = await bcrypt.compare(body.password, user.passwordHash);

    if (!passwordIsValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    var token = jwtUtil.createAccessToken(user);

    res.json({
      message: 'Login successful',
      token: token,
      user: publicUser(user),
    });
  })
);

router.get(
  '/me',
  authMiddleware,
  asyncHandler(async function me(req, res) {
    res.json({
      user: req.user,
    });
  })
);

module.exports = router;
