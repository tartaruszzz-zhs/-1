const Report = require('../models/Report');
const Payment = require('../models/Payment');
const TestResult = require('../models/TestResult');

exports.createReportOrder = async (req, res) => {
    try {
        const { test_id, type = 'ai' } = req.body;
        const uid = req.user.uid;

        // Verify test ownership
        const testResult = await TestResult.findOne({ _id: test_id, uid });
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Create Report Record (Pending)
        const report = new Report({
            uid,
            test_id,
            type,
            status: 'pending'
        });
        await report.save();

        // Create Payment Record
        const price = type === 'ai' ? 19.9 : 199.0;
        const payment = new Payment({
            uid,
            report_id: report._id,
            amount: price,
            status: 'pending'
        });
        await payment.save();

        // Return Payment Info (Mock)
        res.json({
            status: 'ok',
            order_id: payment._id,
            amount: price,
            payment_url: `http://localhost:3000/mock-pay?order_id=${payment._id}` // Mock payment page
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

        const report = await Report.findOne({ _id: id, uid });
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch report' });
    }
};
