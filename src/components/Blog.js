import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const Blog = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState("todas");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "propiedades"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPropiedades(data);
        setFiltered(data); // inicial
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
      (prop) => prop.category?.toLowerCase() === tipo.toLowerCase()
    );
    setFiltered(filtradas);
  }
};


  return (
    <div style={styles.container}>
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
      </div>

      {loading ? (
        <p style={styles.loading}>Cargando propiedades...</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((property) => (
            <div key={property.id} style={styles.card}>
              <img
                src={property.images?.[0] || "https://via.placeholder.com/400x300"}
                alt={property.title}
                style={styles.image}
              />
              <div style={styles.content}>
                <h3 style={styles.propertyTitle}>
                  <Link to={`/blog/${property.id}`} style={styles.link}>
                    {property.title}
                  </Link>
                </h3>
                <p><strong>📍 Ubicación:</strong> {property.location}</p>
                <p><strong>📐 Metros:</strong> {property.price}</p>
                <p style={styles.description}>
                  {property.observacion
                    ? property.observacion.substring(0, 100) + "..."
                    : "Sin observaciones"}
                </p>
                <Link to={`/blog/${property.id}`} style={styles.button}>
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "1200px",
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
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },
  content: {
    padding: "20px",
  },
  propertyTitle: {
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
    backgroundColor: "#0066cc",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default Blog;
