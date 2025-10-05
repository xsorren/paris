import { db } from "./firebaseConfig";
import { collection, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { handleFirestoreError } from "./errorHandler";

export const saveProperty = async (propertyData) => {
    try {
        const docRef = await addDoc(collection(db, "propiedades"), propertyData);
        return { success: true, id: docRef.id };
    } catch (error) {
        const errorMessage = handleFirestoreError(error, 'guardar propiedad');
        return { success: false, error: errorMessage };
    }
};

export const deleteProperty = async (propertyId) => {
    try {
        await deleteDoc(doc(db, "propiedades", propertyId));
        return { success: true };
    } catch (error) {
        const errorMessage = handleFirestoreError(error, 'eliminar propiedad');
        return { success: false, error: errorMessage };
    }
};

export const updatePropertyStatus = async (propertyId, newStatus) => {
    try {
        const propertyRef = doc(db, "propiedades", propertyId);
        await updateDoc(propertyRef, {
            estado: newStatus,
            fechaActualizacion: new Date()
        });
        return { success: true };
    } catch (error) {
        const errorMessage = handleFirestoreError(error, 'actualizar estado de propiedad');
        return { success: false, error: errorMessage };
    }
};
