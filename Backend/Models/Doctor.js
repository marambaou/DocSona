import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
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
    required: true,
    minlength: 6
  },
  specialization: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  },
  qualification: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Doctor', doctorSchema);