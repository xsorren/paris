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
      const filtradas = propiedades.filter((prop) => {
        if (!prop.categoria) return false;
        const c = prop.categoria.toLowerCase().trim();
        const t = tipo.toLowerCase().trim();
        return c === t || c + "s" === t || t + "s" === c || c + "es" === t || t + "es" === c;
      });
      setFiltered(filtradas);
    }
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

          .premium-card {
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            overflow: hidden;
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            text-decoration: none;
            color: inherit;
          }
          .premium-card:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          }
          .premium-image-wrapper {
            position: relative;
            width: 100%;
            height: 250px;
            overflow: hidden;
          }
          .premium-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          .premium-card:hover .premium-image {
            transform: scale(1.05);
          }
          .premium-badge {
            position: absolute;
            top: 15px;
            left: 0;
            background-color: #0b1f44;
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding: 6px 16px;
            border-radius: 0 20px 20px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 2;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          .agent-badge {
            position: absolute;
            bottom: 15px;
            right: 15px;
            background-color: rgba(0,0,0,0.6);
            color: white;
            font-size: 13px;
            padding: 5px 12px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 2;
          }
          .premium-content {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .premium-type {
            color: #0b1f44;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .premium-title {
            font-size: 20px;
            font-weight: bold;
            color: #1a1a1a;
            margin: 0 0 8px 0;
            line-height: 1.3;
          }
          .premium-location {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .premium-price-container {
            display: flex;
            height: 50px;
            width: 100%;
            margin-top: auto;
          }
          .premium-operation {
            background-color: #0b1f44;
            color: white;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45%;
            position: relative;
            text-transform: uppercase;
            z-index: 2;
          }
          .premium-operation::after {
            content: "";
            position: absolute;
            top: 0;
            right: -20px;
            border-bottom: 50px solid #0b1f44;
            border-right: 20px solid transparent;
            width: 0;
            height: 0;
            z-index: 10;
          }
          .premium-price {
            background-color: #0F2537;
            color: white;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 20px;
            font-size: 20px;
            font-weight: bold;
            padding-left: 30px; 
          }
          .delete-button-premium {
            position: absolute;
            top: 15px;
            right: 15px;
            background-color: rgba(220, 53, 69, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            font-size: 16px;
            cursor: pointer;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s;
          }
          .premium-card:hover .delete-button-premium {
            opacity: 1;
          }
          .admin-btn {
            flex: 1;
            padding: 8px 5px;
            background-color: #0b1f44;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
          }
          .admin-btn:hover {
            opacity: 0.85;
            box-shadow: 0 4px 8px rgba(11, 31, 68, 0.2);
          }
        `}
      </style>
      <h1 style={styles.title}>
        <span style={styles.highlight}>Propiedades</span> disponibles
      </h1>
      <div style={styles.separator}></div>

      <div style={styles.filterButtons}>
        {["todas", "casas", "departamentos", "lotes", "locales", "campos"].map((tipo) => (
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
      </div>

      {loading ? (
        <LoadingPropertiesComponent />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 20px", color: "#666", fontSize: "20px", fontWeight: "bold" }}>
          No hay propiedad para filtrar en esta categoria
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((property) => {
            const getBadgeText = () => {
              if (property.destacada) return "DESTACADO";
              if (property.estado === "vendida") return "VENDIDA";
              if (property.estado === "alquilada") return "ALQUILADA";
              if (property.estado === "financiacion") return "FINANCIACIÓN";
              if (property.estado === "nueva") return "NUEVA";
              return null;
            };
            const badgeText = getBadgeText();

            return (
              <div key={property.id} className="premium-card">
                <Link to={`/blog/${property.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="premium-image-wrapper">
                    <img
                      src={
                        property.images?.[0]?.url ||
                        property.images?.[0] ||
                        property.imagenPrincipal ||
                        "https://via.placeholder.com/400x300?text=Sin+imagen"
                      }
                      alt={property.titulo}
                      className="premium-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Error+al+cargar";
                      }}
                    />

                    {badgeText && (
                      <div className="premium-badge">
                        {badgeText}
                      </div>
                    )}

                    {property.agente && (
                      <div className="agent-badge">
                        <span>👤</span> {property.agente}
                      </div>
                    )}
                  </div>

                  <div className="premium-content">
                    <div className="premium-type">
                      {property.categoria || "PROPIEDAD"}
                    </div>
                    <h3 className="premium-title">{property.titulo}</h3>
                    <div className="premium-location">
                      {property.localidad || "Consultar ubicación"}
                    </div>
                  </div>

                  <div className="premium-price-container">
                    <div className="premium-operation">
                      {property.operacion === "alquiler" ? "EN ALQUILER" : "EN VENTA"}
                    </div>
                    <div className="premium-price">
                      {property.precio ? `${property.moneda || ''} ${property.precio}`.trim() : "Consultar"}
                    </div>
                  </div>
                </Link>

                {isAdmin && (
                  <button
                    className="delete-button-premium"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteClick(property);
                    }}
                    title="Eliminar propiedad"
                  >
                    🗑️
                  </button>
                )}
                {isAdmin && (
                  <div style={{ padding: "0 10px 10px", marginTop: "15px", display: "flex", gap: "5px", flexWrap: "wrap", zIndex: 3, position: 'relative' }}>
                    <button
                      className="admin-btn"
                      onClick={(e) => { e.preventDefault(); handleStatusChange(property.id, property.estado === 'vendida' ? 'disponible' : 'vendida'); }}
                    >
                      {property.estado === 'vendida' ? 'Disponible' : 'Vendida'}
                    </button>
                    <button
                      className="admin-btn"
                      onClick={(e) => { e.preventDefault(); handleStatusChange(property.id, property.estado === 'alquilada' ? 'disponible' : 'alquilada'); }}
                    >
                      {property.estado === 'alquilada' ? 'Disponible' : 'Alquilada'}
                    </button>
                    <button
                      className="admin-btn"
                      onClick={(e) => { e.preventDefault(); handleStatusChange(property.id, property.estado === 'financiacion' ? 'disponible' : 'financiacion'); }}
                    >
                      {property.estado === 'financiacion' ? 'Disponible' : 'Financ.'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
    minHeight: "calc(100vh - 250px)",
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
    objectFit: "contain",
    backgroundColor: "#f0f0f0",
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
        <p style={styles.loadingSubtitle}>Buscando propiedades para ti...</p>
        <div style={styles.loadingDots}>
          <span style={styles.dot}></span>
        </div>
      </div>
    </div>
  );
};

export default Blog;
