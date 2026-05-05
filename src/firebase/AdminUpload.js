import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveProperty } from "./propertyService";
import { uploadMultipleImages, testStorageConnection } from "./imageUploadService";
import ImageUpload from "../components/ImageUpload";
import usePageTitle from "../hooks/usePageTitle";

// 🎨 Estilos base reutilizables
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
};

const buttonStyle = {
  width: "60%",
  padding: "12px",
  fontSize: "1.1rem",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "700",
  backgroundColor: "#2e7d32",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "background-color 0.3s ease",
  cursor: "pointer",
  marginTop: "20px",
};

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  borderRadius: "14px",
  padding: "30px 35px",
  maxWidth: "400px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

const AdminUpload = () => {
  usePageTitle("Panel de Administración");

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("casa");
  const [operacion, setOperacion] = useState("venta");
  const [precio, setPrecio] = useState("");
  const [metros, setMetros] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [observacion, setObservacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", success: true });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) navigate("/login");

    const newPropertyId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setPropertyId(newPropertyId);

    testStorageConnection().then((r) => console.log("Storage OK:", r));
  }, [navigate]);

  const showModal = (message, success = true) => setModal({ show: true, message, success });
  const closeModal = () => setModal({ show: false, message: "", success: true });

  const handleUpload = async () => {
    const errores = [];
    if (!titulo.trim()) errores.push("el título");
    if (!metros.trim()) errores.push("los metros");
    if (!localidad.trim()) errores.push("la ubicación");

    if (errores.length > 0) {
      showModal(`Por favor, completá ${errores.join(", ")}.`, false);
      return;
    }

    setLoading(true);
    try {
      let uploadedImages = [];

      // 📤 Subir imágenes al Storage
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadMultipleImages(selectedFiles, propertyId, categoria, operacion);
        if (uploadResult.success) {
          uploadedImages = uploadResult.images.map((url) => {
            // 🧩 Aseguramos que cada imagen tenga formato { url: "..." }
            return typeof url === "string" ? { url } : url;
          });
        } else {
          throw new Error(uploadResult.error);
        }
      }

      // 📁 Datos de la propiedad
      const propertyData = {
        titulo,
        categoria,
        precio,
        metros,
        localidad,
        mapsLink,
        observacion,
        operacion,
        estado: "disponible",
        images: uploadedImages, // ✅ Ahora guardamos el array correctamente
        createdAt: new Date().toISOString(),
        propertyId,
        precio,
      };

      // 🧠 Guardar en Firestore
      const saveResult = await saveProperty(propertyData);
      if (!saveResult.success) throw new Error(saveResult.error);

      showModal(
        `Propiedad subida con éxito${uploadedImages.length ? ` con ${uploadedImages.length} imagen${uploadedImages.length > 1 ? "es" : ""}` : ""}.`,
        true
      );

      // 🔄 Reset del formulario
      setTitulo("");
      setPrecio("");
      setMetros("");
      setLocalidad("");
      setMapsLink("");
      setObservacion("");
      setOperacion("venta");
      setSelectedFiles([]);

      // Generar nuevo ID para la siguiente propiedad
      setPropertyId(`prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    } catch (err) {
      console.error("Error al subir propiedad:", err);
      showModal("Hubo un error al guardar la propiedad.", false);
    }
    setLoading(false);
  };


  return (
    <div
      className="admin-upload-wrapper"
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "30px 40px",
        display: "flex",
        justifyContent: "space-between",
        gap: "40px",
        flexWrap: "wrap",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <style>{`
        @media (max-width: 992px) {
          .admin-upload-wrapper {
            padding: 20px 20px !important;
            margin: 20px 15px !important;
          }
          .admin-col-left,
          .admin-col-right {
            min-width: 100% !important;
            flex: 1 1 100% !important;
          }
          .admin-field-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .admin-field-row span {
            min-width: unset !important;
            width: 100% !important;
          }
        }
        @media (max-width: 600px) {
          .admin-upload-wrapper {
            padding: 15px 12px !important;
            margin: 10px 8px !important;
          }
          .admin-upload-btn {
            width: 100% !important;
          }
        }
      `}</style>
      <h2 style={{ width: "100%", textAlign: "center", marginBottom: "25px", color: "#004080" }}>
        Panel de Administración
      </h2>

      {/* COLUMNA IZQUIERDA */}
      <div className="admin-col-left" style={{ flex: "1 1 500px", minWidth: "450px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="admin-field-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ minWidth: "240px" }}>🖊️ Escribí el <strong>título</strong> de la propiedad.</span>
          <input
            type="text"
            placeholder="Ej: Casa con 2 plantas y jardín"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        <div className="admin-field-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ minWidth: "240px" }}>🏷️ Elegí la <strong>categoría</strong>.</span>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="lote">Lote</option>
            <option value="local">Local</option>
          </select>
        </div>

        <div className="admin-field-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ minWidth: "240px" }}>🏷️ Elegí la <strong>operación</strong>.</span>
          <select value={operacion} onChange={(e) => setOperacion(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        <div className="admin-field-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ minWidth: "240px" }}>💵 Ingresá el <strong>precio</strong> (opcional).</span>
          <input
            type="text"
            placeholder="Ej: USD 150.000 / $ 500.000"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        <div className="admin-field-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ minWidth: "240px" }}>📐 Ingresá los <strong>metros</strong> del terreno <span style={{ color: "#c00" }}>*</span>.</span>
          <input
            type="text"
            placeholder="Ej: 120 x 200"
            value={metros}
            onChange={(e) => setMetros(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        <div className="admin-field-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ minWidth: "240px" }}>📍 Indicá la <strong>ubicación</strong> completa <span style={{ color: "#c00" }}>*</span>.</span>
          <input
            type="text"
            placeholder="Ej: Calle Falsa 123, CABA"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        <div className="admin-field-row" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
          <span>🗺️ Link de <strong>Google Maps</strong> (src de iframe/Embed opcional)</span>
          <input
            type="text"
            placeholder="Pegar código u url de Google Maps"
            value={mapsLink}
            onChange={(e) => setMapsLink(e.target.value)}
            style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div className="admin-field-row" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
          <span>📝 Agregá alguna <strong>observación</strong>.</span>
          <textarea
            placeholder="Detalles adicionales, comentarios, etc."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            style={{ ...textareaStyle, width: "100%", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="admin-col-right" style={{ flex: "1 1 500px", minWidth: "450px", display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "25px" }}>
        <div>
          <span style={{ display: "block", marginBottom: "8px" }}>📷 <strong>Seleccioná imágenes</strong> (opcional, máx. 20).</span>
          <ImageUpload selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} maxImages={20} />
        </div>

        {selectedFiles.length > 0 && (
          <div>
            <h4 style={{ color: "#0b1f44", fontWeight: "600" }}>
              Imágenes seleccionadas ({selectedFiles.length})
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {selectedFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`img-${index}`}
                  style={{
                    width: "100%",
                    height: "90px",
                    borderRadius: "6px",
                    border: "2px solid #e0e0e0",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ display: "block", marginBottom: "10px" }}>
            📤 Presioná <strong>"Subir Propiedad"</strong>.
          </span>
          <button
            className="admin-upload-btn"
            onClick={handleUpload}
            disabled={loading}
            style={{ ...buttonStyle, backgroundColor: loading ? "#9ccc9c" : "#2e7d32" }}
          >
            {loading ? "Subiendo..." : "Subir Propiedad"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {modal.show && (
        <div style={modalBackdropStyle}>
          <div style={modalContentStyle}>
            <p
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                fontSize: "1.1rem",
                color: modal.success ? "#2e7d32" : "#b71c1c",
              }}
            >
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
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
