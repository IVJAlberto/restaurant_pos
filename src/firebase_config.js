// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth' 

const firebaseConfig = {
  apiKey: "AIzaSyDjzhp6xouoz2akExYRkAz5AumhNws_3do",
  authDomain: "restaurant-pos-deaa5.firebaseapp.com",
  projectId: "restaurant-pos-deaa5",
  storageBucket: "restaurant-pos-deaa5.firebasestorage.app",
  messagingSenderId: "138806955382",
  appId: "1:138806955382:web:f4ffa16d77a73bcae2be57",
  measurementId: "G-S3QZQ6DRCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);