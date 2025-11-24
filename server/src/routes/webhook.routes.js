const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Report = require('../models/Report');
const reportQueue = require('../worker/report.worker'); // Import the queue

router.post('/payment', async (req, res) => {
    try {
        const { order_id, status } = req.body; // Mock payload from payment provider

        if (status !== 'paid') {
            return res.json({ status: 'ignored' });
        }

        const payment = await Payment.findById(order_id);
        if (!payment) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (payment.status === 'paid') {
            return res.json({ status: 'already_paid' });
        }

        // Update Payment
        payment.status = 'paid';
        await payment.save();

        // Update Report Status
        const report = await Report.findById(payment.report_id);
        if (report) {
            report.status = 'processing';
            await report.save();

            // Add to Queue
            reportQueue.add({
                report_id: report._id,
                uid: report.uid,
                test_id: report.test_id
            });
        }

        res.json({ status: 'success' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Webhook failed' });
    }
});

module.exports = router;
