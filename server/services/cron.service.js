const cron = require('node-cron');
const axios = require('axios');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getIsConnected } = require('../config/db');

// Main check humidity and alert logic
const checkHumidityAndAlert = async () => {
  console.log('⏰ [Cron Job] Running 6:00 AM Agricultural Humidity & Disease Risk Check...');

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    let targetUsers = [];

    if (getIsConnected()) {
      targetUsers = await User.find({}).limit(50);
    }

    // Default reference if no users are in DB yet
    if (targetUsers.length === 0) {
      targetUsers = [
        {
          _id: null,
          email: 'farmer@agriflow.org',
          farmLocation: { latitude: 28.6139, longitude: 77.2090, farmName: 'Primary Farm' }
        }
      ];
    }

    for (const user of targetUsers) {
      const lat = user.farmLocation?.latitude || 28.6139;
      const lon = user.farmLocation?.longitude || 77.2090;
      let humidity = 85; // baseline sample reading >80%

      if (apiKey) {
        try {
          const resp = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
          );
          humidity = resp.data.main.humidity;
        } catch (apiErr) {
          console.warn(`Weather API call in cron warning: ${apiErr.message}`);
        }
      }

      console.log(`📡 Evaluated farm humidity for ${user.email}: ${humidity}%`);

      // If humidity exceeds 80%, create an alert
      if (humidity > 80) {
        const alertData = {
          userId: user._id || null,
          type: 'HUMIDITY_ALERT',
          title: 'Morning Fungal Risk Alert (Humidity > 80%)',
          message: `Atmospheric humidity at your farm is currently ${humidity}%. Extended wet canopy conditions significantly elevate risks of Leaf Rust, Powdery Mildew, and Sheath Blight. Delay excessive irrigation and prepare bio-fungicide spray.`,
          humidity: humidity,
          isRead: false,
          date: new Date()
        };

        if (getIsConnected()) {
          await Notification.create(alertData);
        }
        console.log(`🚨 Logged high-humidity notification for farm: ${user.farmLocation?.farmName}`);
      }
    }
  } catch (error) {
    console.error('❌ Error executing humidity cron job:', error.message);
  }
};

const initCronJobs = () => {
  // Cron schedule for 6:00 AM every day
  // Syntax: Minute Hour DayOfMonth Month DayOfWeek
  cron.schedule('0 6 * * *', () => {
    checkHumidityAndAlert();
  });

  console.log('📅 node-cron initialized: Daily check scheduled for 06:00 AM (0 6 * * *)');
};

module.exports = { initCronJobs, checkHumidityAndAlert };
