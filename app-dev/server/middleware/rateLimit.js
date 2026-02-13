const buckets = new Map();

const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.resetTime > windowMs * 2) {
      buckets.delete(key);
    }
  }
}

function getClientKey(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';
}

function rateLimit({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later' } = {}) {
  return (req, res, next) => {
    cleanup(windowMs);

    const ip = getClientKey(req);
    const key = `${ip}:${req.baseUrl}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || now > bucket.resetTime) {
      bucket = { count: 0, resetTime: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count++;

    const remaining = Math.max(0, max - bucket.count);
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(remaining));
    res.set('X-RateLimit-Reset', String(Math.ceil(bucket.resetTime / 1000)));

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ success: false, error: message });
    }

    next();
  };
}

module.exports = rateLimit;
