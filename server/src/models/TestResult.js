const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const TestResult = sequelize.define('TestResult', {
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
    test_version: {
        type: DataTypes.STRING,
        defaultValue: 'v1.0'
    },
    answers: {
        type: DataTypes.JSON,
        allowNull: false
    },
    scores: {
        type: DataTypes.JSON
    },
    radar_values: {
        type: DataTypes.JSON
    },
    dominant_type: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define association
User.hasMany(TestResult, { foreignKey: 'uid' });
TestResult.belongsTo(User, { foreignKey: 'uid' });

module.exports = TestResult;
