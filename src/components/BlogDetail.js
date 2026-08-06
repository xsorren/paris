import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import usePageTitle from "../hooks/usePageTitle";
import { updatePropertyStatus } from "../firebase/propertyService";
import { isUserAuthorized } from "../firebase/authService";
import { formatearIdPropiedad } from "../utils/propertyUtils";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  useEffect(() => {
    // Verificar si el usuario es administrador
    setIsAdmin(isUserAuthorized());

    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "propiedades", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProperty({ id: docSnap.id, ...data });
        } else {
          console.error("No se encontró la propiedad.");
        }
      } catch (error) {
        console.error("Error al obtener la propiedad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Actualizar título de la página con el nombre de la propiedad
  usePageTitle(property?.titulo || "Cargando...");

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const handlePrevImage = useCallback(() => {
    if (property && property.images && property.images.length > 0) {
      setActiveImage((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  }, [property]);

  const handleNextImage = useCallback(() => {
    if (property && property.images && property.images.length > 0) {
      setActiveImage((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  }, [property]);

  const handleStatusChange = async (newStatus) => {
    try {
      const result = await updatePropertyStatus(property.id, newStatus);
      if (result.success) {
        setProperty(prev => ({ ...prev, estado: newStatus }));
      } else {
        console.error("Error al actualizar estado:", result.error);
        alert("Error al actualizar el estado de la propiedad. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado de la propiedad. Intenta nuevamente.");
    }
  };

  // Manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showImageModal) return;

      switch (event.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        default:
          break;
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showImageModal, handleNextImage, handlePrevImage]);

  if (loading) return <LoadingComponent />;
  if (!property) return <NotFoundComponent />;

  return (
    <div style={styles.container} className="bd-container">
      <style>
        {`
        
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          
          .dot:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          .dot:nth-child(2) {
            animation-delay: -0.16s;
          }
          
          .edit-button:hover {
            background-color: #0d3a6b !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(24, 74, 142, 0.4) !important;
          }
          .contact-button:hover {
            background-color: #0d3a6b !important;
            transform: translateY(-1px) !important;
          }
          .main-image:hover {
            transform: scale(1.02) !important;
          }
          .close-modal-button:hover {
            background-color: #fff !important;
            transform: scale(1.1) !important;
          }
          .modal-nav-button:hover {
            background-color: #fff !important;
            transform: translateY(-50%) scale(1.1) !important;
          }
          .back-to-blog-button:hover {
            background-color: #0d3a6b !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(24, 74, 142, 0.4) !important;
          }
          /* ---- Tablet (max-width: 992px) ---- */
          @media (max-width: 992px) {
            .bd-container {
              padding: 25px 15px !important;
            }
            .bd-title {
              font-size: 30px !important;
              letter-spacing: 0.5px !important;
            }
            .content {
              gap: 25px !important;
            }
            .bd-status-indicator {
              font-size: 32px !important;
            }
          }

          /* ---- Mobile (max-width: 768px) ---- */
          @media (max-width: 768px) {
            .bd-container {
              padding: 15px 12px !important;
            }
            .bd-title {
              font-size: 22px !important;
              letter-spacing: 0 !important;
              margin-bottom: 15px !important;
            }
            .bd-back-button {
              font-size: 14px !important;
              padding: 8px 14px !important;
            }
            .content {
              flex-direction: column !important;
              gap: 20px !important;
            }
            .carousel-section {
              order: 1 !important;
              flex: 1 1 100% !important;
            }
            .right-panel {
              order: 2 !important;
              flex: 1 1 100% !important;
            }
            .bd-status-indicator {
              font-size: 22px !important;
              padding: 8px 0 !important;
            }
            /* Modal nav buttons: move inside the image on small screens */
            .modal-prev-btn {
              left: 5px !important;
            }
            .modal-next-btn {
              right: 5px !important;
            }
          }

          /* ---- Small Mobile (max-width: 480px) ---- */
          @media (max-width: 480px) {
            .bd-container {
              padding: 12px 8px !important;
            }
            .bd-title {
              font-size: 18px !important;
            }
            .bd-thumbnail {
              width: 72px !important;
              height: 52px !important;
            }
            .bd-status-indicator {
              font-size: 16px !important;
            }
            .modal-prev-btn {
              left: 2px !important;
              width: 36px !important;
              height: 36px !important;
              font-size: 18px !important;
            }
            .modal-next-btn {
              right: 2px !important;
              width: 36px !important;
              height: 36px !important;
              font-size: 18px !important;
            }
          }

          .imageOverlayContainer:hover .hover-overlay {
           opacity: 1 !important;
          }
          
          .map-embed iframe {
            width: 100% !important;
            height: 250px !important;
            border-radius: 8px !important;
            border: none !important;
          }

          /* --- Tooltip estilo Uiverse para ID de Propiedad --- */
          .property-id-badge-container {
            position: relative;
            display: inline-flex;
            align-items: center;
          }

          .property-id-badge {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            font-weight: 700;
            color: #184a8e;
            background-color: rgba(24, 74, 142, 0.08);
            border: 1px solid rgba(24, 74, 142, 0.2);
            padding: 4px 12px;
            border-radius: 6px;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
          }

          .property-id-badge:hover {
            background-color: rgba(24, 74, 142, 0.15);
            border-color: rgba(24, 74, 142, 0.4);
            transform: translateY(-1px);
          }

          .property-id-tooltip {
            position: absolute;
            bottom: calc(100% + 10px);
            right: 0;
            transform: translateY(6px) scale(0.95);
            transform-origin: bottom right;
            background: #0f172a;
            color: #ffffff;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.25s;
            pointer-events: none;
            font-family: Arial, sans-serif;
            letter-spacing: 0.3px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
            z-index: 50;
          }

          .property-id-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            right: 18px;
            border-width: 6px 6px 0 6px;
            border-style: solid;
            border-color: #0f172a transparent transparent transparent;
          }

          .property-id-badge-container:hover .property-id-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
          }
        `}
      </style>
      <h1 style={styles.title} className="bd-title">{property.title}</h1>

      <button style={styles.backButton} className="bd-back-button" onClick={() => navigate("/blog")}>
        ← Volver al Blog
      </button>
      {/* Título centrado arriba */}
      <h1 style={styles.title} className="bd-title">{property.titulo}</h1>
      <div style={styles.titleUnderline}></div>

      <div style={styles.content} className="content">
        {/* Panel izquierdo - Carrusel de imágenes */}
        <div style={styles.carouselSection} className="carousel-section">
          <div style={styles.imageContainer}>
            <div
              style={styles.imageContainer}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div style={styles.imageOverlayContainer} onClick={handleImageClick}>
                <img
                  src={
                    property.images?.[activeImage]?.url ||
                    property.images?.[activeImage] ||
                    "https://via.placeholder.com/800x400?text=Sin+imagen"
                  }
                  alt="Propiedad"
                  style={styles.mainImage}
                  className="main-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Error+al+cargar";
                  }}
                />

                {/* Overlay gris con texto */}
                <div
                  style={{
                    ...styles.hoverOverlay,
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <span style={styles.overlayText}>
                    Ver fotos en pantalla completa
                  </span>
                </div>
              </div>
            </div>


            {/* Indicador de estado */}
            {property.estado && property.estado !== 'disponible' && (
              <div style={styles.statusIndicator} className="bd-status-indicator">
                {property.estado === 'vendida' ? 'VENDIDA' :
                  property.estado === 'financiacion' ? 'NUEVA FINANCIACIÓN' :
                    'ALQUILADA'}
              </div>
            )}

            {/* Contador de imágenes */}
            {property.images && property.images.length > 0 && (
              <div style={styles.imageCounter}>
                📷 {activeImage + 1} de {property.images.length}
              </div>
            )}
          </div>

          {/* Miniaturas solo si hay imágenes */}
          {property.images && property.images.length > 0 && (
            <div style={styles.thumbnailRow}>
              {property.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url || img}
                  alt={`Miniatura ${index + 1}`}
                  style={{
                    ...styles.thumbnail,
                    border: index === activeImage ? "3px solid #184a8e" : "2px solid #ddd",
                    opacity: index === activeImage ? 1 : 0.7,
                  }}
                  className="bd-thumbnail"
                  onClick={() => setActiveImage(index)}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100x70?text=Error";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Panel derecho - Información y contacto */}
        <div style={styles.rightPanel} className="right-panel">
          {/* Información de la propiedad */}
          <div style={styles.details}>
            <h3 style={styles.sectionTitle}>
              <span>📋 Información de la Propiedad</span>
              {property.idPropiedad != null && (
                <div className="property-id-badge-container">
                  <span className="property-id-badge">
                    {formatearIdPropiedad(property.idPropiedad)}
                  </span>
                  <span className="property-id-tooltip">
                    ID de la propiedad
                  </span>
                </div>
              )}
            </h3>
            <p><strong>📍 Ubicación:</strong> {property.localidad}</p>
            <p><strong>📐 Metros:</strong> {property.metros}</p>
            <p><strong>🏠 Tipo:</strong> {property.categoria}</p>
            <p><strong>💰 Operación:</strong> {property.operacion}</p>
            <p><strong>💵 Precio:</strong> {property.precio || 'Consultar'}</p>
            <p><strong>📊 Estado:</strong> {property.estado || 'Disponible'}</p>
            <p><strong>📝 Observaciones:</strong> {property.observacion || "Sin observaciones"}</p>
          </div>

          {/* Ubicación en el Mapa */}
          {property.mapsLink && (
            <div style={styles.mapSection}>
              <h3 style={styles.sectionTitle}>🗺️ Ubicación en el Mapa</h3>
              <div style={styles.mapContainer}>
                {property.mapsLink.includes('<iframe') ? (
                  <div dangerouslySetInnerHTML={{ __html: property.mapsLink }} className="map-embed" />
                ) : property.mapsLink.includes('/embed') ? (
                  <iframe
                    src={property.mapsLink}
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Mapa"
                  ></iframe>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <p style={{ marginBottom: "15px", color: "#666" }}>El enlace proporcionado abrirá Google Maps en una nueva pestaña.</p>
                    <a href={property.mapsLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "10px 20px", backgroundColor: "#0b1f44", color: "white", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>
                      🗺️ Abrir en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Panel de contacto */}
          <div style={styles.contactSection}>
            <h3 style={styles.contacttitle}>📞 Vías de contacto</h3>
            <p><strong>📱 Teléfono:</strong> 2227-535057</p>
            <p><strong>📧 Email:</strong> parisnegociosinmobiliarios@gmail.com</p>
            <p><strong>🏢 Oficina:</strong> Calle 28 Nº917, Navarro, Buenos Aires</p>
            <a
              href="https://wa.me/2227-535057"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.contactButton}
              className="contact-button"
            >
              Contactar por WhatsApp
            </a>
          </div>

          {/* Botón de editar (solo para admin) */}
          {isAdmin && (
            <button
              style={styles.editButton}
              className="edit-button"
              onClick={() => navigate(`/editar-propiedad/${property.id}`)}
            >
              ✏️ Editar propiedad
            </button>
          )}

          {/* Botones de cambio de estado (solo para admin) */}
          {isAdmin && (
            <div style={styles.statusButtonsContainer}>
              <h4 style={styles.statusTitle}>Cambiar Estado:</h4>
              <div style={styles.statusButtons}>
                <button
                  style={{
                    ...styles.statusButton,
                    backgroundColor: '#0b1f44',
                    color: '#fff'
                  }}
                  onClick={() => handleStatusChange(property.estado === 'vendida' ? 'disponible' : 'vendida')}
                  title={property.estado === 'vendida' ? 'Marcar como disponible' : 'Marcar como vendida'}
                >
                  {property.estado === 'vendida' ? 'Marcar como Disponible' : 'Marcar como Vendida'}
                </button>
                <button
                  style={{
                    ...styles.statusButton,
                    backgroundColor: '#0b1f44',
                    color: '#fff'
                  }}
                  onClick={() => handleStatusChange(property.estado === 'alquilada' ? 'disponible' : 'alquilada')}
                  title={property.estado === 'alquilada' ? 'Marcar como disponible' : 'Marcar como alquilada'}
                >
                  {property.estado === 'alquilada' ? 'Marcar como Disponible' : 'Marcar como Alquilada'}
                </button>
                <button
                  style={{
                    ...styles.statusButton,
                    backgroundColor: '#0b1f44',
                    color: '#fff'
                  }}
                  onClick={() => handleStatusChange(property.estado === 'financiacion' ? 'disponible' : 'financiacion')}
                  title={property.estado === 'financiacion' ? 'Marcar como disponible' : 'Marcar como Nueva Financiación'}
                >
                  {property.estado === 'financiacion' ? 'Marcar como Disponible' : 'Nueva Financiación'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagen en tamaño completo */}
      {showImageModal && property.images && property.images.length > 0 && (
        <div style={styles.imageModalOverlay} onClick={handleCloseModal}>
          <div style={styles.imageModal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeModalButton} className="close-modal-button" onClick={handleCloseModal}>
              ✕
            </button>
            <div style={styles.modalImageContainer}>
              <img
                src={property.images[activeImage]?.url || property.images[activeImage]}
                alt={`Imagen ${activeImage + 1}`}
                style={styles.modalImage}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600?text=Error+al+cargar";
                }}
              />
              {/* Controles de navegación */}
              {property.images.length > 1 && (
                <>
                  <button style={styles.modalPrevButton} className="modal-nav-button modal-prev-btn" onClick={handlePrevImage}>
                    ‹
                  </button>
                  <button style={styles.modalNextButton} className="modal-nav-button modal-next-btn" onClick={handleNextImage}>
                    ›
                  </button>
                </>
              )}
              {/* Contador en el modal */}
              <div style={styles.modalImageCounter}>
                {activeImage + 1} de {property.images.length}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  editButton: {
    width: "100%",
    padding: "15px 24px",
    backgroundColor: "#0b1f44",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(11, 31, 68, 0.3)",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },

  container: {
    padding: "40px 20px",
    maxWidth: "2000px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "30px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
  },

  // Agregá este nuevo estilo para la línea decorativa opcional debajo del título (usado con un <div>)
  titleUnderline: {
    width: "80px",
    height: "4px",
    backgroundColor: "#184a8e",
    margin: "0 auto 40px auto",
    borderRadius: "2px",
  },

  backButton: {
    display: "block",
    margin: "0 auto 30px auto",
    padding: "10px 20px",
    backgroundColor: "#0b1f44",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  content: {
    display: "flex",
    gap: "40px",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  carouselSection: {
    flex: "1 1 55%",
    display: "flex",
    flexDirection: "column",
  },
  rightPanel: {
    flex: "1 1 40%",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  imageContainer: {
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
    position: "relative",
    height: "100%",
    display: "flex",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  thumbnailRow: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
  },
  thumbnail: {
    width: "100px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  imageCounter: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backdropFilter: "blur(5px)",
  },
  statusIndicator: {
    position: "absolute",
    top: "15px",
    left: "0",
    backgroundColor: "#0b1f44",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: "0 20px 20px 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
    zIndex: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    width: "auto",
    textAlign: "left",
  },
  contactSection: {
    flex: "1 1 30%",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  contacttitle: {
    marginBottom: "15px",
    color: "#2c3e50",
    fontSize: "20px",
  },
  contactButton: {
    marginTop: "15px",
    display: "inline-block",
    padding: "10px 15px",
    backgroundColor: "#0b1f44",
    color: "white",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  details: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #e9ecef",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "2px solid #184a8e",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  mapSection: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #e9ecef",
  },
  mapContainer: {
    width: "100%",
    borderRadius: "8px",
    overflow: "hidden"
  },
  center: {
    textAlign: "center",
    padding: "50px",
  },
  // Estilos para componente de carga
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  loadingContent: {
    textAlign: "center",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e9ecef",
  },
  spinnerContainer: {
    marginBottom: "30px",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #184a8e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  loadingTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loadingSubtitle: {
    fontSize: "16px",
    color: "#6c757d",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  loadingDots: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#184a8e",
    borderRadius: "50%",
    animation: "bounce 1.4s ease-in-out infinite both",
  },
  // Estilos para componente de error
  notFoundContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  notFoundContent: {
    textAlign: "center",
    maxWidth: "500px",
    padding: "50px 40px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e9ecef",
  },
  notFoundIcon: {
    fontSize: "80px",
    marginBottom: "20px",
    animation: "pulse 2s ease-in-out infinite",
  },
  notFoundTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#dc3545",
    marginBottom: "15px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  notFoundSubtitle: {
    fontSize: "16px",
    color: "#6c757d",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  backToBlogButton: {
    padding: "12px 30px",
    backgroundColor: "#0b1f44",
    color: "white",
    border: "none",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(11, 31, 68, 0.3)",
  },
  statusButtonsContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
  },
  statusTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "15px",
    textAlign: "center",
  },
  statusButtons: {
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  },
  statusButton: {
    padding: "12px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
  },
  // Estilos del modal de imagen
  imageModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: "20px",
  },
  imageModal: {
    position: "relative",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: "-50px",
    right: "0",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: 2001,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  modalImageContainer: {
    position: "relative",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "90vh",
    objectFit: "contain",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  },
  modalPrevButton: {
    position: "absolute",
    left: "-60px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  modalNextButton: {
    position: "absolute",
    right: "-60px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  modalImageCounter: {
    position: "absolute",
    bottom: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  hoverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "600",
    textAlign: "center",
    padding: "20px",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "opacity 0.3s ease",
    opacity: 0,
  },
  overlayText: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "10px 20px",
    borderRadius: "8px",
  },
  imageOverlayContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    overflow: "hidden",
  },


  // Media queries para responsive design
  '@media (max-width: 768px)': {
    content: {
      flexDirection: "column",
      gap: "30px",
    },
    carouselSection: {
      order: 1,
    },
    rightPanel: {
      order: 2,
    },
  },
};

// Componente de carga profesional
const LoadingComponent = () => {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingContent}>
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
        </div>
        <h2 style={styles.loadingTitle}>Cargando Propiedad</h2>
        <p style={styles.loadingSubtitle}>Obteniendo los detalles de la propiedad...</p>
        <div style={styles.loadingDots}>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
        </div>
      </div>
    </div>
  );
};

// Componente para propiedad no encontrada
const NotFoundComponent = () => {
  return (
    <div style={styles.notFoundContainer}>
      <div style={styles.notFoundContent}>
        <div style={styles.notFoundIcon}>🏠</div>
        <h2 style={styles.notFoundTitle}>Propiedad no encontrada</h2>
        <p style={styles.notFoundSubtitle}>
          La propiedad que buscas no existe o ha sido eliminada.
        </p>
        <button
          style={styles.backToBlogButton}
          className="back-to-blog-button"
          onClick={() => window.history.back()}
        >
          ← Volver al Blog
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
