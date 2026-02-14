// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAXSoQECpB-0CGVzMolkhJGqBW-mtG2Yig",
//   authDomain: "wastewise-7c78c.firebaseapp.com",
//   projectId: "wastewise-7c78c",
//   storageBucket: "wastewise-7c78c.firebasestorage.app",
//   messagingSenderId: "526496714970",
//   appId: "1:526496714970:web:4dc42e0ae5ecc5bbc415e3",
//   measurementId: "G-W1EG7LK45E"
// };

// // Initialize Firebase                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTxV85dU4eJxu1hob2XoaiFb89M4q5rsg",
  authDomain: "sinco-bce54.firebaseapp.com",
  projectId: "sinco-bce54",
  storageBucket: "sinco-bce54.firebasestorage.app",
  messagingSenderId: "316576516123",
  appId: "1:316576516123:web:861da1f4b4a9a34e0290be",
  measurementId: "G-N349GHBLJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);