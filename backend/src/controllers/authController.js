const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('Email is already registered');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      user: user.toSafeJSON(),
      token: generateToken(user._id),
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      user: user.toSafeJSON(),
      token: generateToken(user._id),
    },
  });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toSafeJSON() });
});

module.exports = { signup, login, me };
