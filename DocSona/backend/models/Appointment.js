import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  // Patient and Doctor
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required']
  },
  doctorInfo: {
    name: {
      type: String,
      required: [true, 'Doctor name is required']
    },
    specialty: {
      type: String,
      required: [true, 'Doctor specialty is required']
    },
    practice: {
      type: String,
      required: [true, 'Practice name is required']
    }
  },

  // Appointment Details
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/, 'Please enter a valid time format (HH:MM AM/PM)']
  },
  duration: {
    type: Number,
    default: 30, // minutes
    min: [15, 'Duration must be at least 15 minutes'],
    max: [120, 'Duration cannot exceed 120 minutes']
  },

  // Status and Type
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine', 'specialist'],
    default: 'consultation'
  },

  // Location
  location: {
    type: String,
    required: [true, 'Appointment location is required']
  },
  room: {
    type: String,
    default: null
  },

  // Medical Information
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  notes: {
    patient: {
      type: String,
      maxlength: [1000, 'Patient notes cannot exceed 1000 characters']
    },
    doctor: {
      type: String,
      maxlength: [1000, 'Doctor notes cannot exceed 1000 characters']
    }
  },

  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date,
    default: null
  },

  // Cancellation
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'system'],
    default: null
  },
  cancellationReason: {
    type: String,
    maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
  },
  cancelledAt: {
    type: Date,
    default: null
  },

  // Reminders
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    scheduledFor: {
      type: Date,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date,
      default: null
    }
  }],

  // Payment
  payment: {
    amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'online'],
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    }
  },

  // Insurance
  insurance: {
    provider: String,
    policyNumber: String,
    coverage: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ patientId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ 'reminders.scheduledFor': 1 });

// Virtual for appointment datetime
appointmentSchema.virtual('appointmentDateTime').get(function() {
  if (!this.date || !this.time) return null;
  
  const [hours, minutes, period] = this.time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  let hour = parseInt(hours);
  
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  const appointmentDate = new Date(this.date);
  appointmentDate.setHours(hour, parseInt(minutes), 0, 0);
  
  return appointmentDate;
});

// Virtual for end time
appointmentSchema.virtual('endTime').get(function() {
  if (!this.time || !this.duration) return null;
  
  const [hours, minutes, period] = this.time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  let hour = parseInt(hours);
  let minute = parseInt(minutes);
  
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  // Add duration
  minute += this.duration;
  hour += Math.floor(minute / 60);
  minute = minute % 60;
  
  // Convert back to 12-hour format
  let endPeriod = 'AM';
  if (hour >= 12) {
    endPeriod = 'PM';
    if (hour > 12) hour -= 12;
  }
  if (hour === 0) hour = 12;
  
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${endPeriod}`;
});

// Virtual for is upcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  if (!this.appointmentDateTime) return false;
  return this.appointmentDateTime > new Date() && this.status === 'scheduled';
});

// Virtual for is past
appointmentSchema.virtual('isPast').get(function() {
  if (!this.appointmentDateTime) return false;
  return this.appointmentDateTime < new Date();
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentTime = this.appointmentDateTime;
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return this.status === 'scheduled' && hoursUntilAppointment > 24;
};

// Method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const appointmentTime = this.appointmentDateTime;
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return this.status === 'scheduled' && hoursUntilAppointment > 2;
};

// Pre-save middleware to validate appointment time
appointmentSchema.pre('save', function(next) {
  if (this.isModified('date') || this.isModified('time')) {
    const appointmentTime = this.appointmentDateTime;
    const now = new Date();
    
    if (appointmentTime < now) {
      return next(new Error('Appointment cannot be scheduled in the past'));
    }
  }
  next();
});

// Ensure virtuals are included in JSON output
appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment; 