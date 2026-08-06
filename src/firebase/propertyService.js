import { db } from "./firebaseConfig";
import { collection, doc, deleteDoc, updateDoc, runTransaction, getDocs, query, orderBy, limit } from "firebase/firestore";
import { handleFirestoreError } from "./errorHandler";

export const saveProperty = async (propertyData) => {
    try {
        const counterRef = doc(db, "counters", "propiedadesCounter");
        const newDocRef = doc(collection(db, "propiedades"));

        // Detectar automáticamente el mayor idPropiedad existente en la colección
        let highestExistingId = 0;
        try {
            const maxQuery = query(collection(db, "propiedades"), orderBy("idPropiedad", "desc"), limit(1));
            const maxSnap = await getDocs(maxQuery);
            if (!maxSnap.empty) {
                const highestDoc = maxSnap.docs[0].data();
                if (highestDoc && highestDoc.idPropiedad != null && !isNaN(highestDoc.idPropiedad)) {
                    highestExistingId = Math.floor(Number(highestDoc.idPropiedad));
                }
            }
        } catch (queryErr) {
            console.warn("No se pudo obtener el idPropiedad máximo actual:", queryErr);
        }

        await runTransaction(db, async (transaction) => {
            const counterSnap = await transaction.get(counterRef);

            let newId;
            if (!counterSnap.exists()) {
                // Si el contador no existe, empieza en (máximo existente + 1), ej: 18 -> 19
                newId = highestExistingId + 1;
                transaction.set(counterRef, { lastId: newId });
            } else {
                const currentLastId = counterSnap.data().lastId || 0;
                const baseId = Math.max(currentLastId, highestExistingId);
                newId = baseId + 1;
                transaction.update(counterRef, { lastId: newId });
            }

            transaction.set(newDocRef, {
                ...propertyData,
                idPropiedad: newId,
            });
        });

        return { success: true, id: newDocRef.id };
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

export const toggleFinanciacion = async (propertyId, currentValue) => {
    try {
        const propertyRef = doc(db, "propiedades", propertyId);
        await updateDoc(propertyRef, {
            financiacion: !currentValue,
            fechaActualizacion: new Date()
        });
        return { success: true };
    } catch (error) {
        const errorMessage = handleFirestoreError(error, 'actualizar financiacion');
        return { success: false, error: errorMessage };
    }
};

