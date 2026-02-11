const express = require('express');
const store = require('../store');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  if (!req.user.familyId) {
    return res.status(404).json({ error: 'No family found' });
  }

  const family = store.families.find((f) => f.id === req.user.familyId);
  if (!family) {
    return res.status(404).json({ error: 'Family not found' });
  }

  const members = store.users
    .filter((u) => u.familyId === family.id)
    .map(({ password, ...u }) => u);

  res.json({ family, members });
});

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Family name is required' });
  }

  if (req.user.familyId) {
    return res.status(400).json({ error: 'Already in a family' });
  }

  const family = {
    id: store.generateId(),
    name,
    inviteCode: store.generateInviteCode(),
    createdBy: req.user.id,
  };

  store.families.push(family);
  req.user.familyId = family.id;

  const members = [{ id: req.user.id, name: req.user.name, email: req.user.email, familyId: family.id }];
  res.status(201).json({ family, members });
});

router.post('/join', (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    return res.status(400).json({ error: 'Invite code is required' });
  }

  if (req.user.familyId) {
    return res.status(400).json({ error: 'Already in a family' });
  }

  const family = store.families.find((f) => f.inviteCode === inviteCode);
  if (!family) {
    return res.status(404).json({ error: 'Invalid invite code' });
  }

  req.user.familyId = family.id;

  const members = store.users
    .filter((u) => u.familyId === family.id)
    .map(({ password, ...u }) => u);

  res.json({ family, members });
});

router.post('/leave', (req, res) => {
  if (!req.user.familyId) {
    return res.status(400).json({ error: 'Not in a family' });
  }

  req.user.familyId = null;
  res.json({ success: true });
});

module.exports = router;
