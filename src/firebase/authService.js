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

// Email específico autorizado
const AUTHORIZED_EMAIL = 'parispropiedadesinfo@gmail.com';

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Verificar si el email está autorizado
    if (user.email === AUTHORIZED_EMAIL) {
      // Guardar información del usuario en localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || user.email);
      
      return { success: true, user };
    } else {
      // Si no es el email autorizado, cerrar sesión
      await signOut(auth);
      return { 
        success: false, 
        error: `Solo el email ${AUTHORIZED_EMAIL} está autorizado para acceder.` 
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

// Función para iniciar sesión con email y contraseña (método actual)
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Verificar si el email está autorizado
    if (user.email === AUTHORIZED_EMAIL) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || user.email);
      
      return { success: true, user };
    } else {
      await signOut(auth);
      return { 
        success: false, 
        error: `Solo el email ${AUTHORIZED_EMAIL} está autorizado para acceder.` 
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
    if (user && user.email === AUTHORIZED_EMAIL) {
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
  return isAdmin === 'true' && userEmail === AUTHORIZED_EMAIL;
};

