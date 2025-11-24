const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const rateLimit = require('../middleware/rateLimit.middleware');

// Limit: 5 requests per hour per IP for sending code
const sendCodeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    keyGenerator: (req) => `rate-limit:send-code:${req.body.phone || req.ip}`,
    message: 'Too many verification codes sent, please try again later.'
});

router.post('/send-code', sendCodeLimiter, authController.sendCode);
router.post('/verify', authController.verify);

module.exports = router;
