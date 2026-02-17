// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');

// Models
require('./models/User');
require('./models/Message');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);

// Catch-all route (works without path-to-regexp errors)
app.use((req, res) => {
  const indexPath = path.join(__dirname, '../frontend/index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send('Frontend not found. Backend is running!');
    }
  });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/russian-teen-chat';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
