const Report = require('../models/Report');
const Payment = require('../models/Payment');
const TestResult = require('../models/TestResult');

exports.createReportOrder = async (req, res) => {
    try {
        const { test_id, type = 'ai' } = req.body;
        const uid = req.user.uid;

        // Verify test ownership
        const testResult = await TestResult.findOne({ where: { id: test_id, uid } });
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Create Report Record (Pending)
        const report = await Report.create({
            uid,
            test_id,
            type,
            status: 'pending'
        });

        // Create Payment Record
        const price = type === 'ai' ? 19.9 : 199.0;
        const payment = await Payment.create({
            uid,
            report_id: report.id,
            amount: price,
            status: 'pending'
        });

        // Return Payment Info (Mock)
        res.json({
            status: 'ok',
            order_id: payment.id,
            amount: price,
            payment_url: `http://localhost:3000/mock-pay?order_id=${payment.id}` // Mock payment page
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create report order' });
    }
};

exports.getReport = async (req, res) => {
    try {
        const { id } = req.params;
        const uid = req.user.uid;

        const report = await Report.findOne({ where: { id, uid } });
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch report' });
    }
};
