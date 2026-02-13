const express = require('express');
const PushSubscription = require('../models/PushSubscription');
const auth = require('../middleware/auth');
const { success, error } = require('../lib/response');

const router = express.Router();

router.get('/vapid-public-key', (req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    return error(res, '푸시 알림이 설정되지 않았습니다.');
  }
  return success(res, { key });
});

router.use(auth);

router.post('/subscribe', async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return error(res, '잘못된 구독 정보입니다.', 400);
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

    return success(res);
  } catch {
    return error(res, '알림 구독에 실패했습니다.');
  }
});

router.delete('/subscribe', async (req, res) => {
  try {
    const { endpoint } = req.body || {};

    if (!endpoint) {
      return error(res, '엔드포인트 정보가 필요합니다.', 400);
    }

    await PushSubscription.deleteOne({
      userId: req.user._id,
      'subscription.endpoint': endpoint,
    });

    return success(res);
  } catch {
    return error(res, '알림 구독 해제에 실패했습니다.');
  }
});

module.exports = router;
