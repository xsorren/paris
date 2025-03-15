import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from '../../firebase/firestore';
import BlogItem from "./BlogItem";

const Blog = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "properties"));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPropiedades(data);
        } catch (error) {
            console.error("Error al obtener propiedades:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Nuestras Propiedades</h1>
            {loading ? <p>Cargando...</p> : (
                <div>
                    {propiedades.map((property) => (
                        <BlogItem key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;
