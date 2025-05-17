// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- Importar Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCucmKYuDTkgOLS5qvnFsWPHaLA5wlvm-o",
  authDomain: "negociosinmobiliarios-paris.firebaseapp.com",
  projectId: "negociosinmobiliarios-paris",
  storageBucket: "negociosinmobiliarios-paris.firebasestorage.app",
  messagingSenderId: "648406067777",
  appId: "1:648406067777:web:f189f1bac2fd62f4abf4c0",
  measurementId: "G-H77KE3GKLV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Firestore
const db = getFirestore(app);

// Exportar la instancia de Firestore
export { db };
