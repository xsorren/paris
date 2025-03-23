import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { uploadImages } from "./uploadService";
import { saveProperty } from "./propertyService";

const AdminUpload = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("casas");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // 🔒 Verificar si el usuario es administrador
    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin !== "true") {
            history.push("/login"); // Redirigir si no es admin
        }
    }, [history]);

    // 🚪 Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        history.push("/login");
    };

    // 📤 Subir propiedad
    const handleUpload = async () => {
        if (!title || !price || !location || images.length === 0) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        setLoading(true);
        try {
            const propertyData = { title, category, price, location, images: [] };
            const propertyId = await saveProperty(propertyData);

            const urls = await uploadImages(images, category, propertyId);
            await saveProperty({ ...propertyData, images: urls });

            alert("Propiedad subida con éxito.");
            setTitle("");
            setPrice("");
            setLocation("");
            setImages([]);
        } catch (error) {
            console.error("Error al subir la propiedad:", error);
            alert("Hubo un error al subir la propiedad.");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>Panel de Administración</h2>
            <button onClick={handleLogout} style={{ background: "red", color: "white", padding: "10px", marginBottom: "20px", border: "none", cursor: "pointer" }}>
                Cerrar sesión
            </button>
            
            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="casas">Casas</option>
                <option value="departamentos">Departamentos</option>
                <option value="lotes">Lotes</option>
                <option value="locales">Locales</option>
            </select>
            <input type="number" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="text" placeholder="Ubicación" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input type="file" multiple onChange={(e) => setImages([...e.target.files])} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Subiendo..." : "Subir Propiedad"}
            </button>
        </div>
    );
};

export default AdminUpload;
