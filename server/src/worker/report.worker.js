const Queue = require('bull');
const TestResult = require('../models/TestResult');
const User = require('../models/User');
const Report = require('../models/Report');
const penTypes = require('../data/pen_types.json');

// Connect to Redis
const reportQueue = new Queue('report_generation', process.env.REDIS_URI || 'redis://localhost:6379');

reportQueue.process(async (job) => {
    const { report_id, uid, test_id } = job.data;
    console.log(`[Worker] Processing report ${report_id} for user ${uid}`);

    try {
        // 1. Fetch Data
        const user = await User.findById(uid);
        const testResult = await TestResult.findById(test_id);

        if (!user || !testResult) {
            throw new Error('Data missing');
        }

        // 2. Construct Prompt (Mock)
        const dominantType = testResult.dominant_type;
        const penInfo = penTypes[dominantType];

        // 3. Call LLM (Mock)
        console.log(`[Worker] Calling LLM for ${dominantType}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate latency

        // Mock LLM Output
        const aiOutput = {
            summary: `Based on your test, you exhibit strong ${penInfo.name} traits. ${penInfo.slogan}`,
            core_traits: [
                { title: penInfo.name, score: testResult.scores[dominantType], description: penInfo.core_traits }
            ],
            blindspots: penInfo.shadow_side,
            practical_advice: [
                { area: "Life", advice: penInfo.advice }
            ],
            career_matches: [
                { role: "Creative Director", match_score: 0.9, rationale: "High creativity score." }
            ],
            conclusion: "Embrace your unique style.",
            raw_text_markdown: `# ${penInfo.name} Analysis\n\n## Summary\n${penInfo.core_traits}\n...`
        };

        // 4. Save Report
        const report = await Report.findById(report_id);
        report.content = aiOutput;
        report.status = 'ready';
        report.report_url = `http://localhost:3000/reports/view/${report_id}`; // Mock URL
        await report.save();

        console.log(`[Worker] Report ${report_id} ready.`);

    } catch (err) {
        console.error(`[Worker] Job failed: ${err.message}`);
        const report = await Report.findById(report_id);
        if (report) {
            report.status = 'failed';
            await report.save();
        }
    }
});

module.exports = reportQueue;
