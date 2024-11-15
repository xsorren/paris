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
                'https://backend-paris.onrender.com/properties',
                formData,
                {
                    headers: {
                        'Authorization': token
                    }
                }
            );
            alert('¡Propiedad creada exitosamente!');
            console.log(response.data);
        } catch (error) {
            console.error('Error al crear la propiedad:', error);
            alert('Error al crear la propiedad');
        }
    };

    return (
        <section className="contact">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Campos del formulario */}
                                {/* ... (el resto de tu formulario) */}
                                <div className="col-lg-12">
                                    <button type="submit" className="btn-contact">Guardar Propiedad</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateProperty;
