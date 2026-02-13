const express = require('express');
const PushSubscription = require('../models/PushSubscription');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/vapid-public-key', (req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    return res.status(500).json({ error: 'VAPID key not configured' });
  }
  res.json({ key });
});

router.use(auth);

router.post('/subscribe', async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }

    await PushSubscription.findOneAndUpdate(
      { userId: req.user._id, 'subscription.endpoint': subscription.endpoint },
      {
        userId: req.user._id,
        familyId: req.user.familyId || null,
        subscription,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

router.delete('/subscribe', async (req, res) => {
  try {
    const { endpoint } = req.body || {};

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }

    await PushSubscription.deleteOne({
      userId: req.user._id,
      'subscription.endpoint': endpoint,
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to remove subscription' });
  }
});

module.exports = router;
