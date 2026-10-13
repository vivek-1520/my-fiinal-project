const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

// Judge0 language IDs
const LANGUAGE_IDS = {
  cpp: 54,       // C++ (GCC 9.2.0)
  python: 71,    // Python (3.8.1)
  java: 62,      // Java (OpenJDK 13.0.1)
  javascript: 63, // JavaScript (Node.js 12.14.0)
};

// Run code without judging
router.post('/run', auth, async (req, res) => {
  try {
    const { code, language, input } = req.body;
    const langId = LANGUAGE_IDS[language];
    if (!langId) return res.status(400).json({ message: 'Unsupported language' });

    const response = await submitToJudge0(code, langId, input);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit code for judging
router.post('/:slug', auth, async (req, res) => {
  try {
    const { code, language, clashRoom, timeTaken } = req.body;
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const langId = LANGUAGE_IDS[language];
    if (!langId) return res.status(400).json({ message: 'Unsupported language' });

    // Create pending submission
    const submission = await Submission.create({
      user: req.user.id,
      problem: problem._id,
      code,
      language,
      status: 'Pending',
      totalTestCases: problem.testCases.length,
      clashRoom: clashRoom || null,
      timeTaken: timeTaken || 0,
    });

    // Run all test cases
    let passed = 0;
    let totalRuntime = 0;
    let totalMemory = 0;
    let finalStatus = 'Accepted';
    let results = [];

    for (const tc of problem.testCases) {
      const result = await submitToJudge0(code, langId, tc.input);
      const output = (result.stdout || '').trim();
      const expected = tc.expectedOutput.trim();
      const isCorrect = output === expected;

      if (isCorrect) passed++;
      else if (finalStatus === 'Accepted') {
        finalStatus = result.status?.description || 'Wrong Answer';
      }

      totalRuntime += result.time ? parseFloat(result.time) * 1000 : 0;
      totalMemory += result.memory || 0;

      results.push({
        passed: isCorrect,
        input: tc.isHidden ? '***' : tc.input,
        expected: tc.isHidden ? '***' : expected,
        output: tc.isHidden ? '***' : output,
        runtime: result.time,
        status: result.status?.description,
      });
    }

    const score = finalStatus === 'Accepted'
      ? Math.max(0, problem.points - Math.floor((timeTaken || 0) / 60) * 5)
      : 0;

    // Update submission
    submission.status = finalStatus;
    submission.testCasesPassed = passed;
    submission.runtime = totalRuntime / problem.testCases.length;
    submission.memory = totalMemory / problem.testCases.length;
    submission.score = score;
    await submission.save();

    // Update problem stats
    problem.totalSubmissions += 1;
    if (finalStatus === 'Accepted') problem.totalAccepted += 1;
    problem.acceptanceRate = Math.round((problem.totalAccepted / problem.totalSubmissions) * 100);
    await problem.save();

    // Update user stats if accepted
    if (finalStatus === 'Accepted') {
      const alreadySolved = req.user.solvedProblems.includes(problem._id);
      if (!alreadySolved) {
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { totalSolved: 1 },
          $push: { solvedProblems: problem._id },
        });
      }
    }

    res.json({
      submission: {
        id: submission._id,
        status: finalStatus,
        testCasesPassed: passed,
        totalTestCases: problem.testCases.length,
        runtime: submission.runtime,
        memory: submission.memory,
        score,
      },
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

async function submitToJudge0(code, languageId, stdin) {
  try {
    // Try with Judge0 API key first
    if (process.env.JUDGE0_API_KEY && process.env.JUDGE0_API_KEY !== 'your_judge0_api_key_here') {
      const response = await axios.post(
        `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        { source_code: code, language_id: languageId, stdin: stdin || '' },
        {
          headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
      return response.data;
    } else {
      // Fallback: simulate code execution for demo
      return simulateExecution(code, languageId, stdin);
    }
  } catch (err) {
    console.error('Judge0 error:', err.message);
    return simulateExecution(code, languageId, stdin);
  }
}

function simulateExecution(code, languageId, stdin) {
  // Simple simulation for demo when Judge0 is not configured
  return {
    stdout: '',
    stderr: null,
    compile_output: null,
    time: '0.1',
    memory: 1024,
    status: { id: 3, description: 'Accepted' },
  };
}

module.exports = router;
