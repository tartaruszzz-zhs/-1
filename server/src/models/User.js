const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        default: 'New User',
    },
    avatar: {
        type: String,
        default: '',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    last_login: {
        type: Date,
        default: Date.now,
    },
    roles: {
        type: [String],
        default: ['user'],
    },
});

module.exports = mongoose.model('User', UserSchema);
