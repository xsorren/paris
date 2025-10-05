// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ Agregado

const firebaseConfig = {
  apiKey: "AIzaSyCucmKYuDTkgOLS5qvnFsWPHaLA5wlvm-o",
  authDomain: "negociosinmobiliarios-paris.firebaseapp.com",
  projectId: "negociosinmobiliarios-paris",
  storageBucket: "negociosinmobiliarios-paris.firebasestorage.app",
  messagingSenderId: "648406067777",
  appId: "1:648406067777:web:f189f1bac2fd62f4abf4c0",
  measurementId: "G-H77KE3GKLV"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Configuración de Firestore para desarrollo
const db = getFirestore(app);

// Configuración de Auth
const auth = getAuth(app);

// Configuración de Storage
const storage = getStorage(app);

// Configuración de Analytics (solo en producción)
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics no disponible:', error);
  }
}

// Configurar manejo de errores de Firestore
if (process.env.NODE_ENV === 'development') {
  // Deshabilitar logs de debug en desarrollo para reducir errores BloomFilter
  console.log('Firebase configurado en modo desarrollo');
}

export { db, auth, storage, analytics };
