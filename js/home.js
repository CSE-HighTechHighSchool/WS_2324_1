// ----------------- Firebase Setup & Initialization ------------------------//
import {initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; 
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

// --------------------- Get reference values -----------------------------

let userLink = document.getElementById("userLink") // username for the navbar
let signOutLink = document.getElementById("signOut") //sign out link
let welcome = document.getElementById("welcome") // welcome header
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

  signOutLink(auth).then(() => {
    //Sign out successful
  }).catch((err) => {
    //error occured
  })
  
  window.location = "index.html"
}


// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, year, month, day, sunrise, sunset) {
  const dataRef = ref(db, `users/${userID}/data/${year}/${month}/${day}`)
  if (!year || !month || !day) {
    alert("Year, month, and day are required.")
    return;
  }

  // Check if data for the specified date already exists
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Data already exists, use update
        update(dataRef, {
          sunrise: sunrise,
          sunset: sunset
        });
      } else {
        // Data doesn't exist, use set
        set(dataRef, {
          sunrise: sunrise,
          sunset: sunset
        })
      }

      // Alert and clear the form after storing data
      alert("Data stored successfully.");
      document.getElementById("selectYear").value = ""
      document.getElementById("selectMonth").value = ""
      document.getElementById("selectDay").value = ""
    })
    .catch((error) => {
      alert("There was an error. Error: " + error)
    })
}


// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, year, month, day) {
  const dbref = ref(db)
  if (!year || !month || !day) {
    alert("Year, month, and day are required.")
    return;
  }
  // Provide the path through the nodes to the data
  get(child(dbref, `users/${userID}/data/${year}/${month}/${day}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()


        if (data.sunrise && data.sunset) {
          // Convert sunrise and sunset times to Date objects
          const sunriseDate = new Date(`2000-01-01T${data.sunrise}`)
          const sunsetDate = new Date(`2000-01-01T${data.sunset}`)

          // Format sunrise and sunset times in 12-hour format
          const options = { hour: 'numeric', minute: 'numeric', hour12: true }
          const formattedSunrise = sunriseDate.toLocaleString('en-US', options)
          const formattedSunset = sunsetDate.toLocaleString('en-US', options)

          // Display sunrise and sunset values in specified elements
          console.log(data.sunrise.toLocaleString('en-US', options))
          document.getElementById("getSunrise").textContent = "Sunrise: " + formattedSunrise
          document.getElementById("getSunset").textContent = "Sunset: " + formattedSunset
        } 
      } else {
        alert("No data found")
      }
    })
    .catch((err) => {
      alert("Unsuccessful:", err)
    });
}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
async function getDataSet(userID, year, month){
  if (!year || !month) {
    alert("Year and month are required.")
    return;
  }
  const days = []
  const sunrises = []
  const sunsets = []

  const dbref = ref(db)

  // Wait for all data to be pulled from FRD
  await get(child(dbref, "users/" + userID + "/data/" + year + "/" + month))
  .then((snapshot) => {
    if(snapshot.exists()){
      snapshot.forEach(child => {
        // Push values to corresponding arrays
        days.push(child.key)
        sunrises.push(child.val().sunrise)
        sunsets.push(child.val().sunset)
        console.log(days)
        console.log(sunrises)
        console.log(sunsets)
      })
      createLineChart(days, sunrises, sunsets)
    }
    else {
      alert("No data found")
    }
  })
  .catch((error) => {
    alert("Unsuccessful, error: " + error)
  })
}

function createLineChart(days, sunrises, sunsets) {
   // Convert 24-hour time format to decimal representation
   const convertToDecimalHours = (time) => {
    const [hours, minutes] = time.split(':');
    return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
  }

  // Get the canvas element
  const ctx = document.getElementById("myChart")
  const decimalSunrises = sunrises.map(convertToDecimalHours)
  const decimalSunsets = sunsets.map(convertToDecimalHours)

  // Get the existing chart instance
  const existingChart = Chart.getChart(ctx);

  // Destroy the existing chart if it exists
  if (existingChart) {
    existingChart.destroy();
  }
  
  // Create the chart
  const myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "Sunrise",
          data: decimalSunrises,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "Sunset",
          data: decimalSunsets,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Days',
          },
          min:0,
          max:31,
          ticks: {
            stepSize: 1,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Time (24-Hour Format)',
          },
          type: 'linear',
          min: 0,
          max: 24,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
    },
  })
}


// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, year, month, day) {
  if (!year || !month || !day) {
    alert("Year, month, and day are required.")
    return;
  }
  remove(ref(db, 'users/' + userID + '/data/' + year + '/' + month + '/' + day))
  .then(() => {
    alert ('Data removed successfully')
  })
  .catch((error) => {
    alert('Unsuccessful, error: ' + error)
  })
}


// --------------------------- Home Page Loading -----------------------------
window.onload = function(){
  // ------------------------- Set Welcome Message -------------------------
  getUsername()
    // Check if user is signed-in
    if(currentUser === null) {
      window.location = "index.html"
      alert("Please Sign-In First!")
    }
}
  // Get, Set, Update, Delete Sharkriver Temp. Data in FRD
  // Set (Insert) data function call
  document.getElementById("addBtn").onclick = function(){
    const year = document.getElementById("selectYear").value
    const month = document.getElementById('selectMonth').value
    const day = document.getElementById('selectDay').value
    const sunrise = document.getElementById('sunrise').value
    const sunset = document.getElementById('sunset').value
    const userID = currentUser.uid
    setData(userID, year, month, day, sunrise, sunset)
  }


  // Get a datum function call
  document.getElementById("getBtn").onclick = function() {
    const year = document.getElementById("getYear").value
    const month = document.getElementById('getMonth').value
    const day = document.getElementById('getDay').value
    const userID = currentUser.uid

    getData(userID, year, month, day)
  }

  // Get a data set function call
  document.getElementById("getChart").onclick = function() {
    const year = document.getElementById("getYearChart").value
    const month = document.getElementById("getMonthChart").value
    const userID = currentUser.uid

    getDataSet(userID, year, month)
  }

  // Delete a single day's data function call
  document.getElementById("removeData").onclick = function() {
    const year = document.getElementById("removeYear").value
    const month = document.getElementById("removeMonth").value
    const day = document.getElementById("removeDay").value
    const userID = currentUser.uid
    deleteData(userID, year, month, day)
  }
