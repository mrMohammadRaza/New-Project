const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agriflow';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.log('ℹ️ Server will continue in fallback demo mode for testing.');
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
