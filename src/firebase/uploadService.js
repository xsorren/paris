import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Sube archivos a Storage y retorna URLs públicas y paths internos.
 * @param {File[]} files
 * @param {string} categoria
 * @param {string} propertyId
 * @returns {{ urls: string[], paths: string[] }}
 */
export const uploadImages = async (files, categoria, propertyId) => {
  const urls = [];
  const paths = [];

  for (const file of files) {
    const objectPath = `${categoria}/${propertyId}/${file.name}`;
    const storageRef = ref(storage, objectPath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    urls.push(downloadURL);
    paths.push(objectPath);
  }

  return { urls, paths };
};
