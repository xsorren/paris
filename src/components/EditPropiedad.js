import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import usePageTitle from "../hooks/usePageTitle";

const EditarPropiedad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  usePageTitle(property?.titulo ? `Editar ${property.titulo}` : "Editar Propiedad");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    message: "",
    onClose: null,
    onConfirm: null,
    onCancel: null,
  });

  const showModal = (message, onClose = null) => {
    setModal({ visible: true, message, onClose, onConfirm: null, onCancel: null });
  };

  useEffect(() => {
    const fetchProperty = async () => {
      const docRef = doc(db, "propiedades", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProperty(docSnap.data());
      } else {
        showModal("Propiedad no encontrada", () => navigate("/blog"));
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id, navigate]);

  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...(property.images || [])];
    updatedImages[index] = value;
    setProperty({ ...property, images: updatedImages });
  };

  const addImage = () => {
    setProperty({ ...property, images: [...(property.images || []), ""] });
  };

  const removeImage = (index) => {
    const updatedImages = [...property.images];
    updatedImages.splice(index, 1);
    setProperty({ ...property, images: updatedImages });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "propiedades", id);
      await updateDoc(docRef, property);
      showModal("Propiedad actualizada correctamente", () => navigate(`/blog`));
    } catch (error) {
      console.error("Error al actualizar:", error);
      showModal("Error al actualizar la propiedad.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    setModal({
      visible: true,
      message: "¿Estás seguro que querés borrar esta propiedad?",
      onConfirm: async () => {
        setModal({ ...modal, visible: false });
        setDeleting(true);
        try {
          await deleteDoc(doc(db, "propiedades", id));
          showModal("Propiedad eliminada correctamente", () => navigate("/blog"));
        } catch (error) {
          console.error("Error al eliminar:", error);
          showModal("No se pudo eliminar la propiedad.");
        } finally {
          setDeleting(false);
        }
      },
      onCancel: () => setModal({ ...modal, visible: false }),
    });
  };

  if (loading || !property) return <p style={styles.center}>Cargando...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Editar Propiedad</h2>

      <label style={styles.label}>Título:</label>
      <input
        name="titulo"
        value={property.titulo}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>Tipo de Propiedad:</label>
      <select
        name="categoria"
        value={property.categoria || ""}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="casa">Casa</option>
        <option value="departamento">Departamento</option>
        <option value="lote">Lote</option>
        <option value="local">Local</option>
      </select>

      <label style={styles.label}>Ubicación:</label>
      <input
        name="localidad"
        value={property.localidad || ""}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>Google Maps Link (Embed SRC):</label>
      <input
        name="mapsLink"
        value={property.mapsLink || ""}
        onChange={handleChange}
        style={styles.input}
        placeholder="Link de iframe o URL de maps"
      />

      <label style={styles.label}>Precio:</label>
      <input
        name="precio"
        value={property.precio || ""}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>Metros:</label>
      <input
        name="metros"
        value={property.metros}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>Observaciones:</label>
      <textarea
        name="observacion"
        value={property.observacion}
        onChange={handleChange}
        style={styles.textarea}
      />

      <label style={styles.label}>Imágenes:</label>
      {(property.images || []).map((img, index) => (
        <div key={index} style={styles.imageRow}>
          <img 
            src={img.url || img} 
            alt={`Vista previa ${index}`} 
            style={styles.imagePreview} 
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100x70?text=Error";
            }}
          />
          <input
            value={img.url || img}
            readOnly
            style={{ ...styles.input, backgroundColor: "#f0f0f0", cursor: "default" }}
          />
          <button
            onClick={() => removeImage(index)}
            style={styles.removeButton}
            disabled={saving || deleting}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        onClick={addImage}
        style={styles.secondaryButton}
        disabled={saving || deleting}
      >
        + Agregar Imagen
      </button>

      <div style={styles.buttonRow}>
        <button
          onClick={handleSave}
          style={{ ...styles.saveButton, opacity: saving ? 0.6 : 1 }}
          disabled={saving || deleting}
        >
          {saving ? "Guardando..." : "💾 Guardar cambios"}
        </button>
        <button
          onClick={confirmDelete}
          style={{ ...styles.deleteButton, opacity: deleting ? 0.6 : 1 }}
          disabled={saving || deleting}
        >
          {deleting ? "Eliminando..." : "🗑 Borrar propiedad"}
        </button>
      </div>

      {modal.visible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p style={{ fontSize: "18px" }}>{modal.message}</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
              {modal.onConfirm && (
                <>
                  <button
                    style={{ ...styles.confirmBtn, backgroundColor: "#c82333" }}
                    onClick={modal.onConfirm}
                  >
                    Sí, borrar
                  </button>
                  <button
                    style={styles.confirmBtn}
                    onClick={modal.onCancel}
                  >
                    Cancelar
                  </button>
                </>
              )}
              {!modal.onConfirm && (
                <button
                  style={styles.confirmBtn}
                  onClick={() => {
                    setModal({ ...modal, visible: false });
                    if (modal.onClose) modal.onClose();
                  }}
                >
                  Aceptar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🧩 Estilos
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  center: {
    textAlign: "center",
    padding: "50px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    marginTop: "15px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "100px",
  },
  imageRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  imagePreview: {
    width: "80px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#c82333",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: "#184a8e",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default EditarPropiedad;
