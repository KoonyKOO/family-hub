const express = require('express');
const crypto = require('crypto');
const Family = require('../models/Family');
const User = require('../models/User');
const PushSubscription = require('../models/PushSubscription');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

const generateInviteCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

router.get('/', async (req, res) => {
  try {
    if (!req.user.familyId) {
      return res.status(404).json({ error: 'No family found' });
    }

    const family = await Family.findById(req.user.familyId);
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }

    const members = await User.find({ familyId: family._id }).select('-password');
    const safeMembers = members.map((m) => ({ id: m._id, name: m.name, email: m.email, familyId: m.familyId }));

    res.json({ family: { id: family._id, name: family.name, inviteCode: family.inviteCode }, members: safeMembers });
  } catch {
    res.status(500).json({ error: 'Failed to fetch family' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Family name is required' });
    }

    if (req.user.familyId) {
      return res.status(400).json({ error: 'Already in a family' });
    }

    const family = await Family.create({
      name,
      inviteCode: generateInviteCode(),
      createdBy: req.user._id,
    });

    req.user.familyId = family._id;
    await req.user.save();
    await PushSubscription.updateMany({ userId: req.user._id }, { familyId: family._id });

    const members = [{ id: req.user._id, name: req.user.name, email: req.user.email, familyId: family._id }];
    res.status(201).json({ family: { id: family._id, name: family.name, inviteCode: family.inviteCode }, members });
  } catch {
    res.status(500).json({ error: 'Failed to create family' });
  }
});

router.post('/join', async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    if (req.user.familyId) {
      return res.status(400).json({ error: 'Already in a family' });
    }

    const family = await Family.findOne({ inviteCode });
    if (!family) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    req.user.familyId = family._id;
    await req.user.save();
    await PushSubscription.updateMany({ userId: req.user._id }, { familyId: family._id });

    const members = await User.find({ familyId: family._id }).select('-password');
    const safeMembers = members.map((m) => ({ id: m._id, name: m.name, email: m.email, familyId: m.familyId }));

    res.json({ family: { id: family._id, name: family.name, inviteCode: family.inviteCode }, members: safeMembers });
  } catch {
    res.status(500).json({ error: 'Failed to join family' });
  }
});

router.post('/leave', async (req, res) => {
  try {
    if (!req.user.familyId) {
      return res.status(400).json({ error: 'Not in a family' });
    }

    req.user.familyId = null;
    await req.user.save();
    await PushSubscription.updateMany({ userId: req.user._id }, { familyId: null });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to leave family' });
  }
});

module.exports = router;
