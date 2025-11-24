const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Report = require('./Report');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Report,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'CNY'
    },
    method: {
        type: DataTypes.STRING,
        defaultValue: 'wechat'
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
User.hasMany(Payment, { foreignKey: 'uid' });
Payment.belongsTo(User, { foreignKey: 'uid' });

// Report association will be defined in Report.js or here if Report is loaded.
// To avoid circular dependency issues, sometimes it's better to define associations in a separate file or be careful with require order.
// For now, let's assume Report is required.

module.exports = Payment;
