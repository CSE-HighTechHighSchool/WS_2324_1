const apiEndpointLincroft = "https://api.weather.gov/points/40.33,-74.12"; // Lincroft's coordinates
const accessToken = "bLixBffiQkvdoZWKWCpvCZGraiuwMWbC"; // Access Token
const temperatureElement = document.getElementById("temperature"); //Gets the temperature element in the index.html file
const forecastInfoElement = document.getElementById("forecast-info"); //Gets the forecast-info element in the index.html file
const forecastCardsElement = document.getElementById("forecast-cards"); //Gets the forecast-cards element in the index.html file

//Checks if accessToken is valid
const headers = {
  "Authorization": `Bearer ${accessToken}`
};

//Fetches the weather data from weather.gov API
fetch(apiEndpointLincroft)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    //Fetches current forecast data
    fetch(data.properties.forecastHourly)
    .then(res => res.json())
    .then(forecasthourly=> {
      // Gets current temperature and transfers it to index.html page
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
    //Catches any error and logs to console
    .catch(error => {
      console.log(`Error: ${error}`);
    })
    //Fetches future forecast data
    fetch(data.properties.forecast)
    .then(res => res.json())
    .then(forecast=> {
      // Gets future forecast and transfers it to index.html page
        forecastCardsElement.innerHTML = '<div class="card-wrapper">' +
                                            '<div class="card-details">' +
                                              '<h3 class="card-title">' + forecast.properties.periods[1].name + '</h3>' +
                                              '<p>Temperature ' + forecast.properties.periods[1].temperature + '°F </p>' +
                                            '</div>' +
                                            '<div class="reveal-details">' +
                                              '<p>' + forecast.properties.periods[1].detailedForecast +'</p>' +
                                            '</div>' +
                                          '</div>' +
                                          '<div class="card-wrapper">' +
                                            '<div class="card-details">' +
                                              '<h3 class="card-title">' + forecast.properties.periods[2].name + '</h3>' +
                                              '<p>Temperature ' + forecast.properties.periods[2].temperature + '°F </p>' +
                                            '</div>' +
                                            '<div class="reveal-details">' +
                                              '<p>' + forecast.properties.periods[2].detailedForecast +'</p>' +
                                            '</div>' +
                                          '</div>' +
                                          '<div class="card-wrapper">' +
                                            '<div class="card-details">' +
                                              '<h3 class="card-title">' + forecast.properties.periods[3].name + '</h3>' +
                                              '<p>Temperature ' + forecast.properties.periods[3].temperature + '°F </p>' +
                                            '</div>' +
                                            '<div class="reveal-details">' +
                                              '<p>' + forecast.properties.periods[3].detailedForecast +'</p>' +
                                            '</div>' +
                                          '</div>' +
                                          '<div class="card-wrapper">' +
                                            '<div class="card-details">' +
                                              '<h3 class="card-title">' + forecast.properties.periods[4].name + '</h3>' +
                                              '<p>Temperature ' + forecast.properties.periods[4].temperature + '°F </p>' +
                                            '</div>' +
                                            '<div class="reveal-details">' +
                                              '<p>' + forecast.properties.periods[4].detailedForecast +'</p>' +
                                            '</div>' +
                                          '</div>' +
                                          '<div class="card-wrapper">' +
                                            '<div class="card-details">' +
                                              '<h3 class="card-title">' + forecast.properties.periods[5].name + '</h3>' +
                                              '<p>Temperature ' + forecast.properties.periods[5].temperature + '°F </p>' +
                                            '</div>' +
                                            '<div class="reveal-details">' +
                                              '<p>' + forecast.properties.periods[5].detailedForecast +'</p>' +
                                            '</div>' +
                                          '</div>';
    })
    //Catches and error and logs to console
    .catch(error => {
      console.log(`Error: ${error}`);
    })
  })
  //Catches and error and logs to console
  .catch(error => {
    console.error(`Error: ${error}`);
  });

// ----------------- Firebase Setup & Initialization ------------------------//
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";  
import {getDatabase, ref, set, update, child, get, remove} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMF2jbebUtr8mJp03eVDYfiRdSWdZeHGQ",
  authDomain: "ws-2324-1.firebaseapp.com",
  databaseURL: "https://ws-2324-1-default-rtdb.firebaseio.com",
  projectId: "ws-2324-1",
  storageBucket: "ws-2324-1.appspot.com",
  messagingSenderId: "1095270047694",
  appId: "1:1095270047694:web:a2e646a794bef2a0d5959f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Firebase Authentication
const auth = getAuth(app)

// Returns instace of your app's FRD
const db = getDatabase(app)

let currentUser = null // initialize currentUser to null


// ----------------------- Get User's Name'Name ------------------------------
function getUsername(){
  // Grab value for the "keep logged in" switch
  let keepLoggedIn = localStorage.getItem("keepLoggedIn")
  if(keepLoggedIn == "yes"){
    currentUser = JSON.parse(localStorage.getItem("user"))
    console.log(currentUser)
  }
  else{
    currentUser = JSON.parse(sessionStorage.getItem("user"))
    console.log(currentUser)
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function SignOutUser(){
  // Clear storages
  sessionStorage.removeItem("user")
  localStorage.removeItem("user")
  localStorage.removeItem("keepLoggedIn")
  alert("Signed Out!")
  window.location = "index.html"
}

  window.onload = function(){
    getUsername()
    console.log(currentUser)
    // Check if user is signed-in
    if(currentUser === null) {
    }
    //Changes sign-in to sign-out
    else {
      document.getElementById('signinbutton').innerHTML='<button class = "hover-underline-animation" id="signoutlink">Sign Out</button>'
    }
  }
    // Sign out user when button is clicked 
    document.getElementById('signinbutton').onclick = function() {
      if(!(currentUser === null)) {
        SignOutUser()
    }
  }


