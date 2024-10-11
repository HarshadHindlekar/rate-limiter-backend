const client = require('../config/RedisConfig');
const logMessage = require('../logs/Logging');

const RateLimiter = async (req, res, next) => {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (error) {
      logMessage(req.ip, req.body.phoneNumber, 500, 'Could not connect to Redis');
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Your rate limiter logic
  const ip = req.ip;
  const { phoneNumber, message } = req.body;
  const minuteKey = `${ip}:${phoneNumber}:minute`;
  const dayKey = `${ip}:${phoneNumber}:day`;

  if (!phoneNumber || !message) {
    logMessage(ip, phoneNumber, 400, 'Phone number and message are required.');
    return res.status(400).json({ error: 'Phone number and message are required.' });
  }

  try {
    await client.RPUSH(`${phoneNumber}:messages`, message); // Store message
    const replies = await client.multi()
      .incr(minuteKey)
      .expire(minuteKey, 60)
      .incr(dayKey)
      .expire(dayKey, 86400)
      .exec();

    const minuteCount = replies[0];
    const dayCount = replies[2];

    if (minuteCount > 3) {
      logMessage(ip, phoneNumber, 429, 'Rate Limit Violation: Minute limit exceeded');
      return res.set('Retry-After', 60).status(429).json({ error: 'Too many requests. Try again in 1 minute.' });
    }

    if (dayCount > 10) {
      logMessage(ip, phoneNumber, 429, 'Rate Limit Violation: Day limit exceeded');
      return res.set('Retry-After', 86400).status(429).json({ error: 'Too many requests. Try again tomorrow.' });
    }

    next();
  } catch (err) {
    logMessage(ip, phoneNumber, 500, err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = RateLimiter;
