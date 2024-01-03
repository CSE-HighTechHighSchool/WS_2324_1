// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";  
import {getDatabase, ref, set, update, child, get} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

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

const auth = getAuth(); //firebase authentication

//Return an instance of the database associated with your app
const db = getDatabase(app);

// ---------------------- Sign-In User ---------------------------------------//

document.getElementById('signIn').onclick = function() {
    // Get user's email and password for the sign in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    //console.log(email, password);
    //Attempt to sign user in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        //Create user credential and store user ID
        const user = userCredential.user;

        //Log sign in date in DB
        // 'Update' function will only add the last_login info and won't overwrite everything
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate, 
        })
        .then(() => {
            //User signed in successfully
            alert('User signed in successfully!')

            //Get snapshot of all the user info (including uid that will be
            //passed to the login() function and stored in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if (snapshot.exists()){
                    console.log(snapshot.val())
                    logIn(snapshot.val())
                } 
                else {
                    console.log("User does not exist")
                }
            })
        })
        .catch((error) => {
            //Sign-In failed...
            alert(error)
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        })

})
}

// ---------------- Keep User Logged In ----------------------------------//
function logIn(user){
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    //Session storage is temporary (only while the session is active)
    //Information is saved as a string (must be converted to a JS object to string)
    // Session storage will cleared with a signOut() function in home.
    if(!keepLoggedIn){
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location="home.html" //Redirect to home.html
    }

    // Local storage is permanent (keep user logged in if browser is clsoed)
    //Local storage will be cleared with signOut() function
    else {
        localStorage.setItem('keepLoggedIn','yes');
        localStroage.setItem('user', JSON.stringify(user));
        window.location = 'home.html' // Redirect broser to home.html
    }
}