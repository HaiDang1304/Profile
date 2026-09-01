const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  name: { type: String },
  username: { type: String },
  avatar: { type: String },
  bio: { type: String },
  visits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProfileSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
