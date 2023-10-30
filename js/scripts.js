const apiEndpoint = "https://api.weather.gov/points/40.3291,-74.1240"; // Lincroft's coordinates
const accessToken = "bLixBffiQkvdoZWKWCpvCZGraiuwMWbC"; // Access Token
const temperatureElement = document.getElementById("temperature"); //Gets the temperature element in the index.html file
const forecastInfoElement = document.getElementById("forecast-info"); //Gets the forecast-info element in the index.html file
const forecastCardsElement = document.getElementById("forecast-cards"); //Gets the forecast-cards element in the index.html file

const headers = {
  "Authorization": `Bearer ${accessToken}`
};

//Fetches the weather data from weather.gov API
fetch(apiEndpoint)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    fetch(data.properties.forecastHourly)
    .then(res => res.json())
    .then(forecasthourly=> {
      const temperature = forecasthourly.properties.periods[0].temperature;
      temperatureElement.textContent = `Current Temperature in Lincroft: ${temperature}°F`;
      forecastInfoElement.textContent = forecasthourly.properties.periods[0].shortForecast;

      // Define temperature ranges for color mapping
      const coldThreshold = 32; // 32°F and below
      const hotThreshold = 85; // 85°F and above

      let color = '#000000'
      if (temperature <= coldThreshold) {
          color = '#0099ff'; // Blue for cold temperatures
      } else if (temperature >= hotThreshold) {
          color =  '#ff6600'; // Red for hot temperatures
      } else {
          // Calculate a gradient color between blue and orange
          const ratio = (temperature - coldThreshold) / (hotThreshold - coldThreshold);
          const r = 52 + (230 - 52) * ratio;
          const g = 152 + (126 - 152) * ratio;
          const b = 219 + (34 - 219) * ratio;
          color =  `rgb(${r},${g},${b}`;
      }
      temperatureElement.style.color = color;
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    })
    fetch(data.properties.forecast)
    .then(res => res.json())
    .then(forecast=> {
        const forecast1 = forecast.properties.periods[1].name;
        const forecast2 = forecast.properties.periods[2].name;
        const forecast3 = forecast.properties.periods[3].name;
        const forecast4 = forecast.properties.periods[4].name;
        const forecast5 = forecast.properties.periods[5].name;
        forecastCardsElement.innerHTML = '<h1>' + forecast1 + "</h1>";
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    })
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });


