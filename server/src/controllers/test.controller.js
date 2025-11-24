const TestResult = require('../models/TestResult');
const questions = require('../data/questions.json');
const penTypes = require('../data/pen_types.json');

exports.getConfig = (req, res) => {
    // Return questions without the 'type' field to prevent cheating if needed, 
    // but for now returning full config is fine or we can strip it.
    // Let's strip the 'type' from options for security.
    const safeQuestions = questions.map(q => ({
        ...q,
        options: q.options.map(o => ({ label: o.label, text: o.text }))
    }));
    res.json({ version: 'v1.0', questions: safeQuestions });
};

exports.submitTest = async (req, res) => {
    try {
        const { answers } = req.body; // Expecting ['A', 'B', 'C', ...]
        const uid = req.user ? req.user.uid : null; // From Auth Middleware

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Invalid answers format' });
        }

        if (answers.length !== questions.length) {
            return res.status(400).json({ message: `Expected ${questions.length} answers, got ${answers.length}` });
        }

        const scores = {};
        const answerTypes = [];

        // Initialize scores
        Object.keys(penTypes).forEach(type => scores[type] = 0);

        // Calculate scores
        answers.forEach((ans, index) => {
            const question = questions[index];
            const option = question.options.find(o => o.label === ans);

            if (option) {
                scores[option.type] = (scores[option.type] || 0) + 1;
                answerTypes.push(option.type);
            } else {
                answerTypes.push(null); // Invalid answer for this question
            }
        });

        // Determine dominant type
        let maxScore = -1;
        let dominantType = null;

        Object.entries(scores).forEach(([type, score]) => {
            if (score > maxScore) {
                maxScore = score;
                dominantType = type;
            }
        });

        // Prepare Radar Values (Order: steel_pen, pencil, marker, quill, ballpoint, brush, highlighter, invisible)
        // We should probably define a fixed order for the frontend radar chart.
        const typeOrder = ['steel_pen', 'pencil', 'marker', 'quill', 'ballpoint', 'brush', 'highlighter', 'invisible'];
        const radarValues = typeOrder.map(type => scores[type] || 0);

        // Save Result (if user is logged in)
        let resultId = null;
        if (uid) {
            const testResult = new TestResult({
                uid,
                answers: answerTypes, // Saving the types, not the 'A/B' letters, for easier analysis
                scores,
                radar_values: radarValues,
                dominant_type: dominantType
            });
            await testResult.save();
            resultId = testResult._id;
        }

        // Return Result
        const resultData = {
            test_id: resultId,
            scores,
            radar_values: radarValues,
            dominant_type: dominantType,
            pen_info: penTypes[dominantType]
        };

        res.json(resultData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to process test submission' });
    }
};
