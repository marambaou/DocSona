import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine'],
    default: 'consultation'
  },
  reason: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }
}, {
  timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);