import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { uploadMultipleImages, validateImageFiles } from "../firebase/imageUploadService";
import usePageTitle from "../hooks/usePageTitle";
import "../firebase/AdminUpload.css";

const EditPropiedad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  usePageTitle("Editar Propiedad - Panel de Administración");

  // Form State
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("casa");
  const [operacion, setOperacion] = useState("venta");
  const [precio, setPrecio] = useState("");
  const [metros, setMetros] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [observacion, setObservacion] = useState("");
  const [estado, setEstado] = useState("disponible");

  // Image & Upload State
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Modals State
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showFullscreenLightbox, setShowFullscreenLightbox] = useState(false);

  // General UI State
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", success: true, confirm: false, onConfirm: null });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "propiedades", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitulo(data.titulo || "");
          setCategoria(data.categoria || "casa");
          setOperacion(data.operacion || "venta");
          setPrecio(data.precio || "");
          setMetros(data.metros || "");
          setLocalidad(data.localidad || "");
          setMapsLink(data.mapsLink || "");
          setObservacion(data.observacion || "");
          setEstado(data.estado || "disponible");
          setImages(data.images || []);
        } else {
          showNotification("Propiedad no encontrada", false);
          setTimeout(() => navigate("/blog"), 1500);
        }
      } catch (err) {
        console.error("Error al cargar propiedad:", err);
        showNotification("Error al cargar la propiedad", false);
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const showNotification = (message, success = true) => {
    setModal({ show: true, message, success, confirm: false, onConfirm: null });
  };

  const closeModal = () => {
    setModal({ show: false, message: "", success: true, confirm: false, onConfirm: null });
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img instanceof File) return URL.createObjectURL(img);
    return img.url || "";
  };

  // --- Image Handling & Drag Drop ---
  const handleFilesAdded = async (newFilesArray) => {
    if (!newFilesArray || newFilesArray.length === 0) return;

    const validation = validateImageFiles(newFilesArray);
    if (!validation.isValid) {
      showNotification(validation.errors.join(". "), false);
      return;
    }

    try {
      setSaving(true);
      const uploadResult = await uploadMultipleImages(
        newFilesArray,
        id,
        categoria,
        operacion
      );

      if (uploadResult.success) {
        const uploadedImages = uploadResult.images.map((img) =>
          typeof img === "string" ? { url: img } : img
        );
        setImages((prev) => [...prev, ...uploadedImages]);
      } else {
        showNotification(uploadResult.error || "Error al subir las imágenes", false);
      }
    } catch (err) {
      console.error("Error al subir imágenes:", err);
      showNotification("Error al subir las imágenes", false);
    } finally {
      setSaving(false);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFilesAdded(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFilesAdded(droppedFiles);
    }
  };

  const handleRemoveImage = (indexToRemove, e) => {
    if (e) e.stopPropagation();
    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updatedImages);

    if (mainImageIndex === indexToRemove) {
      setMainImageIndex(0);
    } else if (mainImageIndex > indexToRemove) {
      setMainImageIndex((prev) => prev - 1);
    }

    setShowImageMenu(false);
    if (showFullscreenLightbox) {
      if (updatedImages.length === 0) {
        setShowFullscreenLightbox(false);
      } else if (selectedImageIndex >= updatedImages.length) {
        setSelectedImageIndex(updatedImages.length - 1);
      }
    }
  };

  const handleClearAllImages = (e) => {
    e.stopPropagation();
    setImages([]);
    setMainImageIndex(0);
    setShowImageMenu(false);
    setShowFullscreenLightbox(false);
  };

  const handleThumbnailClick = (index, e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex(index);
    setShowImageMenu(true);
  };

  const handleOptionSetMain = () => {
    if (selectedImageIndex !== null) {
      setMainImageIndex(selectedImageIndex);
    }
    setShowImageMenu(false);
  };

  const handleOptionViewFullscreen = () => {
    setShowImageMenu(false);
    setShowFullscreenLightbox(true);
  };

  const handleNextFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (images.length === 0) return;
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (images.length === 0) return;
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // --- Save Property Changes ---
  const handleSaveProperty = async () => {
    const errores = [];
    if (!titulo.trim()) errores.push("Título");
    if (!metros.trim()) errores.push("Metros del terreno");
    if (!localidad.trim()) errores.push("Ubicación");

    if (errores.length > 0) {
      showNotification(
        `Por favor completá los siguientes campos obligatorios (*): ${errores.join(", ")}.`,
        false
      );
      return;
    }

    setSaving(true);
    try {
      // Reordenar para que la imagen principal sea la primera [0]
      const orderedImages = [...images];
      if (mainImageIndex > 0 && mainImageIndex < orderedImages.length) {
        const [mainImg] = orderedImages.splice(mainImageIndex, 1);
        orderedImages.unshift(mainImg);
      }

      const updatedData = {
        titulo: titulo.trim(),
        categoria,
        operacion,
        precio: precio.trim(),
        metros: metros.trim(),
        localidad: localidad.trim(),
        mapsLink: mapsLink.trim(),
        observacion: observacion.trim(),
        estado,
        images: orderedImages,
        updatedAt: new Date().toISOString(),
      };

      const docRef = doc(db, "propiedades", id);
      await updateDoc(docRef, updatedData);
      showNotification("Propiedad actualizada correctamente.", true);
      setTimeout(() => {
        navigate("/blog");
      }, 1200);
    } catch (err) {
      console.error("Error al actualizar la propiedad:", err);
      showNotification("Hubo un error al guardar los cambios. Por favor reintentá.", false);
    } finally {
      setSaving(false);
    }
  };

  // --- Delete Property ---
  const handleDeleteProperty = () => {
    setModal({
      show: true,
      confirm: true,
      message: "¿Estás seguro que querés eliminar esta propiedad? Esta acción no se puede deshacer.",
      onConfirm: async () => {
        setModal({ show: false, message: "", success: true, confirm: false, onConfirm: null });
        setDeleting(true);
        try {
          await deleteDoc(doc(db, "propiedades", id));
          showNotification("Propiedad eliminada correctamente.", true);
          setTimeout(() => {
            navigate("/blog");
          }, 1200);
        } catch (err) {
          console.error("Error al eliminar la propiedad:", err);
          showNotification("No se pudo eliminar la propiedad.", false);
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  if (fetching) {
    return (
      <div className="crm-container" style={{ textAlign: "center", padding: "100px 20px" }}>
        <p style={{ fontSize: "18px", color: "#64748b" }}>Cargando datos de la propiedad...</p>
      </div>
    );
  }

  return (
    <div className="crm-container">
      {/* Header Superior */}
      <div className="crm-header-wrapper">
        <div className="crm-header-content">
          <div className="crm-badge">
            <span className="crm-badge-dot"></span>
            Panel de Administración
          </div>
          <h1 className="crm-title">Editar Propiedad</h1>
          <p className="crm-subtitle">Modificá la información de la propiedad (ID: {id}).</p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="crm-clear-btn"
            onClick={() => navigate("/blog")}
            style={{ padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}
          >
            ← Volver a propiedades
          </button>
          <button
            type="button"
            className="crm-clear-btn"
            onClick={handleDeleteProperty}
            style={{ color: "#dc2626", borderColor: "#fca5a5", padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}
            disabled={saving || deleting}
          >
            🗑️ Eliminar Propiedad
          </button>
        </div>
      </div>

      {/* Layout Grid (2x2):
          Fila 1: [Sección 1 - Información]   [Sección 2 - Ubicación]
          Fila 2: [Sección 3 - Observaciones] [Imágenes + Guardar Propiedad]
      */}
      <div className="crm-grid-layout">
        {/* Fila 1 - Izquierda: Sección 1 - Información */}
        <div className="crm-grid-cell">
          <div className="crm-card">
            <div className="crm-card-header">
              <div className="crm-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h2 className="crm-card-title">Sección 1 - Información</h2>
            </div>

            <div className="crm-form-group">
              <label className="crm-label">
                Título<span className="crm-required">*</span>
              </label>
              <input
                type="text"
                className="crm-input"
                placeholder="Ej: Casa moderna de 3 dormitorios con piscina y jardín"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="crm-form-row">
              <div className="crm-form-group">
                <label className="crm-label">Categoría</label>
                <select
                  className="crm-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="lote">Lote</option>
                  <option value="local">Local</option>
                  <option value="campo">Campo</option>
                </select>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Operación</label>
                <select
                  className="crm-select"
                  value={operacion}
                  onChange={(e) => setOperacion(e.target.value)}
                >
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
            </div>

            <div className="crm-form-row">
              <div className="crm-form-group">
                <label className="crm-label">Precio</label>
                <input
                  type="text"
                  className="crm-input"
                  placeholder="Ej: USD 180.000 / $ 450.000"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>

              <div className="crm-form-group">
                <label className="crm-label">
                  Metros del terreno<span className="crm-required">*</span>
                </label>
                <input
                  type="text"
                  className="crm-input"
                  placeholder="Ej: 150 m² / 10x30"
                  value={metros}
                  onChange={(e) => setMetros(e.target.value)}
                />
              </div>
            </div>

            <div className="crm-form-row" style={{ marginTop: "12px" }}>
              <div className="crm-form-group">
                <label className="crm-label">Estado de Publicación</label>
                <select
                  className="crm-select"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="disponible">Disponible</option>
                  <option value="vendida">Vendida</option>
                  <option value="alquilada">Alquilada</option>
                  <option value="financiacion">Financiación</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 1 - Derecha: Sección 2 - Ubicación */}
        <div className="crm-grid-cell">
          <div className="crm-card">
            <div className="crm-card-header">
              <div className="crm-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h2 className="crm-card-title">Sección 2 - Ubicación</h2>
            </div>

            <div className="crm-form-group">
              <label className="crm-label">
                Dirección / Ubicación<span className="crm-required">*</span>
              </label>
              <input
                type="text"
                className="crm-input"
                placeholder="Ej: Av. Santa Fe 1420, Barrio Norte, CABA"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Google Maps (Embed / Link)</label>
              <input
                type="text"
                className="crm-input"
                placeholder="Pegar URL o código de mapa de Google Maps"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Fila 2 - Izquierda: Sección 3 - Observaciones */}
        <div className="crm-grid-cell">
          <div className="crm-card">
            <div className="crm-card-header">
              <div className="crm-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h2 className="crm-card-title">Sección 3 - Observaciones</h2>
            </div>

            <div className="crm-form-group flex-1">
              <label className="crm-label">Detalles adicionales</label>
              <textarea
                className="crm-textarea"
                placeholder="Ingresá detalles de la propiedad, condiciones de venta, comodidades extras..."
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Fila 2 - Derecha: Imágenes y Botón Guardar Cambios */}
        <div className="crm-grid-cell crm-cell-bottom-right">
          <div className="crm-card">
            <div className="crm-card-header">
              <div className="crm-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <h2 className="crm-card-title">Imágenes</h2>
            </div>

            {/* Dropzone */}
            <div
              className={`crm-dropzone ${dragActive ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="crm-file-input"
              />
              <div className="crm-dropzone-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="crm-dropzone-text">
                Arrastrá imágenes aquí o hacé click para seleccionarlas.
              </p>
              <p className="crm-dropzone-subtext">
                Formatos JPG, PNG, WEBP (máx. 20 fotos)
              </p>
            </div>

            {/* Miniaturas de imágenes */}
            {images.length > 0 && (
              <div>
                <div className="crm-images-meta">
                  <span className="crm-images-count">
                    {images.length} imagen{images.length > 1 ? "es" : ""} cargada{images.length > 1 ? "s" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAllImages}
                    className="crm-clear-btn"
                  >
                    Eliminar todas
                  </button>
                </div>

                <div className="crm-preview-grid">
                  {images.map((img, idx) => {
                    const src = getImageUrl(img);
                    return (
                      <div
                        key={idx}
                        className="crm-preview-item"
                        onClick={(e) => handleThumbnailClick(idx, e)}
                      >
                        <img
                          src={src}
                          alt={`thumbnail-${idx}`}
                          className="crm-preview-img"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100x70?text=Error";
                          }}
                        />

                        {idx === mainImageIndex && (
                          <span className="crm-main-badge">Principal</span>
                        )}

                        <button
                          type="button"
                          className="crm-remove-btn"
                          title="Eliminar imagen"
                          onClick={(e) => handleRemoveImage(idx, e)}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p className="crm-reorder-hint">
                  Hacé click en cualquier imagen para abrir sus opciones.
                </p>
              </div>
            )}
          </div>

          {/* Botón Principal Guardar Cambios */}
          <button
            type="button"
            className="crm-save-btn"
            onClick={handleSaveProperty}
            disabled={saving || deleting}
          >
            {saving ? (
              <>
                <span className="crm-spinner"></span>
                <span>Guardando cambios...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Opciones (al presionar la imagen) */}
      {showImageMenu && selectedImageIndex !== null && images[selectedImageIndex] && (
        <div className="crm-modal-backdrop" onClick={() => setShowImageMenu(false)}>
          <div className="crm-menu-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="crm-menu-close-x"
              onClick={() => setShowImageMenu(false)}
              title="Cerrar"
            >
              ✕
            </button>

            <div className="crm-menu-thumb-wrapper">
              <img
                src={getImageUrl(images[selectedImageIndex])}
                alt="Selected preview"
                className="crm-menu-thumb"
              />
            </div>

            <h3 className="crm-menu-title">Opciones de Imagen</h3>
            <p className="crm-menu-subtitle">¿Qué deseás hacer con esta foto?</p>

            <div className="crm-menu-options">
              {selectedImageIndex === mainImageIndex ? (
                <button type="button" className="crm-menu-option-btn main-current" disabled>
                  ✓ Es la imagen principal
                </button>
              ) : (
                <button
                  type="button"
                  className="crm-menu-option-btn primary"
                  onClick={handleOptionSetMain}
                >
                  ⭐ 1. Marcar como principal
                </button>
              )}

              <button
                type="button"
                className="crm-menu-option-btn"
                onClick={handleOptionViewFullscreen}
              >
                🔍 2. Ver foto en pantalla completa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal para Ver Foto en Pantalla Completa */}
      {showFullscreenLightbox && selectedImageIndex !== null && images[selectedImageIndex] && (
        <div className="crm-lightbox-backdrop" onClick={() => setShowFullscreenLightbox(false)}>
          <div className="crm-lightbox-header" onClick={(e) => e.stopPropagation()}>
            <span className="crm-lightbox-counter">
              Imagen {selectedImageIndex + 1} de {images.length}
            </span>
            <button
              type="button"
              className="crm-lightbox-close"
              onClick={() => setShowFullscreenLightbox(false)}
              title="Cerrar vista previa"
            >
              ✕
            </button>
          </div>

          <div className="crm-lightbox-body" onClick={(e) => e.stopPropagation()}>
            {images.length > 1 && (
              <button
                type="button"
                className="crm-lightbox-nav prev"
                onClick={handlePrevFullscreen}
                title="Imagen anterior"
              >
                ‹
              </button>
            )}

            <img
              src={getImageUrl(images[selectedImageIndex])}
              alt={`preview-full-${selectedImageIndex}`}
              className="crm-lightbox-img"
            />

            {images.length > 1 && (
              <button
                type="button"
                className="crm-lightbox-nav next"
                onClick={handleNextFullscreen}
                title="Siguiente imagen"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de Notificación o Confirmación */}
      {modal.show && (
        <div className="crm-modal-backdrop" onClick={closeModal}>
          <div className="crm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className={`crm-modal-icon ${modal.confirm ? "error" : modal.success ? "success" : "error"}`}>
              {modal.confirm ? "⚠️" : modal.success ? "✓" : "✕"}
            </div>
            <p className="crm-modal-message">{modal.message}</p>

            {modal.confirm ? (
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  type="button"
                  className="crm-modal-btn error"
                  onClick={modal.onConfirm}
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  className="crm-modal-btn"
                  style={{ backgroundColor: "#64748b" }}
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`crm-modal-btn ${modal.success ? "success" : "error"}`}
                onClick={closeModal}
              >
                Entendido
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPropiedad;
