// CreateProperty.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateProperty = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        location: '',
        area: '',
        rooms: '',
        bathrooms: '',
        garages: '',
        date: '',
        images: []
    });

    const handleInputChange = (e) => {
        console.log(`Campo cambiado: ${e.target.name}, Valor: ${e.target.value}`);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const imagesBase64 = await Promise.all(files.map(file => convertToBase64(file)));

        setFormData({
            ...formData,
            images: [...formData.images, ...imagesBase64]
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/properties',
                formData,
                {
                    headers: {
                        'Authorization': token
                    }
                }
            );
            alert('¡Propiedad creada exitosamente!');
            console.log(response.data);
            // Limpiar el formulario después de crear la propiedad
            setFormData({
                title: '',
                description: '',
                type: '',
                location: '',
                area: '',
                rooms: '',
                bathrooms: '',
                garages: '',
                date: '',
                images: []
            });
        } catch (error) {
            console.error('Error al crear la propiedad:', error);
            alert('Error al crear la propiedad');
        }
    };

    return (
        <section className="contact">
            <div className="page-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="page-title">Crear Propiedad</h1>
                            <h2 className="page-description">Ingresa los detalles de la propiedad a continuación</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <label>Título</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="inp-contact"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Tipo</label>
                                        <select
                                            name="type"
                                            className="inp-contact"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Selecciona el Tipo</option>
                                            <option value="house">Casa</option>
                                            <option value="apartment">Apartamento</option>
                                            <option value="lot">Lote</option>
                                            <option value="commercial">Local Comercial</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-12">
                                        <label>Descripción</label>
                                        <textarea
                                            name="description"
                                            className="ta-contact"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Ubicación</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="inp-contact"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Área (m²)</label>
                                        <input
                                            type="number"
                                            name="area"
                                            className="inp-contact"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <label>Habitaciones</label>
                                        <input
                                            type="number"
                                            name="rooms"
                                            className="inp-contact"
                                            value={formData.rooms}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <label>Baños</label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            className="inp-contact"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <label>Garajes</label>
                                        <input
                                            type="number"
                                            name="garages"
                                            className="inp-contact"
                                            value={formData.garages}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Fecha</label>
                                        <input
                                            type="date"
                                            name="date"
                                            className="inp-contact"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-12">
                                        <label>Imágenes (múltiples)</label>
                                        <input
                                            type="file"
                                            name="images"
                                            multiple
                                            className="inp-contact"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <div className="col-lg-12">
                                        <button type="submit" className="btn-contact">
                                            Guardar Propiedad
                                        </button>
                                    </div>
                                </div>
                            </form>
                            {/* Previsualización de imágenes */}
                            {formData.images.length > 0 && (
                                <div className="row">
                                    <div className="col-lg-12">
                                        <h3>Imágenes Seleccionadas:</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {formData.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Imagen ${index + 1}`}
                                                    style={{ width: '150px', height: '150px', objectFit: 'cover', margin: '5px' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateProperty;
