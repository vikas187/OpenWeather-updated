const request = require('supertest');
const express = require('express');
const nock = require('nock');
require('dotenv').config();

const app = require('../index'); // Adjust the path if necessary

describe('GET /weather', () => {
  let expect;

  before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it('should return 400 if city is not provided', async () => {
    const res = await request(app).get('/weather');
    expect(res.status).to.equal(400);
    expect(res.text).to.equal('City is required');
  });

  it('should return 400 if hours parameter is invalid', async () => {
    const res = await request(app).get('/weather').query({ city: 'London', hours: -1 });
    expect(res.status).to.equal(400);
    expect(res.text).to.equal('Valid hours are required');
  });

  it('should return weather data for a valid city and default hours', async () => {
    const city = 'London';
    const apiCurrentResponse = {
      location: {
        name: city,
        country: 'UK',
        localtime: '2023-10-01 12:00',
      },
    };

    const apiHistoricalResponse = {
      "forecast": {
        "forecastday": [
          {
            "date": "2023-10-01",
            "hour": [
              {
                "time": "2023-10-01 00:00",
                "temp_c": 10,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 01:00",
                "temp_c": 11,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 02:00",
                "temp_c": 12,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 03:00",
                "temp_c": 13,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 04:00",
                "temp_c": 14,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 05:00",
                "temp_c": 15,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 06:00",
                "temp_c": 16,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 07:00",
                "temp_c": 17,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 08:00",
                "temp_c": 18,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 09:00",
                "temp_c": 19,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 10:00",
                "temp_c": 20,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 11:00",
                "temp_c": 21,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 12:00",
                "temp_c": 22,
                "condition": { "text": "Sunny" }
              }
            ]
          }
        ]
      }
    }
    

    // Mock responses for current and historical weather API calls
    nock('http://api.weatherapi.com')
      .get('/v1/current.json')
      .query(true)
      .reply(200, apiCurrentResponse);

    nock('http://api.weatherapi.com')
      .get('/v1/history.json')
      .query(true)
      .reply(200, apiHistoricalResponse);

    const res = await request(app).get('/weather').query({ city });
    expect(res.status).to.equal(200);
    expect(res.body.city).to.equal('London');
    expect(res.body.country).to.equal('UK');
    expect(res.body.historical_weather.length).to.equal(5);
    expect(res.body.historical_weather[1]).to.deep.include({
      date: '2023-10-01',
      time: '2023-10-01 11:00',
      temperature: 21,
      condition: 'Cloudy',
    });
    expect(res.body.historical_weather[4]).to.deep.include({
      date: '2023-10-01',
      time: '2023-10-01 08:00',
      temperature: 18,
      condition: 'Sunny',
    });
  });

  it('should return weather data for a valid city and hours when its for previous day also', async () => {
    const city = 'Berlin';
    const hours = 10;

    const apiCurrentResponse = {
      location: {
        name: city,
        country: 'UK',
        localtime: '2023-10-02 02:00',
      },
    };

    const apiHistoricalResponse1 = {
      forecast: {
        forecastday: [
          {
            date: '2023-10-02',
            hour: [
              {
                time: '2023-10-02 00:00',
                temp_c: 15,
                condition: { text: 'Sunny' },
              },
              {
                time: '2023-10-02 00:01',
                temp_c: 14,
                condition: { text: 'Partly Cloudy' },
              },
              {
                time: '2023-10-02 00:02',
                temp_c: 13,
                condition: { text: 'Cloudy' },
              },
            ],
          },
        ],
      },
    };

    const apiHistoricalResponse2 = {
      "forecast": {
        "forecastday": [
          {
            "date": "2023-10-01",
            "hour": [
              {
                "time": "2023-10-01 09:00",
                "temp_c": 19,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 10:00",
                "temp_c": 20,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 11:00",
                "temp_c": 21,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 12:00",
                "temp_c": 22,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 13:00",
                "temp_c": 23,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 14:00",
                "temp_c": 24,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 15:00",
                "temp_c": 25,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 16:00",
                "temp_c": 26,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 17:00",
                "temp_c": 27,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 18:00",
                "temp_c": 28,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 19:00",
                "temp_c": 29,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 20:00",
                "temp_c": 30,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 21:00",
                "temp_c": 31,
                "condition": { "text": "Cloudy" }
              },
              {
                "time": "2023-10-01 22:00",
                "temp_c": 32,
                "condition": { "text": "Sunny" }
              },
              {
                "time": "2023-10-01 23:00",
                "temp_c": 33,
                "condition": { "text": "Cloudy" }
              }
            ]
          }
        ]
      }
    }

    // Mock responses for current and historical weather API calls
    nock('http://api.weatherapi.com')
      .get('/v1/current.json')
      .query(true)
      .reply(200, apiCurrentResponse);

    nock('http://api.weatherapi.com')
      .get('/v1/history.json')
      .query(true)
      .reply(200, apiHistoricalResponse1);

    nock('http://api.weatherapi.com')
      .get('/v1/history.json')
      .query(true)
      .reply(200, apiHistoricalResponse2);

    const res = await request(app).get('/weather').query({ city, hours });
    expect(res.status).to.equal(200);
    expect(res.body.city).to.equal('Berlin');
    expect(res.body.historical_weather.length).to.equal(10);
    expect(res.body.historical_weather[0]).to.deep.include({
      date: '2023-10-02',
      time: '2023-10-02 00:02',
      temperature: 13,
      condition: 'Cloudy',
    });
    expect(res.body.historical_weather[5]).to.deep.include({
      date: '2023-10-01',
      time: '2023-10-01 21:00',
      temperature: 31,
      condition: 'Cloudy'
    })
    expect(res.body.historical_weather[9]).to.deep.include({
      date: '2023-10-01',
      time: '2023-10-01 17:00',
      temperature: 27,
      condition: 'Cloudy'
    })
  });

  it('should return 500 if there is an error fetching weather data', async () => {
    const city = 'London';
    const hours = 5;

    nock('http://api.weatherapi.com')
      .get('/v1/current.json')
      .query(true)
      .replyWithError('API error');

    const res = await request(app).get('/weather').query({ city, hours });
    expect(res.status).to.equal(500);
    expect(res.text).to.equal('API error');
  });
});
