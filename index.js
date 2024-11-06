const express = require('express');
const axios = require('axios');
const moment = require('moment-timezone');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Helper function to build the response data
const buildWeatherData = (currentWeather) => ({
  city: currentWeather.location.name,
  country: currentWeather.location.country,
  localtime: currentWeather.location.localtime,
  historical_weather: []
});

// Main weather endpoint
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  let hours = parseInt(req.query.hours) || 5;

  if (!city) return res.status(400).send('City is required');
  if (isNaN(hours) || hours <= 0) return res.status(400).send('Valid hours are required');

  try {
    // Get current weather to capture local time
    const currentWeather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
    if (!currentWeather.data) throw new Error('No data found for current weather');

    let currentDate = moment(currentWeather.data.location.localtime);
    const localHour = currentDate.hour();
    let collectedHours = 0;
    let dateOffset = 0;

    const weatherData = buildWeatherData(currentWeather.data);

    // Collect hourly data until the required hours are gathered
    while (collectedHours < hours) {
      const formattedDate = currentDate.clone().subtract(dateOffset, 'days').format('YYYY-MM-DD');
      const historicalForecast = await axios.get(`http://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${city}&dt=${formattedDate}`); // Get full forecastday
      const forecastDay = historicalForecast.data.forecast.forecastday[0];

      if (!forecastDay) throw new Error('No data found for historical weather');

      const hourlyData = forecastDay.hour; // Extract hourly data from forecastday
      const startHour = dateOffset === 0 ? localHour : 23;

      // Collect hours in reverse order to get the latest first, limited by startHour and hours needed
      for (let i = startHour; i >= 0 && collectedHours < hours; i--) {
        const hourData = hourlyData[i];
        if (!hourData) continue;    
        weatherData.historical_weather.push({
          date: forecastDay.date,
          time: hourData.time,
          temperature: hourData.temp_c,
          condition: hourData.condition.text
        });
        collectedHours++;
      }

      dateOffset++;
    }
    
    res.json(weatherData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running`);
});

module.exports = app;
