import { storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export const uploadImages = async (files, categoria, propertyId) => {
  const urls = [];
  const paths = [];

  for (const file of files) {
    const path = `${categoria}/${propertyId}/${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);

    urls.push(downloadURL);
    paths.push(path);
  }

  return { urls, paths };
};

// Para borrar una imagen por path
export const deleteImage = async (path) => {
  const imageRef = ref(storage, path);
  await deleteObject(imageRef);
};
