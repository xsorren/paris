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
    <div className="container-narrow">
      <button className="btn btn-outline" onClick={() => navigate('/blog')}>← Volver</button>
      <h1 className="title-xl" style={{marginTop: 10}}>{property.titulo}</h1>
      <div className="title-underline" />

      <div style={{display:'flex',flexWrap:'wrap',gap:24,alignItems:'flex-start'}}>
        <div style={{flex:'1 1 65%'}}>
          <div className="card" style={{overflow:'hidden'}}>
            <img
              src={property.images?.[activeImage] || 'https://via.placeholder.com/1200x600?text=Sin+imagen'}
              alt="Propiedad"
              className="card-image"
              style={{height: '420px'}}
            />
          </div>
          <div className="thumb-grid" style={{marginTop:12}}>
            {(property.images || []).map((img, i) => (
              <button key={i} className="thumb" onClick={() => setActiveImage(i)} style={{border: i===activeImage ? '2px solid var(--primary)' : undefined}}>
                <img src={img} alt={`Miniatura ${i+1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="card sticky-panel" style={{flex:'1 1 30%'}}>
          <div className="card-body">
            <h3 className="card-title">Vías de contacto</h3>
            <div className="card-sub" style={{marginBottom:16}}>
              Respondemos rápido por WhatsApp o email.
            </div>
            <p><strong>Teléfono:</strong> 2227-535057</p>
            <p><strong>Email:</strong> parisnegociosinmobiliarios@gmail.com</p>
            <p><strong>Oficina:</strong> Calle 28 Nº917, Navarro, Buenos Aires</p>
            <a href="https://wa.me/2227-535057" target="_blank" rel="noopener noreferrer" className="btn btn-success" style={{marginTop:6}}>WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:24}}>
        <div className="card-body">
          <div className="badges" style={{marginBottom:12}}>
            {property.categoria && <span className="badge badge-blue">{property.categoria}</span>}
            {property.operacion && <span className="badge badge-green">{property.operacion}</span>}
          </div>
          <p><strong>Ubicación:</strong> {property.localidad}</p>
          <p><strong>Metros:</strong> {property.metros}</p>
          <p><strong>Observaciones:</strong> {property.observacion || 'Sin observaciones'}</p>
          {(localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true') && (
            <button className="btn btn-primary" onClick={() => navigate(`/editar-propiedad/${property.id}`)} style={{marginTop:12}}>Editar propiedad</button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  // remaining style object trimmed; replaced by CSS classes
};

export default BlogDetail;
