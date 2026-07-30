import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveProperty } from "./propertyService";
import { uploadMultipleImages, testStorageConnection, validateImageFiles } from "./imageUploadService";
import usePageTitle from "../hooks/usePageTitle";
import "./AdminUpload.css";

const AdminUpload = () => {
  usePageTitle("Nueva Propiedad - Panel de Administración");

  // Form State
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("casa");
  const [operacion, setOperacion] = useState("venta");
  const [precio, setPrecio] = useState("");
  const [metros, setMetros] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [observacion, setObservacion] = useState("");

  // Image & Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Modals State
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showFullscreenLightbox, setShowFullscreenLightbox] = useState(false);

  // General Notification UI State
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", success: true });
  const [propertyId, setPropertyId] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      navigate("/login");
      return;
    }

    const newPropertyId = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    setPropertyId(newPropertyId);

    testStorageConnection().then((r) => console.log("Storage OK:", r));
  }, [navigate]);

  const showNotification = (message, success = true) => {
    setModal({ show: true, message, success });
  };

  const closeModal = () => {
    setModal({ show: false, message: "", success: true });
  };

  // --- Image Handling & Drag Drop ---
  const handleFilesAdded = (newFilesArray) => {
    if (!newFilesArray || newFilesArray.length === 0) return;

    const combinedFiles = [...selectedFiles, ...newFilesArray];

    if (combinedFiles.length > 20) {
      showNotification("Máximo 20 imágenes permitidas por propiedad.", false);
      return;
    }

    const validation = validateImageFiles(newFilesArray);
    if (!validation.isValid) {
      showNotification(validation.errors.join(". "), false);
      return;
    }

    setSelectedFiles(combinedFiles);
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
    const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(updatedFiles);

    if (mainImageIndex === indexToRemove) {
      setMainImageIndex(0);
    } else if (mainImageIndex > indexToRemove) {
      setMainImageIndex((prev) => prev - 1);
    }

    setShowImageMenu(false);
    if (showFullscreenLightbox) {
      if (updatedFiles.length === 0) {
        setShowFullscreenLightbox(false);
      } else if (selectedImageIndex >= updatedFiles.length) {
        setSelectedImageIndex(updatedFiles.length - 1);
      }
    }
  };

  const handleClearAllImages = (e) => {
    e.stopPropagation();
    setSelectedFiles([]);
    setMainImageIndex(0);
    setShowImageMenu(false);
    setShowFullscreenLightbox(false);
  };

  // --- Thumbnail Click Action: Opens 2-option Modal ---
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

  // --- Fullscreen Lightbox Navigation ---
  const handleNextFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (selectedFiles.length === 0) return;
    setSelectedImageIndex((prev) => (prev + 1) % selectedFiles.length);
  };

  const handlePrevFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (selectedFiles.length === 0) return;
    setSelectedImageIndex((prev) => (prev - 1 + selectedFiles.length) % selectedFiles.length);
  };

  // --- Save / Upload Functionality ---
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

    setLoading(true);
    try {
      let uploadedImages = [];

      if (selectedFiles.length > 0) {
        // Reordenar para que la imagen principal sea la primera [0]
        const orderedFiles = [...selectedFiles];
        if (mainImageIndex > 0 && mainImageIndex < orderedFiles.length) {
          const [mainFile] = orderedFiles.splice(mainImageIndex, 1);
          orderedFiles.unshift(mainFile);
        }

        const uploadResult = await uploadMultipleImages(
          orderedFiles,
          propertyId,
          categoria,
          operacion
        );

        if (uploadResult.success) {
          uploadedImages = uploadResult.images.map((img) =>
            typeof img === "string" ? { url: img } : img
          );
        } else {
          throw new Error(uploadResult.error || "Error al subir las imágenes");
        }
      }

      const propertyData = {
        titulo: titulo.trim(),
        categoria,
        operacion,
        precio: precio.trim(),
        metros: metros.trim(),
        localidad: localidad.trim(),
        mapsLink: mapsLink.trim(),
        observacion: observacion.trim(),
        estado: "disponible",
        images: uploadedImages,
        createdAt: new Date().toISOString(),
        propertyId,
      };

      const saveResult = await saveProperty(propertyData);
      if (!saveResult.success) throw new Error(saveResult.error);

      showNotification(
        `Propiedad guardada con éxito${
          uploadedImages.length
            ? ` con ${uploadedImages.length} imagen${uploadedImages.length > 1 ? "es" : ""}`
            : ""
        }.`,
        true
      );

      // Reset Form State
      setTitulo("");
      setPrecio("");
      setMetros("");
      setLocalidad("");
      setMapsLink("");
      setObservacion("");
      setCategoria("casa");
      setOperacion("venta");
      setSelectedFiles([]);
      setMainImageIndex(0);
      setShowImageMenu(false);
      setShowFullscreenLightbox(false);

      // Generate fresh Property ID for next entry
      setPropertyId(`prop_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
    } catch (err) {
      console.error("Error al subir propiedad:", err);
      showNotification("Hubo un error al guardar la propiedad. Por favor reintentá.", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crm-container">
      {/* Header Superior */}
      <div className="crm-header-wrapper">
        <div className="crm-header-content">
          <div className="crm-badge">
            <span className="crm-badge-dot"></span>
            Panel de Administración
          </div>
          <h1 className="crm-title">Nueva Propiedad</h1>
          <p className="crm-subtitle">Completá la información de la propiedad.</p>
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

        {/* Fila 2 - Derecha: Imágenes y Botón Guardar Propiedad */}
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

            {/* Miniaturas de imágenes seleccionadas */}
            {selectedFiles.length > 0 && (
              <div>
                <div className="crm-images-meta">
                  <span className="crm-images-count">
                    {selectedFiles.length} imagen{selectedFiles.length > 1 ? "es" : ""} seleccionada{selectedFiles.length > 1 ? "s" : ""}
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
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="crm-preview-item"
                      onClick={(e) => handleThumbnailClick(idx, e)}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`thumbnail-${idx}`}
                        className="crm-preview-img"
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
                  ))}
                </div>
                <p className="crm-reorder-hint">
                  Hacé click en cualquier imagen para abrir sus opciones.
                </p>
              </div>
            )}
          </div>

          {/* Botón Principal Guardar Propiedad */}
          <button
            type="button"
            className="crm-save-btn"
            onClick={handleSaveProperty}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="crm-spinner"></span>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Guardar Propiedad</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Opciones (al presionar la imagen) */}
      {showImageMenu && selectedImageIndex !== null && selectedFiles[selectedImageIndex] && (
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
                src={URL.createObjectURL(selectedFiles[selectedImageIndex])}
                alt="Selected preview"
                className="crm-menu-thumb"
              />
            </div>

            <h3 className="crm-menu-title">Opciones de Imagen</h3>
            <p className="crm-menu-subtitle">¿Qué deseás hacer con esta foto?</p>

            <div className="crm-menu-options">
              {/* Opción 1: Marcar como principal */}
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

              {/* Opción 2: Ver foto en pantalla completa */}
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
      {showFullscreenLightbox && selectedImageIndex !== null && selectedFiles[selectedImageIndex] && (
        <div className="crm-lightbox-backdrop" onClick={() => setShowFullscreenLightbox(false)}>
          <div className="crm-lightbox-header" onClick={(e) => e.stopPropagation()}>
            <span className="crm-lightbox-counter">
              Imagen {selectedImageIndex + 1} de {selectedFiles.length}
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
            {selectedFiles.length > 1 && (
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
              src={URL.createObjectURL(selectedFiles[selectedImageIndex])}
              alt={`preview-full-${selectedImageIndex}`}
              className="crm-lightbox-img"
            />

            {selectedFiles.length > 1 && (
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

      {/* Modal de Notificación */}
      {modal.show && (
        <div className="crm-modal-backdrop" onClick={closeModal}>
          <div className="crm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className={`crm-modal-icon ${modal.success ? "success" : "error"}`}>
              {modal.success ? "✓" : "✕"}
            </div>
            <p className="crm-modal-message">{modal.message}</p>
            <button
              type="button"
              className={`crm-modal-btn ${modal.success ? "success" : "error"}`}
              onClick={closeModal}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
