const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['viewer', 'analyst'], default: 'viewer' }
});

module.exports = mongoose.model('User', UserSchema);
