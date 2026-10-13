const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, default: 1200 },
    totalSolved: { type: Number, default: 0 },
    clashesPlayed: { type: Number, default: 0 },
    clashesWon: { type: Number, default: 0 },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    badges: [{ name: String, earnedAt: Date }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
