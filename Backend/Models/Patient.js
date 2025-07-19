import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Patient', patientSchema);