const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');

// Global leaderboard
router.get('/', async (req, res) => {
  try {
    const { type = 'rating', limit = 50 } = req.query;
    const sortField = type === 'solved' ? { totalSolved: -1 } : { rating: -1 };
    const users = await User.find()
      .select('username rating totalSolved clashesPlayed clashesWon badges avatar createdAt')
      .sort(sortField)
      .limit(Number(limit));

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Problem leaderboard (top submissions)
router.get('/problem/:slug', async (req, res) => {
  try {
    const Problem = require('../models/Problem');
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const submissions = await Submission.find({
      problem: problem._id,
      status: 'Accepted',
    })
      .populate('user', 'username rating')
      .sort({ runtime: 1 })
      .limit(20);

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
