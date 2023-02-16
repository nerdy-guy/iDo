import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTGRRJG6Yo-p3DE_ssXbIkGNT1xB4LbIY",
  authDomain: "ido-app-b626e.firebaseapp.com",
  projectId: "ido-app-b626e",
  storageBucket: "ido-app-b626e.appspot.com",
  messagingSenderId: "218339704948",
  appId: "1:218339704948:web:0c76ea874c279759c19121",
  measurementId: "G-LJ2SMGT9Z4",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export { db, provider, auth };
