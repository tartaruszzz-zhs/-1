const mongoose = require('mongoose');
const Redis = require('ioredis');

const connectDB = async () => {
    try {
        // MongoDB Connection
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/penality';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

    } catch (err) {
        console.error('Database Connection Error:', err.message);
        // process.exit(1); // Don't exit in dev mode if DB is missing, just log
    }
};

// Redis Connection
const redisClient = new Redis(process.env.REDIS_URI || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false, // Fail immediately if not connected
    retryStrategy: (times) => {
        // Exponential backoff with a cap, but start slower to avoid spam
        const delay = Math.min(times * 200, 5000);
        return delay;
    }
});

redisClient.on('connect', () => {
    console.log('Redis Connected');
});

redisClient.on('error', (err) => {
    // Suppress connection refused errors to avoid log spam if Redis is not running
    if (err.code === 'ECONNREFUSED') {
        // console.warn('Redis connection refused (expected if not running)');
    } else {
        console.error('Redis Error:', err);
    }
});

module.exports = connectDB;
module.exports.redisClient = redisClient;
