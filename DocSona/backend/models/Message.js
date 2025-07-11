import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Conversation participants
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required']
  },

  // Message content
  sender: {
    type: String,
    enum: ['patient', 'doctor'],
    required: [true, 'Sender type is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },

  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  }],

  // Message status
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  delivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date,
    default: null
  },

  // Related appointment (if message is about an appointment)
  relatedAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },

  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },

  // Message flags
  isUrgent: {
    type: Boolean,
    default: false
  },
  isSystem: {
    type: Boolean,
    default: false
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
messageSchema.index({ patientId: 1, doctorId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ read: 1 });
messageSchema.index({ relatedAppointment: 1 });

// Virtual for conversation ID (unique identifier for patient-doctor conversation)
messageSchema.virtual('conversationId').get(function() {
  const participants = [this.patientId.toString(), this.doctorId.toString()].sort();
  return participants.join('_');
});

// Virtual for is from patient
messageSchema.virtual('isFromPatient').get(function() {
  return this.sender === 'patient';
});

// Virtual for is from doctor
messageSchema.virtual('isFromDoctor').get(function() {
  return this.sender === 'doctor';
});

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  this.delivered = true;
  this.deliveredAt = new Date();
  return this.save();
};

// Static method to get conversation between patient and doctor
messageSchema.statics.getConversation = function(patientId, doctorId, limit = 50, skip = 0) {
  const patientObjectId = new mongoose.Types.ObjectId(patientId);
  
  return this.find({
    patientId: patientObjectId,
    doctorId
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('patientId', 'firstName lastName profilePicture')
  .populate('relatedAppointment', 'date time status')
  .populate('replyTo', 'content sender');
};

// Static method to get unread message count for a patient
messageSchema.statics.getUnreadCount = function(patientId) {
  const patientObjectId = new mongoose.Types.ObjectId(patientId);
  
  return this.countDocuments({
    patientId: patientObjectId,
    sender: 'doctor',
    read: false
  });
};

// Static method to get recent conversations for a patient
messageSchema.statics.getRecentConversations = function(patientId) {
  const patientObjectId = new mongoose.Types.ObjectId(patientId);
  
  return this.aggregate([
    {
      $match: {
        $or: [
          { patientId: patientObjectId },
          { doctorId: patientId.toString() }
        ]
      }
    },
    {
      $addFields: {
        conversationId: {
          $cond: {
            if: { $eq: ['$patientId', patientObjectId] },
            then: { $concat: [{ $toString: '$patientId' }, '_', '$doctorId'] },
            else: { $concat: ['$doctorId', '_', { $toString: '$patientId' }] }
          }
        },
        otherParticipant: {
          $cond: {
            if: { $eq: ['$patientId', patientObjectId] },
            then: '$doctorId',
            else: '$patientId'
          }
        }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$sender', 'doctor'] },
                  { $eq: ['$read', false] },
                  { $eq: ['$patientId', patientObjectId] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);
};

// Pre-save middleware to validate message content
messageSchema.pre('save', function(next) {
  if (this.content.trim().length === 0 && this.messageType === 'text') {
    return next(new Error('Message content cannot be empty'));
  }
  next();
});

// Ensure virtuals are included in JSON output
messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

const Message = mongoose.model('Message', messageSchema);

export default Message; 