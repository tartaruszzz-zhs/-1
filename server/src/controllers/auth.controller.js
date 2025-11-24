const authService = require('../services/auth.service');

exports.sendCode = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        await authService.sendCode(phone);
        res.json({ status: 'ok', message: 'Verification code sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send code' });
    }
};

exports.verify = async (req, res) => {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) {
            return res.status(400).json({ message: 'Phone and code are required' });
        }

        const result = await authService.verifyCode(phone, code);
        res.json({ status: 'ok', ...result });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};
