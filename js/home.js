// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
import {initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; 
import {getAuth} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";  
import {getDatabase, ref, set, update, child, get, remove} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjixA7IM_hfqNJJR8yk7aWeZtZmZFQfNY",
  authDomain: "sb-rb-ftd.firebaseapp.com",
  databaseURL: "https://sb-rb-ftd-default-rtdb.firebaseio.com",
  projectId: "sb-rb-ftd",
  storageBucket: "sb-rb-ftd.appspot.com",
  messagingSenderId: "747752198659",
  appId: "1:747752198659:web:bf277183f1495008943436"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Firebase Authentication
const auth = getAuth()

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
  
  window.location = "home.html"
}


// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, year, month, day, temperature) {
  // Must use brackers around variable male to use it as a key
  set(ref(db, 'user/' + userID + '/data/' + year + '/' + month), {
    [day]: temperature
  })
  .then(() => {
    alert("Data stored successfully.")
  })
  .catch((error) => {
    alert("There was an error. Error: " + error)
  })
}

// -------------------------Update data in database --------------------------
function updateData(userID, year, month, day, temperature) {
  // Must use brackers around variable male to use it as a key
  update(ref(db, 'user/' + userID + '/data/' + year + '/' + month), {
    [day]: temperature
  })
  .then(() => {
    alert("Data updated successfully.")
  })
  .catch((error) => {
    alert("There was an error. Error: " + error)
  })
}

// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, year, month, day){
  let yearVal = document.getElementById("yearVal")
  let monthVal = document.getElementById("monthVal")
  let dayVal = document.getElementById("dayVal")
  let tempVal = document.getElementById("tempVal")
  
  const dbref = ref(db) // firebase parameter for getting data
  
  // Provide the path through the nodes to the data
  get(child(dbref, "user/" + userID + "/data/" + year + "/" + month))
  .then((snapshot) => {
    if(snapshot.exists()){
      yearVal.textContent = year
      monthVal.textContent = month
      dayVal.textContent = day

      // To get specific value from a key: snapshot.val()[key]
      tempVal.textContent = snapshot.val()[day]
    }
    else{
      alert("No data found")
    }
  })
  .catch((err) => {
    alert("Unsuccessful:", err)
  })
}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph
async function getDataSet(userID, year, month){
  let yearVal = document.getElementById("setYearVal")
  let monthVal = document.getElementById("setMonthVal")

  yearVal.textContent = `Year: ${year}`
  monthVal.textContent = `Month: ${month}`

  const days = []
  const temps = []
  const tBodyEl = document.getElementById("tbody-2") // Select <tbody> element

  const dbref = ref(db)

  // Wait for all data to be pulled from FRD
  await get(child(dbref, "user/" + userID + "/data/" + year + "/" + month))
  .then((snapshot) => {
    if(snapshot.exists()){
      console.log(snapshot.val())

      snapshot.forEach(child => {
        console.log(child.key, child.val())
        // Push values to corresponding arrays
        days.push(child.key)
        temps.push(child.val())
      })
    }
    else {
      alert("No data found")
    }
  })
  .catch((error) => {
    alert("Unsuccessful, error: " + error)
  })

  // Dynamically add table rows to HTML using string interpolation
  tBodyEl.innerHTML = ''    // Clear any existing table
  for(let i = 0; i < days.length; i++) {
    addItemToTable(days[i], temps[i], tBodyEl)
  }
}

// Add a item to the table of data
function addItemToTable(day, temp, tbody) {
  let tRow = document.createElement("tr")
  let td1 = document.createElement("td")
  let td2 = document.createElement("td")

  td1.innerHTML = day
  td2.innerHTML = temp

  tRow.appendChild(td1)
  tRow.appendChild(td2)

  tbody.appendChild(tRow)
}


// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, year, month, day) {
  remove(ref(db, 'users/' + userID + '/data/' + year + '/' + month + '/' + day))
  .then(() => {
    alert ('Data removed successfully');
  })
  .catch((error) => {
    alert('Unsuccessful, error: ' + error);
  });
}


// --------------------------- Home Page Loading -----------------------------
window.onload = function(){
  // ------------------------- Set Welcome Message -------------------------
  getUsername()
  if(currentUser == null){
    userLink.innerText = "Create New Account"
    userLink.classList.replace("nav-link", "btn")
    userLink.classList.add("btn-primary")
    userLink.href = "register.html"

    signOutLink.innerText = "Sign In"
    signOutLink.classList.replace("nav-link", "btn")
    signOutLink.classList.add("btn-success")
    userLink.href = "signin.html"
  }
  else{
    userLink.innerText = currentUser.firstName
    welcome.innerText = "welcome " + currentUser.firstName
    userLink.classList.replace("btn", "nav-link")
    userLink.classList.add("btn-primary")
    userLink.href = "#"

    signOutLink.innerText = "Sign Out"
    signOutLink.classList.replace("btn", "nav-link")
    signOutLink.classList.add("btn-success")
    document.getElementById("signOut").onclick = function(){
      SignOutUser()
    }
  }
}
  // Get, Set, Update, Delete Sharkriver Temp. Data in FRD
  // Set (Insert) data function call
  document.getElementById("set").onclick = function(){
    const year = document.getElementById("year").value
    const month = document.getElementById('month').value
    const day = document.getElementById('day').value
    const temperature = document.getElementById('temperature').value
    const userID = currentUser.uid

    setData(userID, year, month, day, temperature)
  }

  // Update data function call
  document.getElementById("update").onclick = function(){
    const year = document.getElementById("year").value
    const month = document.getElementById('month').value
    const day = document.getElementById('day').value
    const temperature = document.getElementById('temperature').value
    const userID = currentUser.uid

    updateData(userID, year, month, day, temperature)
  }

  // Get a datum function call
  document.getElementById("get").onclick = function() {
    const year = document.getElementById("getYear").value
    const month = document.getElementById("getMonth").value
    const day = document.getElementById("getDay").value
    const userID = currentUser.uid

    getData(userID, year, month, day)
  }

  // Get a data set function call
  document.getElementById("getDataSet").onclick = function() {
    const year = document.getElementById("getSetYear").value
    const month = document.getElementById("getSetMonth").value
    const userID = currentUser.uid

    getDataSet(userID, year, month)
  }

  // Delete a single day's data function call
  document.getElementById("delete").onclick = function() {
    const year = document.getElementById("delYear").value;
    const month = document.getElementById("delMonth").value;
    const day = document.getElementById("delDay").value;
    const userID = currentUser.uid

    getDataSet(userID, year, month, day)
  }
