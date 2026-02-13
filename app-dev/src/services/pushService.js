import api from './api';

const isPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const isStandalonePWA = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const getVapidKey = async () => {
  const { key } = await api.get('/api/push/vapid-public-key');
  return key;
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const requestPermission = async () => {
  const result = await Notification.requestPermission();
  return result === 'granted';
};

const subscribeToPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const vapidKey = await getVapidKey();

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });

  await api.post('/api/push/subscribe', { subscription: subscription.toJSON() });
  return subscription;
};

const unsubscribeFromPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await api.delete('/api/push/subscribe', { endpoint: subscription.endpoint });
    await subscription.unsubscribe();
  }
};

const refreshSubscription = async () => {
  if (!isPushSupported() || Notification.permission !== 'granted') return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await api.post('/api/push/subscribe', { subscription: subscription.toJSON() });
    }
  } catch {
    // silently fail
  }
};

const pushService = {
  isPushSupported,
  isStandalonePWA,
  requestPermission,
  subscribeToPush,
  unsubscribeFromPush,
  refreshSubscription,
};

export default pushService;
