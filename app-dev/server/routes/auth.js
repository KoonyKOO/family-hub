const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'family-hub-dev-secret';

const signToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

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
