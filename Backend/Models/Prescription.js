const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
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
    type: String
  }
});

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  medications: [MedicationSchema],
  diagnosis: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  prescribedDate: {
    type: Date,
    default: Date.now
  },
  followUpDate: {
    type: Date
  }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
