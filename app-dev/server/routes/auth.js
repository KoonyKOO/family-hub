const express = require('express');
const store = require('../store');

const router = express.Router();

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (store.users.find((u) => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const user = {
    id: store.generateId(),
    name,
    email,
    password,
    familyId: null,
  };

  store.users.push(user);

  const { password: _, ...safeUser } = user;
  res.status(201).json({ user: safeUser });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = store.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
