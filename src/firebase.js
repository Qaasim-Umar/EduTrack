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
  apiKey: "AIzaSyBwbqQSnihJBNCFhsEPX5vq3FigCz9JtDs",
  authDomain: "edutrack-7f215.firebaseapp.com",
  projectId: "edutrack-7f215",
  storageBucket: "edutrack-7f215.firebasestorage.app",
  messagingSenderId: "24849912432",
  appId: "1:24849912432:web:a65f6b26ff51786702dab5",
  measurementId: "G-9F73KLHB6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Initialize Firestore
export const db = getFirestore(app);