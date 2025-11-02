const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Firebase Admin - FIXED PATH
const { db } = require('./config/firebaseAdmin'); // This should work if file is named firebaseAdmin.js

// Routes
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    services: {
      movies: 'active',
      restaurants: 'active', 
      reviews: 'active',
      auth: 'active'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    available_endpoints: [
      'GET  /api/health',
      'GET  /api/movies/search?query=term',
      'GET  /api/restaurants/search?location=city&term=food',
      'GET  /api/reviews',
      'POST /api/reviews'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎬 Movie API: http://localhost:${PORT}/api/movies/search?query=avengers`);
  console.log(`🍽️ Restaurant API: http://localhost:${PORT}/api/restaurants/search?location=New+York`);
  console.log(`📝 Reviews API: http://localhost:${PORT}/api/reviews`);
});