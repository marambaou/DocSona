import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is missing from .env file');
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(' Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); 
  }
};

export default connectDB;