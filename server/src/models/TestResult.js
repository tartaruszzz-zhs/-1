const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    test_version: {
        type: String,
        default: 'v1.0',
    },
    answers: {
        type: [String], // Array of answer types e.g. ['steel_pen', 'pencil', ...]
        required: true,
    },
    scores: {
        type: Map,
        of: Number, // e.g. { 'steel_pen': 5, 'pencil': 2 }
    },
    radar_values: {
        type: [Number], // Array of values for radar chart
    },
    dominant_type: {
        type: String, // e.g. 'steel_pen'
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('TestResult', TestResultSchema);
