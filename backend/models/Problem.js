const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, default: '' },
  expectedOutput: { type: String, default: '' },
  isHidden: { type: Boolean, default: false },
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    tags: [{ type: String }],
    constraints: { type: String },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    testCases: [testCaseSchema],
    starterCode: {
      cpp: { type: String, default: '' },
      python: { type: String, default: '' },
      java: { type: String, default: '' },
      javascript: { type: String, default: '' },
    },
    acceptanceRate: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    totalAccepted: { type: Number, default: 0 },
    points: { type: Number, default: 100 },
    timeLimit: { type: Number, default: 2000 }, // ms
    memoryLimit: { type: Number, default: 256 }, // MB
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', problemSchema);
