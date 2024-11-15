import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogItem from "./BlogItem";

const Blog = () => {
    const [selectedFilter, setSelectedFilter] = useState('');
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://backend-paris.onrender.com/properties');
            setPropiedades(response.data.properties);
            setLoading(false);
        } catch (err) {
            setError('Error al obtener propiedades');
            setLoading(false);
        }
    };

    const handleFilterChange = async (filter) => {
        setSelectedFilter(filter);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://backend-paris.onrender.com/properties?filter=${filter}`);
            setPropiedades(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al filtrar propiedades');
            setLoading(false);
        }
    };

    // Estilos en línea para los botones de filtro
    const filterButtonStyle = {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: '#012161',
        color: '#ffffff',
        cursor: 'pointer',
        margin: '0 5px',
        transition: 'all 0.3s ease',
    };

    const activeFilterButtonStyle = {
        ...filterButtonStyle,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    };

    return (
        <section className="blog">
            <div className="page-top">
                <div className="container">
                    <div className="col-lg-12">
                        <h1 className="page-title">Nuestras Propiedades</h1>
                    </div>
                </div>
            </div>
            <div className="page-content">
                <div className="container">
                    <div className="filters">
                        <button style={selectedFilter === 'house' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('house')}>Casas</button>
                        <button style={selectedFilter === 'apartment' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('apartment')}>Departamentos</button>
                        <button style={selectedFilter === 'lot' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('lot')}>Lotes</button>
                        <button style={selectedFilter === 'commercial' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('commercial')}>Locales</button>
                    </div>
                    {loading ? (
                        <p>Cargando propiedades...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div className="row">
                            {propiedades && propiedades.map(property => (
                                <BlogItem key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Blog;
