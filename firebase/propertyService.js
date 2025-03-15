import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const saveProperty = async (propertyData) => {
    const docRef = await addDoc(collection(db, "properties"), propertyData);
    return docRef.id; // Devuelve el ID de la propiedad guardada
};
