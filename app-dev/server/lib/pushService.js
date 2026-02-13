const PushSubscription = require('../models/PushSubscription');

let webpush = null;

const getWebPush = () => {
  if (!webpush) {
    webpush = require('web-push');
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:admin@familyhub.app';
    if (publicKey && privateKey) {
      webpush.setVapidDetails(subject, publicKey, privateKey);
    }
  }
  return webpush;
};

const notifyFamily = async (familyId, payload) => {
  if (!familyId || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;

  const wp = getWebPush();
  const subscriptions = await PushSubscription.find({ familyId });

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await wp.sendNotification(sub.subscription, JSON.stringify(payload));
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await PushSubscription.deleteOne({ _id: sub._id });
        }
        throw err;
      }
    })
  );

  return results;
};

module.exports = { notifyFamily };
