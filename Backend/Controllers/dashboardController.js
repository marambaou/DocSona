const Appointment = require('../Models/Appointment');
const Patient = require('../Models/Patient');
const Prescription = require('../Models/Prescription');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total patients
    const totalPatients = await Patient.countDocuments();
    
    // Get total appointments
    const totalAppointments = await Appointment.countDocuments();
    
    // Get total prescriptions
    const totalPrescriptions = await Prescription.countDocuments();
    
    // Get appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get appointments by type
    const appointmentsByType = await Appointment.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Get monthly appointments for the current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    
    const monthlyAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startOfYear, $lt: endOfYear }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$date' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);
    
    // Get recent patients
    const recentPatients = await Patient.find()
      .sort({ registeredDate: -1 })
      .limit(5)
      .select('name email phone registeredDate');
    
    // Get upcoming appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingAppointments = await Appointment.find({
      date: { $gte: today },
      status: 'Scheduled'
    })
    .populate('patient', 'name email')
    .sort({ date: 1, time: 1 })
    .limit(5);
    
    res.json({
      totalPatients,
      totalAppointments,
      totalPrescriptions,
      appointmentsByStatus,
      appointmentsByType,
      monthlyAppointments,
      recentPatients,
      upcomingAppointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
  }
};

// Get patient growth data
exports.getPatientGrowth = async (req, res) => {
  try {
    const months = 12; // Get last 12 months of data
    const currentDate = new Date();
    
    const patientGrowth = [];
    
    for (let i = 0; i < months; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const adjustedYear = month < 0 ? year - 1 : year;
      const adjustedMonth = month < 0 ? month + 12 : month;
      
      const startDate = new Date(adjustedYear, adjustedMonth, 1);
      const endDate = new Date(adjustedYear, adjustedMonth + 1, 0, 23, 59, 59);
      
      const count = await Patient.countDocuments({
        registeredDate: {
          $gte: startDate,
          $lte: endDate
        }
      });
      
      const monthName = new Date(adjustedYear, adjustedMonth).toLocaleString('default', { month: 'short' });
      patientGrowth.unshift({ month: `${monthName} ${adjustedYear}`, count });
    }
    
    res.json(patientGrowth);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient growth data', error: error.message });
  }
};
