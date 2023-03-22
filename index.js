const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  const apiKey = "286bfa06a5f40e0c780af610b619ccd3";

  const urlCoordinates =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=" +
    apiKey;

  https.get(urlCoordinates, function (responseCoordinates) {
    responseCoordinates.on("data", function (data) {
      const locationData = JSON.parse(data);
      const lat = locationData[0].lat;
      const lon = locationData[0].lon;
      const unit = "metric";

      const urlWeather =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=" +
        unit +
        "&appid=" +
        apiKey;
      https.get(urlWeather, function (response) {
        response.on("data", function (data) {
          const weatherData = JSON.parse(data);
          const temp = weatherData.main.temp;
          const description = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const urlIcon =
            "http://openweathermap.org/img/wn/" + icon + "@2x.png";

          res.write(
            "<h1>The temperature in " +
              cityName +
              " is " +
              temp +
              " degrees Celsius.</h1>"
          );
          res.write("<h3>The weather is currently " + description + ".</h3>");
          res.write("<img src=" + urlIcon + ">");
          res.send();
        });
      });
    });
  });
});

app.listen(3000, function () {
  console.log("Weather server running on port 3000.");
});
