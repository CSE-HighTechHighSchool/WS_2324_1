const apiEndpoint = "https://api.weather.gov/points/40.3291,-74.1240"; // Lincroft's coordinates
const accessToken = "bLixBffiQkvdoZWKWCpvCZGraiuwMWbC"; // Access Token
const temperatureElement = document.getElementById("temperature");
const headers = {
  "Authorization": `Bearer ${accessToken}`
};


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
    .then(forecast => {
      const temperature = forecast.properties.periods[0].temperature;
      temperatureElement.textContent = `Temperature in Lincroft: ${temperature} °F`;
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    })
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
