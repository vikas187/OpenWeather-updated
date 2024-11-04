**Prerequisites**</br>
Make sure you have Docker Desktop installed on your machine and its running.

**Steps to Set Up and Run the API**

**Clone the repository**</br>
Open terminal and run the command:</br>
git clone https://github.com/vikas187/OpenWeather.git

**Run the API and test cases**</br>
Open terminal inside directory start the API with:
docker-compose up

**Access the API**</br>
Open your web browser and navigate to:
http://localhost:3000/weather?city=london

**You can pass two parameters to the API:**</br>
city: Specify the city for the weather report.</br>
hour: Specify the hour (optional) for a specific time forecast.

**Example:**
http://localhost:3000/weather?city=Berlin&hour=14

**Alternative Setup**</br>
If you don't want to install docker, you can run the application using node.js. make sure you have node.js and npm installed</br>

**Open the directory and run:**</br>
npm install

**Run test cases**</br>
npm test

**Run the API:**</br>
npm start

**Access the API**</br>
Open your web browser and navigate to:
http://localhost:3000/weather?city=london
