const express = require('express');
const axios = require('axios');
const moment = require('moment-timezone');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Weather endpoint
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  let hour = parseInt(req.query.hour);
  if (!city) {
    return res.status(400).send('City is required');
  }

  if (!hour) {
    hour = 0;
  }

  if (isNaN(hour) || hour < 0) {
    return res.status(400).send('Valid hour is required');
  }

  try {
    let date = moment().tz('CET');
    date.subtract(hour, 'hours');
    const formattedDate = date.format('YYYY-MM-DD'); // Format date as YYYY-MM-DD
    const checkHour = date.hours();
    const response = await axios.get(`http://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${city}&dt=${formattedDate}&hour=${checkHour}`); 
    const weatherData = {
        city: response.data.location.name,
        country: response.data.location.country,
        date: response.data.forecast.forecastday[0].date,
        localtime: response.data.location.localtime,
        temperature: response.data.forecast.forecastday[0].hour[0].temp_c,
        condition: response.data.forecast.forecastday[0].hour[0].condition.text,
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

