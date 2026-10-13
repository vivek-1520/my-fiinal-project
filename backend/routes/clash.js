const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Problem = require('../models/Problem');
const { v4: uuidv4 } = require('crypto');

// Create a clash room
router.post('/create', auth, async (req, res) => {
  try {
    const { difficulty = 'Medium' } = req.body;
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Get a random problem
    const count = await Problem.countDocuments({ difficulty });
    if (count === 0) return res.status(404).json({ message: 'No problems available for this difficulty' });
    const skip = Math.floor(Math.random() * count);
    const problem = await Problem.findOne({ difficulty }).skip(skip).select('_id title slug difficulty tags');

    res.json({ roomId, problem, createdBy: req.user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Finish clash - update ratings
router.post('/finish', auth, async (req, res) => {
  try {
    const { roomId, winner, loser, winnerScore, loserScore } = req.body;
    const K = 32; // ELO K-factor

    const winnerUser = await User.findOne({ username: winner });
    const loserUser = await User.findOne({ username: loser });

    if (winnerUser && loserUser) {
      const expectedWinner = 1 / (1 + Math.pow(10, (loserUser.rating - winnerUser.rating) / 400));
      const expectedLoser = 1 - expectedWinner;

      const newWinnerRating = Math.round(winnerUser.rating + K * (1 - expectedWinner));
      const newLoserRating = Math.round(loserUser.rating + K * (0 - expectedLoser));

      await User.findByIdAndUpdate(winnerUser._id, {
        rating: Math.max(800, newWinnerRating),
        $inc: { clashesPlayed: 1, clashesWon: 1 },
      });

      await User.findByIdAndUpdate(loserUser._id, {
        rating: Math.max(800, newLoserRating),
        $inc: { clashesPlayed: 1 },
      });
    }

    res.json({ message: 'Clash finished, ratings updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
