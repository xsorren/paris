import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from "./Sidebar";

const BlogDetail = () => {
    const { state } = useLocation();
    const property = state.property;

    return (
        <div className="container mt-4 mb-4">
            <div className="row">
                <div className="col-lg-8 order-lg-1">
                    <div className="blog-detail">
                        <img className="w-100" src={property.images[0] || "/img/product1.jpeg"} alt={property.title} />
                        <span className="blog-detail-category">{property.type}</span>
                        <h1 className="blog-detail-title">{property.title} - {property.location}</h1>
                        <span className="blog-detail-date">Publicado el {property.date}</span>
                        <p className="blog-detail-content">
                            {property.description}
                        </p>
                        <div className="caracteristicas">
                            <h3>Características de la Propiedad</h3>
                            <ul>
                                <li><strong>Ubicación:</strong> {property.location}</li>
                                <li><strong>Metros cuadrados:</strong> {property.area} m²</li>
                                <li><strong>Habitaciones:</strong> {property.rooms}</li>
                                <li><strong>Baños:</strong> {property.bathrooms}</li>
                                <li><strong>Garajes:</strong> {property.garages}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 order-lg-2">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
