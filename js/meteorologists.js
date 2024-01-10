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