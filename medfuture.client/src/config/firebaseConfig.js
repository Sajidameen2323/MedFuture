// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArUDaAGH44cV_4p65wwNTQTWVKiFW1jIg",
    authDomain: "final-year-project-91cb1.firebaseapp.com",
    projectId: "final-year-project-91cb1",
    storageBucket: "final-year-project-91cb1.appspot.com",
    messagingSenderId: "756385588041",
    appId: "1:756385588041:web:4ff2321cb77098b66fb098"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };