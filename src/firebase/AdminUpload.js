import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveProperty } from "./propertyService";
import { uploadImages } from "./uploadService";
import { db } from "./firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const AdminUpload = () => {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("casa");
  const [operacion, setOperacion] = useState("venta");
  const [metros, setMetros] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [observacion, setObservacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", success: true });
  const [files, setFiles] = useState([]);
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
    const baseData = {
      titulo,
      categoria,
      metros,
      localidad,
      observacion,
      operacion,
      images: [],
      imagesPaths: [],
    };

    // 1) Crear documento base
    const propertyId = await saveProperty(baseData);

    // 2) Subir imágenes si hay archivos
    if (files.length > 0) {
      const { urls, paths } = await uploadImages(files, categoria, propertyId);
      await updateDoc(doc(db, "propiedades", propertyId), {
        images: urls,
        imagesPaths: paths,
      });
    }

    showModal("Propiedad subida con éxito.", true);

    // Reset de formulario
    setTitulo("");
    setMetros("");
    setLocalidad("");
    setObservacion("");
    setOperacion("venta");
    setFiles([]);
  } catch (error) {
    console.error("Error al subir la propiedad:", error);
    showModal("Hubo un error al guardar la propiedad. Intentá nuevamente.", false);
  }
  setLoading(false);
};


  return (
    <div className="container-narrow">
      <div className="form" style={{maxWidth: 680, margin: '32px auto'}}>
        <h2 className="title-xl" style={{fontSize: 28, margin: 0}}>Panel de Administración</h2>
        <div className="title-underline" />

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

      <label className="label">Título <span style={{ color: "#c00" }}>*</span></label>
      <input
        type="text"
        placeholder="Ej: Casa con 2 plantas y jardín"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="form-control"
      />

      <label className="label">Categoría</label>
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="form-select"
      >
        <option value="casa">Casas</option>
        <option value="departamento">Departamentos</option>
        <option value="lote">Lotes</option>
        <option value="local">Locales</option>
      </select>
      <label className="label">Tipo de operación</label>
      <select
        value={operacion}
        onChange={(e) => setOperacion(e.target.value)}
        className="form-select"
      >
        <option value="venta">Venta</option>
        <option value="alquiler">Alquiler</option>
      </select>

      <label className="label">Metros (m²) <span style={{ color: "#c00" }}>*</span></label>
      <input
        type="text"
        placeholder="Ej: 120"
        value={metros}
        onChange={(e) => setMetros(e.target.value)}
        className="form-control"
      />

      <label className="label">Ubicación <span style={{ color: "#c00" }}>*</span></label>
      <input
        type="text"
        placeholder="Ej: Calle Falsa 123, CABA"
        value={localidad}
        onChange={(e) => setLocalidad(e.target.value)}
        className="form-control"
      />

      <label className="label">Observaciones</label>
      <textarea
        placeholder="Detalles adicionales, comentarios, etc."
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        className="textarea"
      />

      <label className="label">Imágenes (múltiples)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="form-control"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`btn ${loading ? 'btn-secondary' : 'btn-success'}`}
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
    </div>
  );
};

// Estilos reutilizables
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
