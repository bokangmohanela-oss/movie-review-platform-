const express = require('express');
const router = express.Router();

// Mock auth verification
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    console.log('🔐 Mock auth verification');
    
    // Mock user data
    const user = {
      uid: 'mock-user-' + Date.now(),
      email: 'user@example.com',
      name: 'Demo User'
    };
    
    res.json(user);

  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify token',
      details: error.message
    });
  }
});

// Additional auth endpoints for development
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Mock login attempt:', email);
    
    // Mock user data
    const user = {
      uid: 'mock-user-' + Date.now(),
      email: email,
      name: email.split('@')[0],
      token: 'mock-token-' + Date.now()
    };
    
    res.json(user);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log('🔐 Mock registration:', email);
    
    // Mock user data
    const user = {
      uid: 'mock-user-' + Date.now(),
      email: email,
      name: name || email.split('@')[0],
      token: 'mock-token-' + Date.now()
    };
    
    res.json(user);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message
    });
  }
});

module.exports = router;