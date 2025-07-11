import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/docsona', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  checkDatabase();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

async function checkDatabase() {
  try {
    console.log('\n🔍 Checking Database Collections...\n');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available Collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // Check appointments collection
    const Appointment = mongoose.model('Appointment', new mongoose.Schema({}));
    const appointmentCount = await Appointment.countDocuments();
    console.log(`\n📅 Appointments in Database: ${appointmentCount}`);
    
    if (appointmentCount > 0) {
      const appointments = await Appointment.find().limit(5);
      console.log('\n📋 Recent Appointments:');
      appointments.forEach((apt, index) => {
        console.log(`\n   Appointment ${index + 1}:`);
        console.log(`   - ID: ${apt._id}`);
        console.log(`   - Patient ID: ${apt.patientId}`);
        console.log(`   - Doctor: ${apt.doctorInfo?.name || 'N/A'}`);
        console.log(`   - Date: ${apt.date}`);
        console.log(`   - Time: ${apt.time}`);
        console.log(`   - Status: ${apt.status}`);
        console.log(`   - Created: ${apt.createdAt}`);
      });
    }
    
    // Check patients collection
    const Patient = mongoose.model('Patient', new mongoose.Schema({}));
    const patientCount = await Patient.countDocuments();
    console.log(`\n👥 Patients in Database: ${patientCount}`);
    
    if (patientCount > 0) {
      const patients = await Patient.find().limit(3);
      console.log('\n👤 Recent Patients:');
      patients.forEach((patient, index) => {
        console.log(`\n   Patient ${index + 1}:`);
        console.log(`   - ID: ${patient._id}`);
        console.log(`   - Name: ${patient.firstName} ${patient.lastName}`);
        console.log(`   - Email: ${patient.email}`);
        console.log(`   - Created: ${patient.createdAt}`);
      });
    }
    
    // Check notifications collection
    const Notification = mongoose.model('Notification', new mongoose.Schema({}));
    const notificationCount = await Notification.countDocuments();
    console.log(`\n🔔 Notifications in Database: ${notificationCount}`);
    
    // Check messages collection
    const Message = mongoose.model('Message', new mongoose.Schema({}));
    const messageCount = await Message.countDocuments();
    console.log(`\n💬 Messages in Database: ${messageCount}`);
    
    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
} 