const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const auth = require('../middleware/auth');

// Get all problems
router.get('/', async (req, res) => {
  try {
    const { difficulty, tag, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = { $in: [tag] };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const problems = await Problem.find(filter)
      .select('-testCases -starterCode')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Problem.countDocuments(filter);
    res.json({ problems, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single problem
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Send only visible test cases for display
    const sanitized = problem.toObject();
    sanitized.testCases = sanitized.testCases.filter((tc) => !tc.isHidden);
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get random problem (for clash)
router.get('/random/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const count = await Problem.countDocuments({ difficulty });
    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne({ difficulty }).skip(random).select('_id title slug difficulty tags');
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
