Prerequisites
Make sure you have Docker Desktop installed on your machine.

Steps to Set Up and Run the API

Build the Docker Image
Open a terminal inside the project directory and run:
docker-compose build


Run the API
After the build completes, start the API with:
docker-compose up

Access the API
Open your web browser and navigate to:
http://localhost:3000/weather

You can pass two parameters to the API:
city: Specify the city for the weather report.
hour: Specify the hour (optional) for a specific time forecast.

Example:
http://localhost:3000/weather?city=Berlin&hour=14