// src/firebase/videoUploadService.js
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebaseConfig';
import { handleStorageError } from './errorHandler';

// Duración máxima permitida: estrictamente menor a 5 minutos (300 segundos)
const MAX_VIDEO_DURATION_SECONDS = 300;
const MAX_VIDEOS_PER_PROPERTY = 2;

/**
 * Obtiene la duración real de un archivo de video usando un elemento <video> HTML5.
 * @param {File} file - El archivo de video
 * @returns {Promise<number>} - Duración en segundos
 */
export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';

    const objectUrl = URL.createObjectURL(file);

    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const duration = videoEl.duration;
      if (!isFinite(duration) || isNaN(duration)) {
        reject(new Error('No se pudo determinar la duración del video.'));
      } else {
        resolve(duration);
      }
    };

    videoEl.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Error al cargar el archivo de video para validación.'));
    };

    videoEl.src = objectUrl;
  });
};

/**
 * Formatea una duración en segundos a formato mm:ss legible.
 * @param {number} seconds
 * @returns {string} Ej: "4:30", "1:05"
 */
export const formatVideoDuration = (seconds) => {
  if (!isFinite(seconds) || isNaN(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Valida un archivo de video: extensión, MIME type y duración.
 * @param {File} file
 * @param {number} duration - Duración del video en segundos (ya obtenida)
 * @returns {{ isValid: boolean, error: string|null }}
 */
export const validateVideoFile = (file, duration) => {
  const allowedMime = 'video/mp4';
  const fileName = file.name.toLowerCase();

  // Validar extensión
  if (!fileName.endsWith('.mp4')) {
    return {
      isValid: false,
      error: `"${file.name}": Solo se permiten archivos MP4.`,
    };
  }

  // Validar MIME type (cuando el navegador lo proporcione)
  if (file.type && file.type !== allowedMime) {
    return {
      isValid: false,
      error: `"${file.name}": El archivo no es un video MP4 válido (tipo detectado: ${file.type}).`,
    };
  }

  // Validar duración: debe ser estrictamente menor a 300 segundos
  if (duration >= MAX_VIDEO_DURATION_SECONDS) {
    return {
      isValid: false,
      error: `"${file.name}": El video dura ${formatVideoDuration(duration)} y no puede ser cargado. El video debe durar menos de 5 minutos.`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Obtiene la carpeta de Storage para videos, organizada igual que las imágenes.
 * @param {string} propertyType
 * @param {string} operation
 * @returns {string}
 */
const getVideoFolder = (propertyType, operation = 'venta') => {
  const folderMap = {
    casa: 'casas',
    departamento: 'departamentos',
    lote: 'lotes',
    local: 'locales',
    campo: 'campos',
    quinta: 'quintas',
    quintas: 'quintas',
    'complejo turistico': 'complejos',
    'complejos turisticos': 'complejos',
  };

  const typeKey = (propertyType || '').toLowerCase().trim();
  const baseFolder = folderMap[typeKey] || 'otros';
  const op = (operation || 'venta').toLowerCase().trim();
  return `images/${baseFolder}/${op}/video`;
};

/**
 * Sube un video al Firebase Storage.
 * @param {File} file
 * @param {string} propertyId
 * @param {string} propertyType
 * @param {string} operation
 * @returns {Promise<{ success: boolean, url?: string, fileName?: string, path?: string, folder?: string, error?: string }>}
 */
export const uploadVideo = async (
  file,
  propertyId,
  propertyType = 'casa',
  operation = 'venta'
) => {
  try {
    const timestamp = Date.now();
    const fileName = `${propertyId}_${timestamp}_${file.name}`;
    const folderPath = getVideoFolder(propertyType, operation);
    const videoRef = ref(storage, `${folderPath}/${fileName}`);

    console.log('Subiendo video:', file.name, '→', `${folderPath}/${fileName}`);

    const metadata = { contentType: file.type || 'video/mp4' };
    const snapshot = await uploadBytes(videoRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('Video subido correctamente:', downloadURL);

    return {
      success: true,
      url: downloadURL,
      fileName,
      path: snapshot.ref.fullPath,
      folder: folderPath,
    };
  } catch (error) {
    console.error('Error al subir video:', error);
    const errorMessage = handleStorageError(error, 'subir video');
    return {
      success: false,
      error: errorMessage || 'Error al subir el video. Intenta nuevamente.',
    };
  }
};

/**
 * Sube múltiples videos al Firebase Storage.
 * @param {File[]} files
 * @param {string} propertyId
 * @param {string} propertyType
 * @param {string} operation
 * @returns {Promise<{ success: boolean, videos: object[], errors: string[], totalUploaded: number, totalFailed: number }>}
 */
export const uploadMultipleVideos = async (
  files,
  propertyId,
  propertyType = 'casa',
  operation = 'venta'
) => {
  try {
    const uploadPromises = Array.from(files).map((file) =>
      uploadVideo(file, propertyId, propertyType, operation)
    );
    const results = await Promise.all(uploadPromises);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return {
      success: successful.length > 0,
      videos: successful.map((r) => ({
        url: r.url,
        fileName: r.fileName,
        path: r.path,
        folder: r.folder,
      })),
      errors: failed.map((r) => r.error),
      totalUploaded: successful.length,
      totalFailed: failed.length,
    };
  } catch (error) {
    const errorMessage = handleStorageError(error, 'subir múltiples videos');
    return {
      success: false,
      error: errorMessage || 'Error al subir los videos. Intenta nuevamente.',
      videos: [],
      errors: [errorMessage || error.message],
      totalUploaded: 0,
      totalFailed: 0,
    };
  }
};

/**
 * Elimina un video del Firebase Storage dado su path.
 * @param {string} videoPath - Path completo en Storage
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const deleteVideo = async (videoPath) => {
  try {
    const videoRef = ref(storage, videoPath);
    await deleteObject(videoRef);
    return { success: true };
  } catch (error) {
    const errorMessage = handleStorageError(error, 'eliminar video');
    return {
      success: false,
      error: errorMessage || 'Error al eliminar el video.',
    };
  }
};

export { MAX_VIDEOS_PER_PROPERTY, MAX_VIDEO_DURATION_SECONDS };
