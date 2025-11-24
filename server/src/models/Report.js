const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const TestResult = require('./TestResult');

const Report = sequelize.define('Report', {
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
    test_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TestResult,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('ai', 'human'),
        defaultValue: 'ai'
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'ready', 'failed'),
        defaultValue: 'pending'
    },
    report_url: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.JSON // JSON content from LLM
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
User.hasMany(Report, { foreignKey: 'uid' });
Report.belongsTo(User, { foreignKey: 'uid' });

TestResult.hasOne(Report, { foreignKey: 'test_id' });
Report.belongsTo(TestResult, { foreignKey: 'test_id' });

module.exports = Report;
