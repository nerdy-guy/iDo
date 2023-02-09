// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTGRRJG6Yo-p3DE_ssXbIkGNT1xB4LbIY",
  authDomain: "ido-app-b626e.firebaseapp.com",
  projectId: "ido-app-b626e",
  storageBucket: "ido-app-b626e.appspot.com",
  messagingSenderId: "218339704948",
  appId: "1:218339704948:web:0c76ea874c279759c19121",
  measurementId: "G-LJ2SMGT9Z4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
