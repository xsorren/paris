import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <p style={styles.center}>Cargando...</p>;
  if (!property) return <p style={styles.center}>Propiedad no encontrada.</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{property.title}</h1>

      <button style={styles.backButton} onClick={() => navigate("/blog")}>
        ← Volver al Blog
      </button>
      {/* Título centrado arriba */}
      <h1 style={styles.title}>{property.titulo}</h1>
      <div style={styles.titleUnderline}></div>

      <div style={styles.content}>
        {/* Carrusel de imágenes */}
        <div style={styles.carouselSection}>
          <div style={styles.imageContainer}>
            <img
              src={
                property.images?.[activeImage] ||
                "https://via.placeholder.com/800x400"
              }
              alt="Propiedad"
              style={styles.mainImage}
            />
          </div>

          <div style={styles.thumbnailRow}>
            {property.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Miniatura ${index + 1}`}
                style={{
                  ...styles.thumbnail,
                  border: index === activeImage ? "2px solid #007BFF" : "1px solid #ccc",
                }}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
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
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>

      {/* Información de la propiedad */}
      <div style={styles.details}>
        <p><strong>📍 Ubicación:</strong> {property.localidad}</p>
        <p><strong>📐 Metros:</strong> {property.metros}</p>
        <p><strong>📝 Observaciones:</strong> {property.observacion || "Sin observaciones"}</p>
      </div>
    </div>
  );
};

const styles = {
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
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "space-between",
  },
  carouselSection: {
    flex: "1 1 65%",
  },
  imageContainer: {
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  mainImage: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "10px",
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
    marginTop: "40px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    fontSize: "18px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  center: {
    textAlign: "center",
    padding: "50px",
  },
};

export default BlogDetail;
