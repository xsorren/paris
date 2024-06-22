import React, { useState } from 'react';

const CreateProperty = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const jsonFormData = JSON.stringify(formData, null, 2);
        console.log(jsonFormData); // This would be where you handle the local storage save
        saveJsonToFile(jsonFormData);
    };

    const saveJsonToFile = (data) => {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'property-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="contact">
            <div className="page-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="page-title">Agregar una propiedad</h1>
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
                                        <label>Titulo</label>
                                        <input type="text" name="title" className="inp-contact" value={formData.title} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-lg-6">
                                        <label>Tipo de propiedad</label>
                                        <select name="type" className="inp-contact" value={formData.type} onChange={handleInputChange}>
                                            <option value="">Seleccionar tipo de propiedad</option>
                                            <option value="house">Casas</option>
                                            <option value="apartment">Departamentos</option>
                                            <option value="lot">Lotes</option>
                                            <option value="commercial">Local</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-12">
                                        <label>Descripcion de la propiedad</label>
                                        <textarea name="description" className="ta-contact" rows="4" value={formData.description} onChange={handleInputChange}></textarea>
                                    </div>
                                    <div className="col-lg-12">
                                        <label>Agregar imagen de propiedad (multiple)</label>
                                        <input type="file" multiple className="inp-contact" onChange={handleImageChange} />
                                    </div>
                                    <div className="col-lg-12">
                                        <button type="submit" className="btn-contact">Guardar Propiedad</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CreateProperty;