const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../config');
const { validateSignup, validateLogin } = require('../middleware/validate');

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: '7d' });

router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    const safeUser = { id: user._id, name: user.name, email: user.email, familyId: user.familyId };
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    const safeUser = { id: user._id, name: user.name, email: user.email, familyId: user.familyId };
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
