const { redisClient } = require('../config/db');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// In-memory fallback if Redis is not available
const memoryStore = new Map();

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const setCode = async (key, value, ttl) => {
    try {
        if (redisClient.status === 'ready') {
            await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
        } else {
            throw new Error('Redis not ready');
        }
    } catch (err) {
        console.warn('[Auth] Redis unavailable, using memory store:', err.message);
        memoryStore.set(key, { value, expires: Date.now() + ttl * 1000 });
    }
};

const getCode = async (key) => {
    try {
        if (redisClient.status === 'ready') {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } else {
            throw new Error('Redis not ready');
        }
    } catch (err) {
        // console.warn('[Auth] Redis unavailable, using memory store:', err.message);
        const data = memoryStore.get(key);
        if (!data) return null;
        if (Date.now() > data.expires) {
            memoryStore.delete(key);
            return null;
        }
        return data.value;
    }
};

const delCode = async (key) => {
    try {
        if (redisClient.status === 'ready') {
            await redisClient.del(key);
        } else {
            throw new Error('Redis not ready');
        }
    } catch (err) {
        memoryStore.delete(key);
    }
};

exports.sendCode = async (phone) => {
    const code = generateCode();
    const key = `auth:code:${phone}`;

    // Store with 5 minutes TTL (300 seconds)
    await setCode(key, { code, attempts: 0 }, 300);

    // Mock SMS sending - Log to console
    console.log(`[MOCK SMS] Sending code ${code} to ${phone}`);

    return true;
};

exports.verifyCode = async (phone, code) => {
    const key = `auth:code:${phone}`;
    const data = await getCode(key);

    if (!data) {
        throw new Error('Verification code expired or not found');
    }

    const { code: storedCode, attempts } = data;

    if (storedCode !== code) {
        // Increment attempts
        await setCode(key, { code: storedCode, attempts: attempts + 1 }, 300);
        throw new Error('Invalid verification code');
    }

    // Code is valid, delete it
    await delCode(key);

    // Find or create user
    let user = await User.findOne({ where: { phone } });
    if (!user) {
        user = await User.create({ phone });
    } else {
        user.last_login = new Date();
        await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ uid: user.id, role: user.roles }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return { token, user };
};
