const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();


app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
  const query = req.body.cityName;
  const apiKey = '13ca0c89d8cd04873921fbc32a542965';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  https.get(url, (response) => {
    response.on('data', (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weather Result</title>
          <link rel="stylesheet" href="/stylesheet.css">
          <style>
            body {
              font-family: Arial, sans-serif;
              background: linear-gradient(to right, #4facfe, #00f2fe);
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              margin: 0;
            }
            .weather-container {
              background: rgba(255, 255, 255, 0.9);
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
              width: 350px;
            }
            h1 {
              font-size: 24px;
              margin: 0;
              color: #333;
            }
            .weather-icon {
              width: 100px;
              margin-top: 10px;
            }
            p {
              font-size: 18px;
              margin: 10px 0;
              color: #444;
            }
            .back-button {
              display: inline-block;
              background: linear-gradient(to right, #ff4b2b, #ff416c);
              border: none;
              color: white;
              padding: 10px 20px;
              font-size: 16px;
              font-weight: bold;
              border-radius: 5px;
              cursor: pointer;
              text-decoration: none;
              transition: all 0.3s ease;
            }
            .back-button:hover {
              background: linear-gradient(to right, #ff416c, #ff4b2b);
              box-shadow: 0 4px 10px rgba(255, 65, 108, 0.6);
            }
          </style>
        </head>
        <body>
          <div class="weather-container">
            <h1>Weather in ${query}</h1>
            <img class="weather-icon" src="${iconURL}" alt="Weather Icon">
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Condition:</strong> ${description}</p>
            <a href="/" class="back-button">Back</a>
          </div>
        </body>
        </html>
      `);
    });
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
