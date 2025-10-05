import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteProperty, updatePropertyStatus } from "../firebase/propertyService";
import { isUserAuthorized } from "../firebase/authService";
import usePageTitle from "../hooks/usePageTitle";

const Blog = () => {
  usePageTitle("Propiedades");

  const [propiedades, setPropiedades] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState("todas");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Verificar si el usuario es administrador
    setIsAdmin(isUserAuthorized());

    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "propiedades"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPropiedades(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error al obtener propiedades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filtrarPorTipo = (tipo) => {
    setFiltroActivo(tipo);
    if (tipo === "todas") {
      setFiltered(propiedades);
    } else {
      const filtradas = propiedades.filter(
        (prop) => prop.categoria?.toLowerCase() === tipo.toLowerCase()
      );
      setFiltered(filtradas);
    }
  };

  const filtrarPorOperacion = (tipoOperacion) => {
    setFiltroActivo(tipoOperacion);
    const filtradas = propiedades.filter(
      (prop) => prop.operacion?.toLowerCase() === tipoOperacion.toLowerCase()
    );
    setFiltered(filtradas);
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    setDeleting(true);
    try {
      const result = await deleteProperty(propertyToDelete.id);
      if (result.success) {
        // Actualizar las listas locales
        const updatedPropiedades = propiedades.filter(prop => prop.id !== propertyToDelete.id);
        setPropiedades(updatedPropiedades);
        setFiltered(updatedPropiedades);
        setShowDeleteModal(false);
        setPropertyToDelete(null);
      } else {
        console.error("Error al eliminar propiedad:", result.error);
        alert("Error al eliminar la propiedad. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      alert("Error al eliminar la propiedad. Intenta nuevamente.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      const result = await updatePropertyStatus(propertyId, newStatus);
      if (result.success) {
        // Actualizar las listas locales
        const updatedPropiedades = propiedades.map(prop =>
          prop.id === propertyId ? { ...prop, estado: newStatus } : prop
        );
        setPropiedades(updatedPropiedades);
        setFiltered(updatedPropiedades);
      } else {
        console.error("Error al actualizar estado:", result.error);
        alert("Error al actualizar el estado de la propiedad. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado de la propiedad. Intenta nuevamente.");
    }
  };

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
              opacity: 1;
            }
            50% {
              transform: scale(1.02);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
            }
          }
          
          .dot:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          .dot:nth-child(2) {
            animation-delay: -0.16s;
          }
          
          .property-card:hover .delete-button {
            opacity: 1 !important;
            transform: scale(1) !important;
          }
          .property-card:hover .property-image {
            transform: scale(1.05);
          }
          .delete-button:hover {
            background-color: rgba(220, 53, 69, 1) !important;
            transform: scale(1.1) !important;
          }
        `}
      </style>
      <h1 style={styles.title}>
        <span style={styles.highlight}>Propiedades</span> disponibles
      </h1>
      <div style={styles.separator}></div>

      <div style={styles.filterButtons}>
        {["todas", "casa", "departamento", "lote"].map((tipo) => (
          <button
            key={tipo}
            style={{
              ...styles.filterButton,
              backgroundColor: filtroActivo === tipo ? "#184a8e" : "#ddd",
              color: filtroActivo === tipo ? "#fff" : "#333",
            }}
            onClick={() => filtrarPorTipo(tipo)}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}

        <button
          style={{
            ...styles.filterButton,
            backgroundColor: filtroActivo === "venta" ? "#184a8e" : "#ddd",
            color: filtroActivo === "venta" ? "#fff" : "#333",
          }}
          onClick={() => filtrarPorOperacion("venta")}
        >
          En Venta
        </button>

        <button
          style={{
            ...styles.filterButton,
            backgroundColor: filtroActivo === "alquiler" ? "#184a8e" : "#ddd",
            color: filtroActivo === "alquiler" ? "#fff" : "#333",
          }}
          onClick={() => filtrarPorOperacion("alquiler")}
        >
          En Alquiler
        </button>
      </div>

      {loading ? (
        <LoadingPropertiesComponent />
      ) : (
        <div style={styles.grid}>
          {filtered.map((property) => (
            <div key={property.id} style={styles.card} className="property-card">
              <div style={styles.imageContainer}>
                <img
                  src={property.images?.[0]?.url || "https://via.placeholder.com/400x300?text=Sin+imagen"}
                  alt={property.titulo}
                  style={styles.image}
                  className="property-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Error+al+cargar";
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

                {/* Indicador de cantidad de imágenes */}
                {property.images && property.images.length > 0 && (
                  <div style={styles.imageCounter}>
                    📷 {property.images.length}
                  </div>
                )}

                {isAdmin && (
                  <button
                    style={styles.deleteButton}
                    className="delete-button"
                    onClick={() => handleDeleteClick(property)}
                    title="Eliminar propiedad"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <div style={styles.content}>
                <h3 style={styles.propertytitle}>
                  <Link to={`/blog/${property.id}`} style={styles.link}>
                    {property.titulo}
                  </Link>
                </h3>
                <p><strong>Título:</strong> {property.titulo}</p>
                <p><strong>Ubicación:</strong> {property.localidad}</p>
                <p><strong>Metros:</strong> {property.metros}</p>
                <p><strong>Estado:</strong> {property.estado || 'Disponible'}</p>
                <Link to={`/blog/${property.id}`} style={styles.button}>
                  Ver Detalles
                </Link>

                {/* Botones de cambio de estado para admin */}
                {isAdmin && (
                  <div style={styles.statusButtons}>
                    <button
                      style={{
                        ...styles.statusButton,
                        backgroundColor: property.estado === 'vendida' ? '#28a745' : '#dc3545'
                      }}
                      onClick={() => handleStatusChange(property.id, property.estado === 'vendida' ? 'disponible' : 'vendida')}
                      title={property.estado === 'vendida' ? 'Marcar como disponible' : 'Marcar como vendida'}
                    >
                      {property.estado === 'vendida' ? ' Marcar como Disponible' : ' Marcar como Vendida'}
                    </button>
                    <button
                      style={{
                        ...styles.statusButton,
                        backgroundColor: property.estado === 'alquilada' ? '#28a745' : '#ffc107',
                        color: property.estado === 'alquilada' ? '#fff' : '#000'
                      }}
                      onClick={() => handleStatusChange(property.id, property.estado === 'alquilada' ? 'disponible' : 'alquilada')}
                      title={property.estado === 'alquilada' ? 'Marcar como disponible' : 'Marcar como alquilada'}
                    >
                      {property.estado === 'alquilada' ? 'Marcar como Disponible' : 'Marcar como Alquilada'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && propertyToDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>¿Eliminar Propiedad?</h3>
            <div style={styles.modalContent}>
              <img
                src={propertyToDelete.images?.[0]?.url || "https://via.placeholder.com/200x150?text=Sin+imagen"}
                alt={propertyToDelete.titulo}
                style={styles.modalImage}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200x150?text=Error+al+cargar";
                }}
              />
              <div style={styles.modalDetails}>
                <h4 style={styles.modalPropertyTitle}>{propertyToDelete.titulo}</h4>
                <p><strong>Tipo:</strong> {propertyToDelete.categoria}</p>
                <p><strong>Operación:</strong> {propertyToDelete.operacion}</p>
                <p><strong>Ubicación:</strong> {propertyToDelete.localidad}</p>
                <p><strong>Metros:</strong> {propertyToDelete.metros} m²</p>
                {propertyToDelete.observacion && (
                  <p><strong>Observaciones:</strong> {propertyToDelete.observacion}</p>
                )}
                <p style={styles.warningText}>
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelButton}
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                style={styles.confirmDeleteButton}
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "2000px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "38px",
    fontWeight: "700",
    color: "#0b1f44",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: "1px",
  },
  highlight: {
    color: "#184a8e",
  },
  separator: {
    width: "80px",
    height: "4px",
    backgroundColor: "#184a8e",
    margin: "10px auto 30px",
    borderRadius: "2px",
  },
  filterButtons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
  },
  filterButton: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.2s",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  imageCounter: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  statusIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    padding: "10px 0",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    zIndex: 2,
  },
  deleteButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(220, 53, 69, 0.9)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "16px",
    cursor: "pointer",
    opacity: 0,
    transform: "scale(0.8)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  content: {
    padding: "20px",
  },
  propertytitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  link: {
    textDecoration: "none",
    color: "#2c3e50",
  },
  description: {
    marginTop: "10px",
    fontStyle: "italic",
    color: "#555",
  },
  button: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 16px",
    backgroundColor: "#012161",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  statusButtons: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  statusButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flex: "1",
    minWidth: "80px",
  },
  // Estilos del modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#dc3545",
    marginBottom: "20px",
    textAlign: "center",
  },
  modalContent: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
  },
  modalImage: {
    width: "150px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
  modalDetails: {
    flex: 1,
  },
  modalPropertyTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  modalButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  confirmDeleteButton: {
    padding: "12px 24px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  warningText: {
    color: "#dc3545",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "4px",
    border: "1px solid #f5c6cb",
  },
  // Estilos para componente de carga de propiedades
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
    backgroundColor: "#f9f9f9",
  },
  loadingContent: {
    textAlign: "center",
    maxWidth: "600px",
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
    marginBottom: "40px",
  },
  dot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#184a8e",
    borderRadius: "50%",
    animation: "bounce 1.4s ease-in-out infinite both",
  },
  loadingProperties: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  propertySkeleton: {
    height: "200px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200px 100%",
    borderRadius: "10px",
    animation: "shimmer 1.5s ease-in-out infinite",
    position: "relative",
    overflow: "hidden",
  },
};

// Componente de carga profesional para propiedades
const LoadingPropertiesComponent = () => {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingContent}>
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
        </div>
        <h2 style={styles.loadingTitle}>Cargando Propiedades</h2>
        <p style={styles.loadingSubtitle}>Buscando las mejores propiedades para ti...</p>
        <div style={styles.loadingDots}>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
        </div>
        <div style={styles.loadingProperties}>
          <div style={styles.propertySkeleton}></div>
          <div style={styles.propertySkeleton}></div>
          <div style={styles.propertySkeleton}></div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
