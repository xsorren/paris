import React, { useState, useEffect } from 'react';
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('https://backend-paris.onrender.com/api/checkSession');
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Authentication verification failed', error);
            setIsLoggedIn(false);
        }
    };

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
            const response = await axios.post('https://backend-paris.onrender.com/properties', formData);
            alert('Property created successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Failed to create property:', error);
            alert('Failed to create property');
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <h2>Acceso Inautorizado</h2>
            </div>
        );
    }

    return (
        <section className="contact">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <form onSubmit={handleSubmit}>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <label>Title</label>
                                        <input type="text" name="title" className="inp-contact" value={formData.title} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Type</label>
                                        <select name="type" className="inp-contact" value={formData.type} onChange={handleInputChange}>
                                            <option value="">Select Type</option>
                                            <option value="house">House</option>
                                            <option value="apartment">Apartment</option>
                                            <option value="lot">Lot</option>
                                            <option value="commercial">Commercial Space</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-12">
                                        <label>Description</label>
                                        <textarea name="description" className="ta-contact" rows="4" value={formData.description} onChange={handleInputChange}></textarea>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Location</label>
                                        <input type="text" name="location" className="inp-contact" value={formData.location} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Area (m²)</label>
                                        <input type="number" name="area" className="inp-contact" value={formData.area} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-4">
                                        <label>Rooms</label>
                                        <input type="number" name="rooms" className="inp-contact" value={formData.rooms} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-4">
                                        <label>Bathrooms</label>
                                        <input type="number" name="bathrooms" className="inp-contact" value={formData.bathrooms} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-4">
                                        <label>Garages</label>
                                        <input type="number" name="garages" className="inp-contact" value={formData.garages} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Date</label>
                                        <input type="date" name="date" className="inp-contact" value={formData.date} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-12">
                                        <label>Images (multiple)</label>
                                        <input type="file" multiple className="inp-contact" onChange={handleImageChange} />
                                    </div>
                                    <div className="col-lg-12">
                                        <button type="submit" className="btn-contact">Save Property</button>
                                    </div>
                                </div>
                            </form>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateProperty;
