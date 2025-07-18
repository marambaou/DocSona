// server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// Connect to MongoDB directly in this file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected'))
.catch((err) => {
  console.error(' MongoDB connection error:', err.message);
  process.exit(1);
});

// Import routes
const authRoutes = require('./Routes/auth');
const contactRoutes = require('./Routes/contact');

// Test Route
app.get('/', (req, res) => {
  res.send('Backend API is running 🚀');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
