import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const Blog = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "propiedades"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPropiedades(data);
      } catch (err) {
        console.error("Error al obtener propiedades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏡 Propiedades Disponibles</h1>
      {loading ? (
        <p style={styles.loading}>Cargando propiedades...</p>
      ) : (
        <div style={styles.grid}>
          {propiedades.map((property) => (
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
    marginBottom: "40px",
    fontSize: "32px",
    color: "#333",
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
