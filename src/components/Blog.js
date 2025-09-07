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

  return (
    <div className="container-narrow">
      <h1 className="title-xl">Propiedades disponibles</h1>
      <div className="title-underline" />

      <div className="filters">
        {["todas", "casa", "departamento", "lote","locales"].map((tipo) => (
          <button
            key={tipo}
            className={`btn ${filtroActivo === tipo ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => filtrarPorTipo(tipo)}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
        <button
          className={`btn ${filtroActivo === 'venta' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => filtrarPorOperacion("venta")}
        >En Venta</button>
        <button
          className={`btn ${filtroActivo === 'alquiler' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => filtrarPorOperacion("alquiler")}
        >En Alquiler</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando propiedades...</p>
      ) : (
        <div className="grid grid-auto-cards">
          {filtered.map((property) => (
            <div key={property.id} className="card">
              <img
                className="card-image"
                src={property.images?.[0] || "https://via.placeholder.com/800x450?text=Sin+imagen"}
                alt={property.titulo}
                loading="lazy"
              />
              <div className="card-body">
                <h3 className="card-title">
                  <Link to={`/blog/${property.id}`} className="link">
                    {property.titulo}
                  </Link>
                </h3>
                <div className="card-sub">{property.localidad}</div>
                <div className="badges">
                  {property.categoria && (
                    <span className="badge badge-blue">{property.categoria}</span>
                  )}
                  {property.operacion && (
                    <span className="badge badge-green">{property.operacion}</span>
                  )}
                </div>
                <Link to={`/blog/${property.id}`} className="btn btn-secondary">Ver detalles</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
