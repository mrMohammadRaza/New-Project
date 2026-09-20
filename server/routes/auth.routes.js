const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const router = express.Router();

// Fallback in-memory users store for local offline testing
const mockUsers = [
  {
    _id: 'mock_user_101',
    name: 'Harpreet Singh',
    email: 'farmer@agriflow.org',
    passwordHash: '$2a$10$wN3tVqVvK0000000000000', // demo
    farmLocation: {
      latitude: 30.7333,
      longitude: 76.7794,
      farmName: 'Sutlej Golden Wheat Farm',
      city: 'Chandigarh Region'
    }
  }
];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agriflow_secret', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new farmer user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, farmLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (getIsConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const user = await User.create({
        name,
        email,
        password,
        farmLocation: farmLocation || {
          latitude: 28.6139,
          longitude: 77.2090,
          farmName: `${name}'s Farm`,
          city: 'Agritech Zone'
        }
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          farmLocation: user.farmLocation
        },
        token: generateToken(user._id)
      });
    } else {
      // Mock Fallback
      const newUser = {
        _id: `mock_${Date.now()}`,
        name,
        email,
        farmLocation: farmLocation || {
          latitude: 28.6139,
          longitude: 77.2090,
          farmName: `${name}'s Farm`,
          city: 'Demo Zone'
        }
      };
      mockUsers.push(newUser);
      return res.status(201).json({
        success: true,
        user: newUser,
        token: generateToken(newUser._id),
        note: 'Saved in local dev memory (MongoDB not connected)'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email }).select('+password');
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            farmLocation: user.farmLocation
          },
          token: generateToken(user._id)
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    } else {
      // Offline / Demo credentials
      return res.json({
        success: true,
        user: {
          _id: 'demo_farmer_id',
          name: 'Demo Farmer',
          email: email || 'farmer@agriflow.org',
          farmLocation: {
            latitude: 28.6139,
            longitude: 77.2090,
            farmName: 'AgriFlow Demo Farm',
            city: 'Haryana Agro Cluster'
          }
        },
        token: generateToken('demo_farmer_id'),
        demoMode: true
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
