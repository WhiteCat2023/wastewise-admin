// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXSoQECpB-0CGVzMolkhJGqBW-mtG2Yig",
  authDomain: "wastewise-7c78c.firebaseapp.com",
  projectId: "wastewise-7c78c",
  storageBucket: "wastewise-7c78c.firebasestorage.app",
  messagingSenderId: "526496714970",
  appId: "1:526496714970:web:4dc42e0ae5ecc5bbc415e3",
  measurementId: "G-W1EG7LK45E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);