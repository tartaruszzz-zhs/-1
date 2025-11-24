const { redisClient } = require('../config/db');

const rateLimit = (options) => {
    const { windowMs, max, keyGenerator, message } = options;

    return async (req, res, next) => {
        try {
            if (redisClient.status !== 'ready') {
                // Redis is down, skip rate limiting (fail open)
                return next();
            }

            const key = keyGenerator ? keyGenerator(req) : `rate-limit:${req.ip}`;

            const current = await redisClient.incr(key);

            if (current === 1) {
                await redisClient.expire(key, windowMs / 1000);
            }

            if (current > max) {
                return res.status(429).json({ message: message || 'Too many requests, please try again later.' });
            }

            next();
        } catch (err) {
            console.error('Rate Limit Error:', err);
            // Fail open if Redis is down
            next();
        }
    };
};

module.exports = rateLimit;
