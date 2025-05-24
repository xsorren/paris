import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const saveProperty = async (propertyData) => {
    const docRef = await addDoc(collection(db, "propiedades"), propertyData);
    return docRef.id;
};
