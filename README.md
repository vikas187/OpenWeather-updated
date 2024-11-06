**Prerequisites**</br>
Make sure you have Docker Desktop installed on your machine and its running.

**Steps to Set Up and Run the API**

**Clone the repository**</br>
Open terminal and run the command:</br>
`https://github.com/vikas187/OpenWeather-updated.git`

**Build the docker image**</br>
Open Terminal inside directory and run:</br>
`docker-compose build` or `sudo docker-compose build`(if you are not admin)

**Run the API and test cases**</br>
Open terminal inside directory start the API with:
`docker-compose up`

**Access the API**</br>
Open your web browser and navigate to:
http://localhost:3000/weather?city=london

**You can pass two parameters to the API:**</br>
city: Specify the city for the weather report.</br>
hours: Specify the hours (optional) in past you want to check the weather for the city provided. If hours in past goes back to previous dates, you will get data accordingly. By default you get last 5 hours data if you don't provide this parameter.

**Example:**
http://localhost:3000/weather?city=Berlin&hours=14

**Alternative Setup**</br>
If you don't want to install docker, you can run the application using node.js. make sure you have node.js and npm installed</br>

**Open the directory and run:**</br>
`npm install`

**Run test cases**</br>
`npm test`

**Run the API:**</br>
`npm start`

**Access the API**</br>
Open your web browser and navigate to:
http://localhost:3000/weather?city=london

**API Response Example**</br>
The API provides historical weather data in JSON format for a specified city and country. </br>

The response includes:</br>

**City and Country**: Location for the weather data (e.g., Melbourne, Australia). </br>
**Local Time**: Current local time at the specified location. </br>
**Historical Weather**: An array of weather entries with the following details: </br>
**Date and Time**: The specific date and time for each weather reading. </br>
**Temperature**: Recorded temperature at the time (in Celsius). </br>
**Condition**: Brief weather condition description (e.g., "Sunny," "Patchy rain possible"). </br>
Example Response:

```json
{
  "city": "Melbourne",
  "country": "Australia",
  "localtime": "2024-11-06 11:17",
  "historical_weather": [
    {
      "date": "2024-11-06",
      "time": "2024-11-06 11:00",
      "temperature": 31.1,
      "condition": "Patchy rain possible"
    },
    {
      "date": "2024-11-06",
      "time": "2024-11-06 10:00",
      "temperature": 29.1,
      "condition": "Sunny"
    },
    {
      "date": "2024-11-06",
      "time": "2024-11-06 09:00",
      "temperature": 24.6,
      "condition": "Patchy rain possible"
    }
  ]
}
```
