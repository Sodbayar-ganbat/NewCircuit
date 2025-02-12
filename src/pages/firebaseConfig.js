// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8UBk7or93z6u1NeXV1jmuHOmyusJ-rwE",
  authDomain: "circuit-eb73c.firebaseapp.com",
  projectId: "circuit-eb73c",
  storageBucket: "circuit-eb73c.firebasestorage.app",
  messagingSenderId: "997074025294",
  appId: "1:997074025294:web:3a3faac9dab0155eeb7c1f",
  measurementId: "G-Q9G5S9JKJG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);