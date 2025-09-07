// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ Importar

const firebaseConfig = {
  apiKey: "AIzaSyCucmKYuDTkgOLS5qvnFsWPHaLA5wlvm-o",
  authDomain: "negociosinmobiliarios-paris.firebaseapp.com",
  projectId: "negociosinmobiliarios-paris",
  storageBucket: "negociosinmobiliarios-paris.appspot.com", // ✅ corregido
  messagingSenderId: "648406067777",
  appId: "1:648406067777:web:f189f1bac2fd62f4abf4c0",
  measurementId: "G-H77KE3GKLV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // ✅ Ahora sí

export { db, auth, storage }; // ✅ Exportar storage
