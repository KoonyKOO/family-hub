import { useEffect, useRef, useCallback } from 'react';

const usePolling = (callback, { intervalMs = 15000, enabled = true, fetchOnMount = true } = {}) => {
  const savedCallback = useRef(callback);
  const intervalRef = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const triggerNow = useCallback(() => {
    savedCallback.current();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (fetchOnMount) {
      savedCallback.current();
    }

    const start = () => {
      stop();
      intervalRef.current = setInterval(() => savedCallback.current(), intervalMs);
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        savedCallback.current();
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [intervalMs, enabled, fetchOnMount]);

  return { triggerNow };
};

export default usePolling;
