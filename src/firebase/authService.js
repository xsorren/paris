// src/firebase/authService.js
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();

// Lista de emails autorizados
export const AUTHORIZED_EMAILS = [
  'parispropiedadesinfo@gmail.com',
  'parisnegociosinmobiliarios@gmail.com',
  'faltrastudio@gmail.com'
];

export const isAuthorizedEmail = (email) => {
  if (!email) return false;
  return AUTHORIZED_EMAILS.some(
    (authedEmail) => authedEmail.toLowerCase() === email.trim().toLowerCase()
  );
};

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar si el email está autorizado
    if (isAuthorizedEmail(user.email)) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || user.email);

      return { success: true, user };
    } else {
      // Si no es un email autorizado, cerrar sesión
      await signOut(auth);
      return {
        success: false,
        error: 'Tu email no está autorizado para acceder al panel de administración.'
      };
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return {
      success: false,
      error: 'Error al iniciar sesión. Intenta nuevamente.'
    };
  }
};

// Función para iniciar sesión con email y contraseña
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Verificar si el email está autorizado
    if (isAuthorizedEmail(user.email)) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || user.email);

      return { success: true, user };
    } else {
      await signOut(auth);
      return {
        success: false,
        error: 'Tu email no está autorizado para acceder al panel de administración.'
      };
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return {
      success: false,
      error: 'Email o contraseña incorrectos.'
    };
  }
};

// Función para cerrar sesión
export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: 'Error al cerrar sesión.' };
  }
};

// Función para verificar el estado de autenticación
export const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && isAuthorizedEmail(user.email)) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || user.email);
    } else {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    }
    callback(user);
  });
};

// Función para verificar si el usuario actual está autorizado
export const isUserAuthorized = () => {
  const isAdmin = localStorage.getItem('isAdmin');
  const userEmail = localStorage.getItem('userEmail');
  return isAdmin === 'true' && isAuthorizedEmail(userEmail);
};
