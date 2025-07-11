import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },

  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    country: {
      type: String,
      default: 'United States'
    }
  },

  // Emergency Contact
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required']
    },
    email: {
      type: String,
      required: [true, 'Emergency contact email is required']
    }
  },

  // Medical Information
  medicalHistory: {
    allergies: [{
      type: String,
      trim: true
    }],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date
    }],
    conditions: [{
      name: String,
      diagnosedDate: Date,
      status: {
        type: String,
        enum: ['active', 'resolved', 'chronic'],
        default: 'active'
      },
      notes: String
    }],
    surgeries: [{
      procedure: String,
      date: Date,
      hospital: String,
      notes: String
    }]
  },

  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date
  },

  // Account Settings
  profilePicture: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },

  // Notification Preferences
  notificationPreferences: {
    email: {
      appointments: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      updates: { type: Boolean, default: true }
    },
    sms: {
      appointments: { type: Boolean, default: false },
      reminders: { type: Boolean, default: true },
      messages: { type: Boolean, default: false }
    },
    push: {
      appointments: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    }
  },

  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ 'address.city': 1, 'address.state': 1 });

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
patientSchema.methods.getPublicProfile = function() {
  const patientObject = this.toObject();
  delete patientObject.password;
  delete patientObject.__v;
  return patientObject;
};

// Ensure virtuals are included in JSON output
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient; 