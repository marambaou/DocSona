const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Patient', 'Doctor'],
    default: 'Patient'
  },
  phone: {
    type: String,
    required: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);
