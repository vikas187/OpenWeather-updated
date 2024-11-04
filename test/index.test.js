const request = require('supertest');
const express = require('express');
const nock = require('nock');
require('dotenv').config();

const app = require('../index'); // Adjust the path if necessary

describe('GET /', () => {
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

  it('should return 400 if hour is invalid', async () => {
    const res = await request(app).get('/weather').query({ city: 'London', hour: -1 });
    expect(res.status).to.equal(400);
    expect(res.text).to.equal('Valid hour is required');
  });

  it('should return weather data for a valid city and hour', async () => {
    const city = 'London';
    const hour = 1;
    const apiResponse = {
      location: {
        name: city,
        country: 'UK',
        localtime: '2023-10-01 12:00',
      },
      forecast: {
        forecastday: [
          {
            date: '2023-10-01',
            hour: [
              {
                temp_c: 15,
                condition: {
                  text: 'Sunny',
                },
              },
            ],
          },
        ],
      },
    };

    nock('http://api.weatherapi.com')
      .get('/v1/history.json')
      .query(true)
      .reply(200, apiResponse);

    const res = await request(app).get('/weather').query({ city, hour });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      city: 'London',
      country: 'UK',
      date: '2023-10-01',
      localtime: '2023-10-01 12:00',
      temperature: 15,
      condition: 'Sunny',
    });
  });

  it('should return weather data for a city even if hour is not provided', async () => {
    const city = 'London';
    const apiResponse = {
      location: {
        name: city,
        country: 'UK',
        localtime: '2023-10-01 12:00',
      },
      forecast: {
        forecastday: [
          {
            date: '2023-10-01',
            hour: [
              {
                temp_c: 12,
                condition: {
                  text: 'Sunny',
                },
              },
              {
                temp_c: 15,
                condition: {
                  text: 'Sunny',
                },
              },
            ],
          },
        ],
      },
    };

    nock('http://api.weatherapi.com')
      .get('/v1/history.json')
      .query(true)
      .reply(200, apiResponse);

    const res = await request(app).get('/weather').query({ city });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      city: 'London',
      country: 'UK',
      date: '2023-10-01',
      localtime: '2023-10-01 12:00',
      temperature: 12,
      condition: 'Sunny',
    });
  });

  it('should return 500 if there is an error fetching weather data', async () => {
    const city = 'London';
    const hour = 1;

    nock('http://api.weatherapi.com')
      .get('/v1/history.json')
      .query(true)
      .replyWithError('Something went wrong');

    const res = await request(app).get('/weather').query({ city, hour });
    expect(res.status).to.equal(500);
    expect(res.text).to.equal('Something went wrong');
  });
});