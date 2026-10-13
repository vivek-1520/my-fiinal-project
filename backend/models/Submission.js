const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending'],
      default: 'Pending',
    },
    runtime: { type: Number, default: 0 }, // ms
    memory: { type: Number, default: 0 }, // KB
    score: { type: Number, default: 0 },
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    clashRoom: { type: String, default: null },
    timeTaken: { type: Number, default: 0 }, // seconds in clash
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
