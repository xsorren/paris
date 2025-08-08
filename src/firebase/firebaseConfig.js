// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ Storage

const firebaseConfig = {
  apiKey: "AIzaSyCucmKYuDTkgOLS5qvnFsWPHaLA5wlvm-o",
  authDomain: "negociosinmobiliarios-paris.firebaseapp.com",
  projectId: "negociosinmobiliarios-paris",
  // Bucket recomendado para SDK Web
  storageBucket: "negociosinmobiliarios-paris.appspot.com",
  messagingSenderId: "648406067777",
  appId: "1:648406067777:web:f189f1bac2fd62f4abf4c0",
  measurementId: "G-H77KE3GKLV"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
