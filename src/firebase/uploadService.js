import { storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadImages = async (files, category, propertyId) => {
  const urls = [];

  for (const file of files) {
    const storageRef = ref(storage, `${category}/${propertyId}/${file.name}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    urls.push(downloadURL);
  }

  return urls;
};
