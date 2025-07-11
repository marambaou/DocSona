import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Recipient
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },

  // Notification Details
  type: {
    type: String,
    enum: ['appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'appointment_rescheduled', 'message', 'system', 'medical_update'],
    required: [true, 'Notification type is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },

  // Priority and Status
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },

  // Related Data
  relatedAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  relatedDoctor: {
    type: String,
    default: null
  },
  relatedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },

  // Action Data
  actionUrl: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },

  // Delivery Status
  delivery: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date, default: null },
      error: { type: String, default: null }
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date, default: null },
      error: { type: String, default: null }
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date, default: null },
      error: { type: String, default: null }
    }
  },

  // Expiration
  expiresAt: {
    type: Date,
    default: null
  },

  // Metadata
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ patientId: 1, read: 1 });
notificationSchema.index({ patientId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 });

// Virtual for is expired
notificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual for age (how old the notification is)
notificationSchema.virtual('age').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark as unread
notificationSchema.methods.markAsUnread = function() {
  this.read = false;
  this.readAt = null;
  return this.save();
};

// Static method to create appointment reminder
notificationSchema.statics.createAppointmentReminder = function(appointment) {
  const reminderTime = new Date(appointment.appointmentDateTime);
  reminderTime.setHours(reminderTime.getHours() - 24); // 24 hours before
  
  return this.create({
    patientId: appointment.patientId,
    type: 'appointment_reminder',
    title: 'Appointment Reminder',
    message: `You have an appointment with Dr. ${appointment.doctorInfo.name} tomorrow at ${appointment.time}`,
    priority: 'high',
    relatedAppointment: appointment._id,
    relatedDoctor: appointment.doctorId,
    expiresAt: appointment.appointmentDateTime
  });
};

// Static method to create appointment confirmation
notificationSchema.statics.createAppointmentConfirmation = function(appointment) {
  return this.create({
    patientId: appointment.patientId,
    type: 'appointment_confirmed',
    title: 'Appointment Confirmed',
    message: `Your appointment with Dr. ${appointment.doctorInfo.name} on ${appointment.date.toLocaleDateString()} at ${appointment.time} has been confirmed.`,
    priority: 'medium',
    relatedAppointment: appointment._id,
    relatedDoctor: appointment.doctorId
  });
};

// Static method to create appointment cancellation
notificationSchema.statics.createAppointmentCancellation = function(appointment, reason) {
  return this.create({
    patientId: appointment.patientId,
    type: 'appointment_cancelled',
    title: 'Appointment Cancelled',
    message: `Your appointment with Dr. ${appointment.doctorInfo.name} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`,
    priority: 'medium',
    relatedAppointment: appointment._id,
    relatedDoctor: appointment.doctorId
  });
};

// Pre-save middleware to set default expiration for certain types
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt && this.type === 'appointment_reminder') {
    // Set expiration to 1 hour after appointment time
    if (this.relatedAppointment) {
      // This would need to be set when creating the notification
    }
  }
  next();
});

// Ensure virtuals are included in JSON output
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 