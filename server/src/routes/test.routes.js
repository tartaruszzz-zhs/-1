const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Need to create this

// Public route to get config
router.get('/config', testController.getConfig);

// Submit test - can be public or protected. 
// If we want to save to user profile, we need auth. 
// For now, let's make it optional auth or handle it in controller.
// But middleware usually blocks if not valid.
// Let's assume the client sends a token if they have one.
// We'll create a "optionalAuth" middleware or just use the standard one and require login for saving.
// The user requirement says: "POST /test/submit ... body: { token: '...' }" 
// Standard practice is Header Authorization: Bearer ...
// Let's stick to Header.

// For simplicity, let's make it protected for now as per the flow "User inputs phone -> verify -> token -> submit".
// But maybe they can take test first? 
// The flow says: "User completes test -> Backend generates Result... User clicks 'Buy' -> Payment".
// This implies they might be anonymous first? 
// "User inputs phone... verify... returns token... subsequent API use Bearer".
// So likely they are logged in.

router.post('/submit', authMiddleware, testController.submitTest);

module.exports = router;
