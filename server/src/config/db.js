const { Sequelize } = require('sequelize');
const Redis = require('ioredis');

// MySQL Connection (Sequelize)
const sequelize = new Sequelize(
    process.env.DB_NAME || 'penality',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected');

        // Sync models (in production, use migrations instead of sync({ alter: true }))
        // await sequelize.sync({ alter: true }); 
        // console.log('MySQL Models Synced');
    } catch (err) {
        console.error('Database Connection Error:', err.message);
    }
};

// Redis Connection
const redisClient = new Redis(process.env.REDIS_URI || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: (times) => {
        const delay = Math.min(times * 200, 5000);
        return delay;
    }
});

redisClient.on('connect', () => {
    console.log('Redis Connected');
});

redisClient.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        // console.warn('Redis connection refused');
    } else {
        console.error('Redis Error:', err);
    }
});

module.exports = connectDB;
module.exports.sequelize = sequelize;
module.exports.redisClient = redisClient;
