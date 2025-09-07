import { db } from "./firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

export const createProperty = async (propertyData) => {
  const docRef = await addDoc(collection(db, "propiedades"), {
    ...propertyData,
    images: [],
    imagesPaths: []
  });
  return docRef.id;
};

export const updatePropertyImages = async (propertyId, urls, paths) => {
  const propertyRef = doc(db, "propiedades", propertyId);
  await updateDoc(propertyRef, {
    images: urls,
    imagesPaths: paths
  });
};
