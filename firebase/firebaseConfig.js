// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlkkMG1eI7-Chnh_VbzSFU-uw2woL87Hg",
  authDomain: "paris-inmobiliaria.firebaseapp.com",
  projectId: "paris-inmobiliaria",
  storageBucket: "paris-inmobiliaria.firebasestorage.app",
  messagingSenderId: "900348197330",
  appId: "1:900348197330:web:8b5499bec13141cc8e700b",
  measurementId: "G-1QM5R8LP89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };