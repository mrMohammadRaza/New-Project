const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route   GET /api/weather/forecast
// @desc    Get 5-day weather forecast based on GPS coordinates
// @access  Public / User
router.get('/forecast', async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 28.6139;
    const lon = req.query.lon ? parseFloat(req.query.lon) : 77.2090;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      // High-quality realistic mock 5-day forecast for agricultural decision support
      return res.json({
        success: true,
        source: 'mock_simulator',
        location: {
          city: 'Ludhiana Agricultural Belt',
          coordinates: { lat, lon }
        },
        current: {
          temp: 29.8,
          feels_like: 33.2,
          humidity: 84, // Triggers humidity warning (>80%)
          pressure: 1008,
          windSpeed: 4.2,
          condition: 'Scattered Rain & Humid',
          icon: '10d',
          uvIndex: 6.5,
          fungalRiskScore: 'CRITICAL',
          agriculturalAdvisory: 'High fungal proliferation risk (humidity > 80%). Apply protective bio-fungicide within 24 hours.'
        },
        forecast: [
          { day: 'Today', date: 'Day 1', temp: 30.2, tempMin: 24.1, humidity: 85, rainProb: 75, condition: 'Rain Showers', icon: '10d' },
          { day: 'Tomorrow', date: 'Day 2', temp: 28.5, tempMin: 23.4, humidity: 82, rainProb: 80, condition: 'Thunderstorm', icon: '11d' },
          { day: 'Wed', date: 'Day 3', temp: 31.0, tempMin: 24.0, humidity: 76, rainProb: 45, condition: 'Partly Cloudy', icon: '02d' },
          { day: 'Thu', date: 'Day 4', temp: 32.5, tempMin: 25.1, humidity: 68, rainProb: 20, condition: 'Sunny / Warm', icon: '01d' },
          { day: 'Fri', date: 'Day 5', temp: 33.0, tempMin: 25.8, humidity: 62, rainProb: 10, condition: 'Clear Sky', icon: '01d' }
        ]
      });
    }

    // Call live OpenWeatherMap 5-day forecast API (3-hour intervals)
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    // Group forecast by daily items (taking noon readings)
    const dailyForecast = [];
    const seenDays = new Set();

    for (const item of data.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!seenDays.has(date) && dailyForecast.length < 5) {
        seenDays.add(date);
        dailyForecast.push({
          date: date,
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp * 10) / 10,
          tempMin: Math.round(item.main.temp_min * 10) / 10,
          humidity: item.main.humidity,
          rainProb: Math.round((item.pop || 0) * 100),
          condition: item.weather[0].description,
          icon: item.weather[0].icon
        });
      }
    }

    const currentItem = data.list[0];
    const currentHumidity = currentItem.main.humidity;
    const isHighRisk = currentHumidity > 80;

    res.json({
      success: true,
      source: 'openweathermap_live',
      location: {
        city: data.city.name,
        country: data.city.country,
        coordinates: { lat, lon }
      },
      current: {
        temp: Math.round(currentItem.main.temp * 10) / 10,
        feels_like: Math.round(currentItem.main.feels_like * 10) / 10,
        humidity: currentHumidity,
        pressure: currentItem.main.pressure,
        windSpeed: currentItem.wind.speed,
        condition: currentItem.weather[0].main,
        icon: currentItem.weather[0].icon,
        fungalRiskScore: isHighRisk ? 'CRITICAL' : currentHumidity > 65 ? 'MODERATE' : 'LOW',
        agriculturalAdvisory: isHighRisk
          ? 'Warning: Humidity > 80% increases leaf rust and blast infection rate.'
          : 'Favorable field spraying window today.'
      },
      forecast: dailyForecast
    });
  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve weather data',
      error: error.message
    });
  }
});

module.exports = router;
