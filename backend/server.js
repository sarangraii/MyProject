// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const serviceRoutes = require('./routes/serviceRoutes');
const homeRoutes = require('./routes/homeRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const stylistRoutes = require('./routes/stylistRoutes');
const contactRoutes = require("./routes/contactRoutes");
const clientRoutes = require('./routes/clientRoutes');
const paymentRoutes = require("./routes/payment");

// Load environment variables
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 4002

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salonappointment')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', homeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stylists', stylistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/clients', clientRoutes);

app.get('/',(req,res)=>{
  res.send({
    activeStatus:true,
    error:false,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

