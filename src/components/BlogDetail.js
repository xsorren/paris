import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import usePageTitle from "../hooks/usePageTitle";
import { updatePropertyStatus } from "../firebase/propertyService";
import { isUserAuthorized } from "../firebase/authService";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handlePrevImage = () => {
    if (property.images && property.images.length > 0) {
      setActiveImage((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property.images && property.images.length > 0) {
      setActiveImage((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

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
  }, [showImageModal]);

  if (loading) return <LoadingComponent />;
  if (!property) return <NotFoundComponent />;

  return (
    <div style={styles.container}>
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
            background-color: #1ea851 !important;
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
          @media (max-width: 768px) {
            .content {
              flex-direction: column !important;
              gap: 30px !important;
            }
            .carousel-section {
              order: 1 !important;
            }
            .right-panel {
              order: 2 !important;
            }
          }
        `}
      </style>
      <h1 style={styles.title}>{property.title}</h1>

      <button style={styles.backButton} onClick={() => navigate("/blog")}>
        ← Volver al Blog
      </button>
      {/* Título centrado arriba */}
      <h1 style={styles.title}>{property.titulo}</h1>
      <div style={styles.titleUnderline}></div>

      <div style={styles.content} className="content">
        {/* Panel izquierdo - Carrusel de imágenes */}
        <div style={styles.carouselSection} className="carousel-section">
          <div style={styles.imageContainer}>
            <img
              src={
                property.images?.[activeImage]?.url ||
                property.images?.[activeImage] ||
                "https://via.placeholder.com/800x400?text=Sin+imagen"
              }
              alt="Propiedad"
              style={styles.mainImage}
              className="main-image"
              onClick={handleImageClick}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x400?text=Error+al+cargar";
              }}
            />
            {/* Indicador de estado */}
            {property.estado && property.estado !== 'disponible' && (
              <div style={{
                ...styles.statusIndicator,
                backgroundColor: property.estado === 'vendida' ? '#dc3545' : '#ffc107',
                color: property.estado === 'vendida' ? '#fff' : '#000'
              }}>
                {property.estado === 'vendida' ? 'VENDIDA' : 'ALQUILADA'}
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
            <h3 style={styles.sectionTitle}>📋 Información de la Propiedad</h3>
            <p><strong>📍 Ubicación:</strong> {property.localidad}</p>
            <p><strong>📐 Metros:</strong> {property.metros}</p>
            <p><strong>🏠 Tipo:</strong> {property.categoria}</p>
            <p><strong>💰 Operación:</strong> {property.operacion}</p>
            <p><strong>📊 Estado:</strong> {property.estado || 'Disponible'}</p>
            <p><strong>📝 Observaciones:</strong> {property.observacion || "Sin observaciones"}</p>
          </div>

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
                    backgroundColor: property.estado === 'vendida' ? '#28a745' : '#dc3545'
                  }}
                  onClick={() => handleStatusChange(property.estado === 'vendida' ? 'disponible' : 'vendida')}
                  title={property.estado === 'vendida' ? 'Marcar como disponible' : 'Marcar como vendida'}
                >
                  {property.estado === 'vendida' ? 'Marcar como Disponible' : 'Marcar como Vendida'}
                </button>
                <button
                  style={{
                    ...styles.statusButton,
                    backgroundColor: property.estado === 'alquilada' ? '#28a745' : '#ffc107',
                    color: property.estado === 'alquilada' ? '#fff' : '#000'
                  }}
                  onClick={() => handleStatusChange(property.estado === 'alquilada' ? 'disponible' : 'alquilada')}
                  title={property.estado === 'alquilada' ? 'Marcar como disponible' : 'Marcar como alquilada'}
                >
                  {property.estado === 'alquilada' ? 'Marcar como Disponible' : 'Marcar como Alquilada'}
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
                  <button style={styles.modalPrevButton} className="modal-nav-button" onClick={handlePrevImage}>
                    ‹
                  </button>
                  <button style={styles.modalNextButton} className="modal-nav-button" onClick={handleNextImage}>
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
    backgroundColor: "#184a8e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(24, 74, 142, 0.3)",
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
    backgroundColor: "#012161",
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
    top: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    padding: "10px 0",
    fontSize: "50px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    zIndex: 2,
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
    backgroundColor: "#25D366",
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
    backgroundColor: "#184a8e",
    color: "white",
    border: "none",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(24, 74, 142, 0.3)",
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
