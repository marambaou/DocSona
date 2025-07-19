import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    default: ''
  }
});

const prescriptionSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    type: String,
    required: true
  },
  medications: [medicationSchema],
  instructions: {
    type: String,
    default: ''
  },
  followUpDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Prescription', prescriptionSchema);