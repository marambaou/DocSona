import express from 'express';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';

const router = express.Router();

// Middleware to authenticate patient
const authenticatePatient = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const patient = await Patient.findById(decoded.patientId);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    req.patient = patient;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/mock/doctors
// @desc    Get mock doctors data for frontend
// @access  Public
router.get('/doctors', async (req, res) => {
  try {
    const { specialty, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Mock doctors data
    const mockDoctors = [
      {
        _id: 'doc1',
        firstName: 'John',
        lastName: 'Smith',
        specialty: 'Cardiology',
        practice: {
          name: 'Heart Care Center',
          address: {
            street: '123 Medical Drive',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        },
        rating: {
          average: 4.8,
          totalReviews: 127
        },
        experience: 15,
        profilePicture: null,
        bio: 'Experienced cardiologist with expertise in heart disease prevention and treatment.',
        languages: ['English', 'Spanish']
      },
      {
        _id: 'doc2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        specialty: 'Dermatology',
        practice: {
          name: 'Skin Health Clinic',
          address: {
            street: '456 Health Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210'
          }
        },
        rating: {
          average: 4.9,
          totalReviews: 89
        },
        experience: 12,
        profilePicture: null,
        bio: 'Board-certified dermatologist specializing in skin cancer detection and cosmetic procedures.',
        languages: ['English', 'French']
      },
      {
        _id: 'doc3',
        firstName: 'Michael',
        lastName: 'Brown',
        specialty: 'General Medicine',
        practice: {
          name: 'Primary Care Associates',
          address: {
            street: '789 Wellness Street',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601'
          }
        },
        rating: {
          average: 4.7,
          totalReviews: 203
        },
        experience: 20,
        profilePicture: null,
        bio: 'Comprehensive primary care physician with focus on preventive medicine.',
        languages: ['English', 'German']
      },
      {
        _id: 'doc4',
        firstName: 'Emily',
        lastName: 'Davis',
        specialty: 'Pediatrics',
        practice: {
          name: 'Children\'s Health Center',
          address: {
            street: '321 Kids Lane',
            city: 'Miami',
            state: 'FL',
            zipCode: '33101'
          }
        },
        rating: {
          average: 4.9,
          totalReviews: 156
        },
        experience: 8,
        profilePicture: null,
        bio: 'Pediatrician dedicated to providing compassionate care for children of all ages.',
        languages: ['English', 'Spanish', 'Portuguese']
      },
      {
        _id: 'doc5',
        firstName: 'David',
        lastName: 'Wilson',
        specialty: 'Orthopedics',
        practice: {
          name: 'Bone & Joint Institute',
          address: {
            street: '654 Recovery Road',
            city: 'Houston',
            state: 'TX',
            zipCode: '77001'
          }
        },
        rating: {
          average: 4.6,
          totalReviews: 94
        },
        experience: 18,
        profilePicture: null,
        bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
        languages: ['English']
      }
    ];

    // Filter by specialty
    let filteredDoctors = mockDoctors;
    if (specialty && specialty !== 'all') {
      filteredDoctors = mockDoctors.filter(doctor => 
        doctor.specialty.toLowerCase() === specialty.toLowerCase()
      );
    }

    // Search by name or specialty
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.firstName.toLowerCase().includes(searchLower) ||
        doctor.lastName.toLowerCase().includes(searchLower) ||
        doctor.specialty.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = filteredDoctors.length;
    const paginatedDoctors = filteredDoctors.slice(skip, skip + parseInt(limit));

    res.json({
      doctors: paginatedDoctors,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get mock doctors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/mock/doctors/specialties
// @desc    Get available specialties
// @access  Public
router.get('/doctors/specialties', async (req, res) => {
  try {
    const specialties = [
      'Cardiology',
      'Dermatology',
      'General Medicine',
      'Orthopedics',
      'Pediatrics',
      'Neurology',
      'Oncology',
      'Psychiatry',
      'Surgery',
      'Emergency Medicine'
    ];
    
    res.json({ specialties });
  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/mock/doctors/:id
// @desc    Get specific doctor details
// @access  Private
router.get('/doctors/:id', authenticatePatient, async (req, res) => {
  try {
    const mockDoctors = [
      {
        _id: 'doc1',
        firstName: 'John',
        lastName: 'Smith',
        specialty: 'Cardiology',
        practice: {
          name: 'Heart Care Center',
          address: {
            street: '123 Medical Drive',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          },
          phone: '+1-555-0123',
          website: 'https://heartcarecenter.com'
        },
        rating: {
          average: 4.8,
          totalReviews: 127,
          reviews: [
            {
              rating: 5,
              comment: 'Excellent doctor, very knowledgeable and caring.',
              date: '2024-01-15'
            },
            {
              rating: 4,
              comment: 'Great bedside manner and thorough examination.',
              date: '2024-01-10'
            }
          ]
        },
        experience: 15,
        education: [
          {
            degree: 'MD',
            institution: 'Harvard Medical School',
            year: 2009
          }
        ],
        certifications: [
          {
            name: 'Board Certified in Cardiology',
            issuingOrganization: 'American Board of Internal Medicine',
            year: 2014
          }
        ],
        profilePicture: null,
        bio: 'Dr. John Smith is a board-certified cardiologist with over 15 years of experience in diagnosing and treating heart conditions. He specializes in preventive cardiology and has helped thousands of patients maintain heart health.',
        languages: ['English', 'Spanish'],
        availability: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: {
            start: '09:00',
            end: '17:00'
          },
          appointmentDuration: 30
        }
      }
    ];

    const doctor = mockDoctors.find(doc => doc._id === req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ doctor });

  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/mock/notifications/sample
// @desc    Create sample notifications for testing
// @access  Private
router.post('/notifications/sample', authenticatePatient, async (req, res) => {
  try {
    const Notification = (await import('../models/Notification.js')).default;
    
    // Clear existing notifications for this patient
    await Notification.deleteMany({ patientId: req.patient._id });
    
    // Create sample notifications
    const sampleNotifications = [
      {
        patientId: req.patient._id,
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM. Please arrive 15 minutes early.',
        priority: 'high',
        read: false
      },
      {
        patientId: req.patient._id,
        type: 'appointment_confirmed',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Michael Chen on January 18th at 2:30 PM has been confirmed.',
        priority: 'medium',
        read: false
      },
      {
        patientId: req.patient._id,
        type: 'system',
        title: 'Welcome to DocSona',
        message: 'Thank you for joining DocSona! Your account has been successfully created. You can now book appointments and manage your health records.',
        priority: 'low',
        read: true
      },
      {
        patientId: req.patient._id,
        type: 'appointment_cancelled',
        title: 'Appointment Cancelled',
        message: 'Your appointment with Dr. Emily Davis on January 20th has been cancelled due to doctor unavailability. Please reschedule.',
        priority: 'medium',
        read: true
      },
      {
        patientId: req.patient._id,
        type: 'message',
        title: 'New Message from Dr. Johnson',
        message: 'Dr. Sarah Johnson sent you a message regarding your recent test results. Please check your messages.',
        priority: 'medium',
        read: false
      },
      {
        patientId: req.patient._id,
        type: 'medical_update',
        title: 'Test Results Available',
        message: 'Your blood test results from January 15th are now available. Please review them in your medical records.',
        priority: 'high',
        read: false
      }
    ];
    
    const createdNotifications = await Notification.insertMany(sampleNotifications);
    
    res.json({
      message: 'Sample notifications created successfully',
      count: createdNotifications.length,
      notifications: createdNotifications
    });
    
  } catch (error) {
    console.error('Create sample notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/mock/messages/sample
// @desc    Create sample messages for testing
// @access  Private
router.post('/messages/sample', authenticatePatient, async (req, res) => {
  try {
    const Message = (await import('../models/Message.js')).default;
    
    // Clear existing messages for this patient
    await Message.deleteMany({ patientId: req.patient._id });
    
    // Create sample messages with different doctors
    const sampleMessages = [
      // Conversation with Dr. Sarah Johnson (Cardiology)
      {
        patientId: req.patient._id,
        doctorId: 'doc1',
        sender: 'doctor',
        content: 'Hello! How are you feeling today? I wanted to check in on your recovery.',
        read: false
      },
      {
        patientId: req.patient._id,
        doctorId: 'doc1',
        sender: 'patient',
        content: 'I\'m feeling much better, thank you for asking. The medication is working well.',
        read: true
      },
      {
        patientId: req.patient._id,
        doctorId: 'doc1',
        sender: 'doctor',
        content: 'That\'s great to hear! Your test results are ready. Please schedule a follow-up appointment.',
        read: false
      },
      
      // Conversation with Dr. Michael Chen (Dermatology)
      {
        patientId: req.patient._id,
        doctorId: 'doc2',
        sender: 'doctor',
        content: 'I\'ve reviewed your skin condition and prescribed a new medication.',
        read: true
      },
      {
        patientId: req.patient._id,
        doctorId: 'doc2',
        sender: 'patient',
        content: 'Thank you, when can I pick it up?',
        read: true
      },
      {
        patientId: req.patient._id,
        doctorId: 'doc2',
        sender: 'doctor',
        content: 'The prescription has been sent to your pharmacy. You can pick it up anytime today.',
        read: false
      },
      
      // Conversation with Dr. Emily Davis (Pediatrics)
      {
        patientId: req.patient._id,
        doctorId: 'doc4',
        sender: 'doctor',
        content: 'Your child\'s vaccination records have been updated. The next appointment is scheduled for next month.',
        read: true
      }
    ];
    
    const createdMessages = await Message.insertMany(sampleMessages);
    
    res.json({
      message: 'Sample messages created successfully',
      count: createdMessages.length,
      messages: createdMessages
    });
    
  } catch (error) {
    console.error('Create sample messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/mock/messages/test
// @desc    Test message model functionality
// @access  Public
router.get('/messages/test', async (req, res) => {
  try {
    const Message = (await import('../models/Message.js')).default;
    
    // Test basic query
    const count = await Message.countDocuments();
    
    res.json({
      message: 'Message model test successful',
      totalMessages: count,
      modelWorking: true
    });
    
  } catch (error) {
    console.error('Message model test error:', error);
    res.status(500).json({ 
      error: 'Message model test failed',
      details: error.message,
      stack: error.stack
    });
  }
});

export default router; 