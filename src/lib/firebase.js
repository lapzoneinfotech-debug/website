// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9VRfUWjLY_DqUWfc1t5teCdv6SUGr2CY",
  authDomain: "website-5d3f1.firebaseapp.com",
  projectId: "website-5d3f1",
  storageBucket: "website-5d3f1.firebasestorage.app",
  messagingSenderId: "67370042547",
  appId: "1:67370042547:web:3ac299b219a51edb9a5cc6",
  measurementId: "G-X5DM5BLBZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
