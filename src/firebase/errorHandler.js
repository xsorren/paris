// src/firebase/errorHandler.js
// Manejador de errores para Firebase

export const handleFirebaseError = (error, context = '') => {
  console.error(`Error en ${context}:`, error);
  
  // Mapear errores comunes de Firebase
  const errorMessages = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El email ya está en uso',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Usuario deshabilitado',
    'permission-denied': 'No tienes permisos para realizar esta acción',
    'unavailable': 'Servicio temporalmente no disponible',
    'deadline-exceeded': 'Tiempo de espera agotado',
    'resource-exhausted': 'Recursos agotados',
    'unauthenticated': 'No estás autenticado',
    'not-found': 'Recurso no encontrado',
    'already-exists': 'El recurso ya existe',
    'failed-precondition': 'Condición previa fallida',
    'aborted': 'Operación cancelada',
    'out-of-range': 'Valor fuera de rango',
    'unimplemented': 'Función no implementada',
    'internal': 'Error interno del servidor',
    'data-loss': 'Pérdida de datos',
    'unknown': 'Error desconocido'
  };

  // Obtener código de error
  const errorCode = error.code || error.message || 'unknown';
  
  // Retornar mensaje amigable
  return errorMessages[errorCode] || `Error: ${error.message || 'Error desconocido'}`;
};

// Función para manejar errores de Firestore específicamente
export const handleFirestoreError = (error, operation = 'operación') => {
  // Ignorar errores de BloomFilter que no afectan funcionalidad
  if (error.message && error.message.includes('BloomFilter')) {
    console.warn('BloomFilter error ignorado (no afecta funcionalidad):', error);
    return null;
  }
  
  return handleFirebaseError(error, `Firestore ${operation}`);
};

// Función para manejar errores de Storage
export const handleStorageError = (error, operation = 'operación') => {
  return handleFirebaseError(error, `Storage ${operation}`);
};

// Función para manejar errores de Auth
export const handleAuthError = (error, operation = 'autenticación') => {
  return handleFirebaseError(error, `Auth ${operation}`);
};
