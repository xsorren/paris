// src/firebase/imageUploadService.js
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebaseConfig';
import { handleStorageError } from './errorHandler';

// Función para verificar que el storage esté funcionando
export const testStorageConnection = async () => {
  try {
    console.log('Probando conexión con Firebase Storage...');
    console.log('Storage instance:', storage);
    
    // Crear una referencia de prueba
    const testRef = ref(storage, 'test/connection-test.txt');
    console.log('Referencia de prueba creada:', testRef);
    
    return { success: true, message: 'Storage configurado correctamente' };
  } catch (error) {
    console.error('Error en conexión con Storage:', error);
    return { success: false, error: error.message };
  }
};

// Función para subir una imagen al Storage organizada por tipo de propiedad y operación
export const uploadImage = async (file, propertyId, propertyType = 'casa', operation = 'venta') => {
  try {
    console.log('Subiendo imagen:', file.name, 'para propiedad:', propertyId, 'tipo:', propertyType, 'operación:', operation);
    
    // Crear una referencia única para la imagen
    const timestamp = Date.now();
    const fileName = `${propertyId}_${timestamp}_${file.name}`;
    
    // Organizar por tipo de propiedad y operación en carpetas separadas
    const folderPath = getPropertyFolder(propertyType, operation);
    const imageRef = ref(storage, `${folderPath}/${fileName}`);
    
    console.log('Ruta de la imagen:', `${folderPath}/${fileName}`);
    console.log('Referencia de Storage:', imageRef);
    
    // Subir el archivo
    console.log('Iniciando uploadBytes...');
    const snapshot = await uploadBytes(imageRef, file);
    console.log('Upload completado, snapshot:', snapshot);
    
    // Obtener la URL de descarga
    console.log('Obteniendo URL de descarga...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('URL obtenida:', downloadURL);
    
    return {
      success: true,
      url: downloadURL,
      fileName: fileName,
      path: snapshot.ref.fullPath,
      folder: folderPath
    };
  } catch (error) {
    console.error('Error detallado al subir imagen:', error);
    const errorMessage = handleStorageError(error, 'subir imagen');
    return {
      success: false,
      error: errorMessage || 'Error al subir la imagen. Intenta nuevamente.'
    };
  }
};

// Función para obtener la carpeta según el tipo de propiedad y operación
const getPropertyFolder = (propertyType, operation = 'venta') => {
  const folderMap = {
    'casa': 'images/casas',
    'departamento': 'images/departamentos', 
    'lote': 'images/lotes',
    'local': 'images/locales'
  };
  
  const baseFolder = folderMap[propertyType] || 'images/otros';
  return `${baseFolder}/${operation}`;
};

// Función para subir múltiples imágenes organizadas por tipo de propiedad y operación
export const uploadMultipleImages = async (files, propertyId, propertyType = 'casa', operation = 'venta') => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadImage(file, propertyId, propertyType, operation));
    const results = await Promise.all(uploadPromises);
    
    // Separar resultados exitosos de los que fallaron
    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);
    
    return {
      success: successful.length > 0,
      images: successful.map(result => ({
        url: result.url,
        fileName: result.fileName,
        path: result.path,
        folder: result.folder
      })),
      errors: failed.map(result => result.error),
      totalUploaded: successful.length,
      totalFailed: failed.length,
      propertyType: propertyType
    };
  } catch (error) {
    const errorMessage = handleStorageError(error, 'subir múltiples imágenes');
    return {
      success: false,
      error: errorMessage || 'Error al subir las imágenes. Intenta nuevamente.',
      images: [],
      errors: [errorMessage || error.message]
    };
  }
};

// Función para eliminar una imagen del Storage
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    const errorMessage = handleStorageError(error, 'eliminar imagen');
    return {
      success: false,
      error: errorMessage || 'Error al eliminar la imagen.'
    };
  }
};

// Función para validar archivos de imagen
export const validateImageFiles = (files) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const errors = [];
  
  Array.from(files).forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Archivo ${index + 1}: Solo se permiten imágenes JPG, PNG o WEBP`);
    }
    if (file.size > maxSize) {
      errors.push(`Archivo ${index + 1}: El tamaño máximo es 5MB`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
