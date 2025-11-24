const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nickname: {
        type: DataTypes.STRING,
        defaultValue: 'New User'
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    last_login: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    roles: {
        type: DataTypes.JSON, // Or DataTypes.STRING if MySQL version < 5.7
        defaultValue: ['user']
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;
