import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveProperty } from "./propertyService";

const AdminUpload = () => {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("casa");
  const [operacion, setOperacion] = useState("venta");
  const [metros, setMetros] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [observacion, setObservacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", success: true });
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/login");
      return;
    }

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
    const propertyData = {
      titulo,
      categoria,
      metros,
      localidad,
      observacion,
      operacion,
      images: [],
    };

    await saveProperty(propertyData);
    showModal("Propiedad subida con éxito.", true);

    setTitulo("");
    setMetros("");
    setLocalidad("");
    setObservacion("");
    setOperacion("venta");
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
        <li>📤 Presioná <strong>“Subir Propiedad”</strong> para guardar.</li>
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
        placeholder="Ej: 120"
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

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          ...buttonStyle,
          backgroundColor: loading ? "#9ccc9c" : "#2e7d32",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Subiendo..." : "Subir Propiedad"}
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

export default AdminUpload;
