const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  university: String,
  major: String,
  race: String,
  ethnicity: String,
  gender: String,
  resume: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  transcript: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
