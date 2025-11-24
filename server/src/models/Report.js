const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestResult',
        required: true,
    },
    type: {
        type: String,
        enum: ['ai', 'human'],
        default: 'ai',
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'ready', 'failed'],
        default: 'pending',
    },
    report_url: {
        type: String,
    },
    content: {
        type: Object, // JSON content from LLM
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Report', ReportSchema);
