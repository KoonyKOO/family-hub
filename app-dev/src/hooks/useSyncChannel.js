import { useEffect, useRef } from 'react';

const useSyncChannel = (channel, callback) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handler = (event) => {
      if (event.data?.type === 'DATA_CHANGED' && event.data.channel === channel) {
        savedCallback.current();
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  }, [channel]);
};

export default useSyncChannel;
