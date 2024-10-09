const client = require('../config/RedisConfig');
const logMessage = require('./Logging');

const RateLimiter = async (req, res, next) => {
  if (!client.isOpen) {
    // If not connected, attempt to connect
    try {
      await client.connect();
    } catch (error) {
      logMessage(req.ip, req.body.phoneNumber, 500, 'Could not connect to Redis');
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const ip = req.ip;
  const { phoneNumber, message } = req.body;
  const minuteKey = `${ip}:${phoneNumber}:minute`;
  const dayKey = `${ip}:${phoneNumber}:day`;

  if (!phoneNumber || !message) {
    logMessage(req.ip, req.body.phoneNumber, 400, 'Phone number and message are required.');
    return res.status(400).json({ error: 'Phone number and message are required.' });
  }

  try {
    const replies = await client.multi()
      .incr(minuteKey)
      .expire(minuteKey, 60)
      .incr(dayKey)
      .expire(dayKey, 86400)
      .exec();

    const minuteCount = replies[0];
    const dayCount = replies[2];

    // Check minute limit (e.g., max 3 requests per minute)
    if (minuteCount > 3) {
      logMessage(ip, phoneNumber, 429, 'Rate Limit Violation: Minute limit exceeded');
      return res.set('Retry-After', 60).status(429).json({ error: 'Too many requests. Try again in 1 minute.' });
    }

    // Check day limit (e.g., max 10 requests per day)
    if (dayCount > 10) {
      logMessage(ip, phoneNumber, 429, 'Rate Limit Violation: Day limit exceeded');
      return res.set('Retry-After', 86400).status(429).json({ error: 'Too many requests. Try again tomorrow.' });
    }

    // If limits are not exceeded, proceed to the next middleware
    logMessage(ip, phoneNumber, res.statusCode, 'Rate Limit Violation: No violation');
    next();
  } catch (err) {
    logMessage(ip, phoneNumber, 500, 'Server error while applying rate limiting');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = RateLimiter;
