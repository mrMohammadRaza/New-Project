const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { initCronJobs, checkHumidityAndAlert } = require('./services/cron.service');

// Import routes
const authRoutes = require('./routes/auth.routes');
const weatherRoutes = require('./routes/weather.routes');
const diseaseRoutes = require('./routes/disease.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded crop images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AgriFlow Express Backend',
    timestamp: new Date().toISOString()
  });
});

// Mounted API Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/disease', diseaseRoutes);

// Testing utility: manually trigger the 6:00 AM Cron check on-demand
app.post('/api/cron/trigger', async (req, res) => {
  await checkHumidityAndAlert();
  res.json({ success: true, message: '6:00 AM high-humidity check triggered successfully.' });
});

// Start scheduled background jobs
initCronJobs();

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🌾 AgriFlow Express Server running on http://127.0.0.1:${PORT}`);
  console.log(`📡 Open http://127.0.0.1:${PORT}/api/health to inspect system health`);
});
