import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveProperty } from "./propertyService";
import { uploadMultipleImages, testStorageConnection } from "./imageUploadService";
import ImageUpload from "../components/ImageUpload";
import usePageTitle from "../hooks/usePageTitle";

const AdminUpload = () => {
  usePageTitle("Panel de Administración");
  
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("casa");
  const [operacion, setOperacion] = useState("venta");
  const [metros, setMetros] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [observacion, setObservacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", success: true });
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/login");
      return;
    }

    // Generar un ID único para la propiedad
    const newPropertyId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setPropertyId(newPropertyId);

    // Probar conexión con Storage
    testStorageConnection().then(result => {
      console.log('Resultado de prueba de Storage:', result);
    });

    const welcomeMessage = localStorage.getItem("welcomeMessage");
    if (welcomeMessage) {
      showModal(welcomeMessage, true);
      localStorage.removeItem("welcomeMessage");
    }
  }, [navigate]);

  const showModal = (message, success = true) => {
    setModal({ show: true, message, success });
  };

  const closeModal = () => {
    setModal({ show: false, message: "", success: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

const handleUpload = async () => {
  const errores = [];

  if (!titulo.trim()) errores.push("el título");
  if (!metros.trim()) errores.push("los metros");
  if (!localidad.trim()) errores.push("la ubicación");

  if (errores.length > 0) {
    const mensaje = `Por favor, completá ${errores.join(", ")}.`;
    showModal(mensaje, false);
    return;
  }

  setLoading(true);
  try {
    let uploadedImages = [];
    
    // Subir imágenes si hay archivos seleccionados
    if (selectedFiles.length > 0) {
      console.log('Iniciando subida de imágenes:', selectedFiles.length, 'archivos');
      console.log('Property ID:', propertyId);
      console.log('Categoría:', categoria);
      
      const uploadResult = await uploadMultipleImages(selectedFiles, propertyId, categoria, operacion);
      console.log('Resultado de subida:', uploadResult);
      
      if (uploadResult.success) {
        uploadedImages = uploadResult.images;
        console.log('Imágenes subidas exitosamente:', uploadedImages);
      } else {
        console.error('Error al subir imágenes:', uploadResult.error);
        showModal(`Error al subir las imágenes: ${uploadResult.error}`, false);
        setLoading(false);
        return;
      }
    } else {
      console.log('No hay archivos seleccionados para subir');
    }

    const propertyData = {
      titulo,
      categoria,
      metros,
      localidad,
      observacion,
      operacion,
      images: uploadedImages, // Incluir las URLs de las imágenes subidas
    };

    const saveResult = await saveProperty(propertyData);
    
    if (saveResult.success) {
      showModal(`Propiedad subida con éxito. ${uploadedImages.length > 0 ? `Se subieron ${uploadedImages.length} imagen${uploadedImages.length > 1 ? 'es' : ''}.` : ''}`, true);
    } else {
      showModal(`Error al guardar la propiedad: ${saveResult.error}`, false);
      setLoading(false);
      return;
    }

    // Limpiar formulario
    setTitulo("");
    setMetros("");
    setLocalidad("");
    setObservacion("");
    setOperacion("venta");
    setImages([]);
    setSelectedFiles([]);
    
    // Generar nuevo ID para la siguiente propiedad
    const newPropertyId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setPropertyId(newPropertyId);
  } catch (error) {
    console.error("Error al subir la propiedad:", error);
    showModal("Hubo un error al guardar la propiedad. Intentá nuevamente.", false);
  }
  setLoading(false);
};



  return (
    <div style={{
      maxWidth: "520px",
      margin: "40px auto",
      padding: "30px 40px",
      backgroundColor: "#fff",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      borderRadius: "12px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
      textAlign: "left"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#004080" }}>
        Panel de Administración
      </h2>

      <p style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: "12px" }}>Instrucciones:</p>
      <ul style={{ marginBottom: "25px", lineHeight: "1.6", color: "#555", fontSize: "0.95rem" }}>
        <li>🖊️ Escribí el <strong>título</strong> de la propiedad.</li>
        <li>🏷️ Elegí la <strong>categoría</strong>.</li>
        <li>🏷️ Elegí la <strong>operacion</strong>.</li>
        <li>📐 Ingresá los <strong>metros</strong> del terreno (ejemplo: 120).</li>
        <li>📍 Indicá la <strong>ubicación</strong> completa.</li>
        <li>📝 Agregá alguna <strong>observación</strong> si querés.</li>
        <li>📷 <strong>Seleccioná imágenes</strong> de la propiedad (opcional, máximo 10).</li>
        <li>📤 Presioná <strong>"Subir Propiedad"</strong> para subir todo junto.</li>
      </ul>

      <label style={labelStyle}>Título <span style={{ color: "#c00" }}>*</span></label>
      <input
        type="text"
        placeholder="Ej: Casa con 2 plantas y jardín"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Categoría</label>
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        style={selectStyle}
      >
        <option value="casa">Casas</option>
        <option value="departamento">Departamentos</option>
        <option value="lote">Lotes</option>
        <option value="local">Locales</option>
      </select>
      <label style={labelStyle}>Tipo de operación</label>
      <select
        value={operacion}
        onChange={(e) => setOperacion(e.target.value)}
        style={selectStyle}
      >
        <option value="venta">Venta</option>
        <option value="alquiler">Alquiler</option>
      </select>

      <label style={labelStyle}>Metros (m²) <span style={{ color: "#c00" }}>*</span></label>
      <input
        type="text"
        placeholder="Ej: 120 x 200"
        value={metros}
        onChange={(e) => setMetros(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Ubicación <span style={{ color: "#c00" }}>*</span></label>
      <input
        type="text"
        placeholder="Ej: Calle Falsa 123, CABA"
        value={localidad}
        onChange={(e) => setLocalidad(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Observaciones</label>
      <textarea
        placeholder="Detalles adicionales, comentarios, etc."
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        style={textareaStyle}
      />

      {/* Componente de selección de imágenes */}
      <ImageUpload 
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        maxImages={10}
      />

      {/* Mostrar imágenes seleccionadas */}
      {selectedFiles.length > 0 && (
        <div style={styles.uploadedImagesContainer}>
          <h4 style={styles.uploadedImagesTitle}>
            Imágenes seleccionadas ({selectedFiles.length})
          </h4>
          <div style={styles.uploadedImagesGrid}>
            {selectedFiles.map((file, index) => (
              <div key={index} style={styles.uploadedImageItem}>
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Imagen ${index + 1}`}
                  style={styles.uploadedImage}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          ...buttonStyle,
          backgroundColor: loading ? "#9ccc9c" : "#2e7d32",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Subiendo..." : `Subir Propiedad${selectedFiles.length > 0 ? ` con ${selectedFiles.length} imagen${selectedFiles.length > 1 ? 'es' : ''}` : ''}`}
      </button>

      {/* Modal */}
      {modal.show && (
        <div style={modalBackdropStyle}>
          <div style={modalContentStyle}>
            <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "1.1rem", color: modal.success ? "#2e7d32" : "#b71c1c" }}>
              {modal.message}
            </p>
            <button
              onClick={closeModal}
              style={{
                padding: "10px 25px",
                backgroundColor: modal.success ? "#2e7d32" : "#b71c1c",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "background-color 0.3s ease"
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = modal.success ? "#27632a" : "#901616"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = modal.success ? "#2e7d32" : "#b71c1c"}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos reutilizables
const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: "6px",
  marginTop: "12px",
  color: "#004080",
  fontSize: "0.95rem",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1.5px solid #ccc",
  outlineColor: "#004080",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundColor: "#fff",
  cursor: "pointer",
};

const textareaStyle = {
  width: "100%",
  minHeight: "80px",
  padding: "10px 14px",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1.5px solid #ccc",
  outlineColor: "#004080",
  resize: "vertical",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "1.1rem",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "700",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  transition: "background-color 0.3s ease",
};

const modalBackdropStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalContentStyle = {
  backgroundColor: "#fff",
  borderRadius: "14px",
  padding: "30px 35px",
  maxWidth: "400px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
};

// Estilos para las imágenes subidas
const styles = {
  uploadedImagesContainer: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
  },
  uploadedImagesTitle: {
    margin: "0 0 10px 0",
    color: "#0b1f44",
    fontSize: "16px",
    fontWeight: "600",
  },
  uploadedImagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "8px",
  },
  uploadedImageItem: {
    position: "relative",
    aspectRatio: "1",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "6px",
    border: "2px solid #e0e0e0",
  },
};

export default AdminUpload;
