const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create', authMiddleware, reportController.createReportOrder);
router.get('/:id', authMiddleware, reportController.getReport);

module.exports = router;
