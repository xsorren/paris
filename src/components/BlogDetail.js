import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import Sidebar from "./Sidebar";
import styled from 'styled-components';
import Modal from 'react-modal';

// Estilos
const Container = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const CustomCarousel = styled(Carousel)`
    .carousel-inner {
        border-radius: 15px; /* Bordes redondeados */
        overflow: hidden; /* Evitar que se muestren elementos fuera del carrusel */
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* Sombra suave para profundidad */
    }

    .carousel-item {
        transition: opacity 1s ease-in-out; /* Transición suave de opacidad */
    }

    .carousel-control-prev-icon,
    .carousel-control-next-icon {
        background-color: #000; /* Iconos de control en color oscuro */
        border-radius: 50%; /* Hacer los iconos redondeados */
        padding: 10px;
    }

    .carousel-control-prev-icon {
        left: 10px; /* Ubicación personalizada de la flecha izquierda */
    }

    .carousel-control-next-icon {
        right: 10px; /* Ubicación personalizada de la flecha derecha */
    }
`;

const CarouselItemCentered = styled(Carousel.Item)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px; /* Ajusta la altura según sea necesario */
`;

const CenteredImage = styled.img`
    max-width: 100%;
    height: auto;
    object-fit: cover; /* Esto hará que la imagen cubra el espacio sin distorsionarse */
    border-radius: 10px; /* Bordes redondeados en la imagen */
    cursor: pointer; /* Cambia el cursor para indicar que es clickeable */
`;

Modal.setAppElement('#root'); // Para accesibilidad

const BlogDetail = () => {
    const { state } = useLocation();
    const property = state.property;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    // Función para abrir el modal con la imagen seleccionada
    const openModal = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage("");
    };

    // Función para ir a la imagen anterior
    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? property.images.length - 1 : prevIndex - 1));
        setSelectedImage(property.images[currentIndex === 0 ? property.images.length - 1 : currentIndex - 1]);
    };

    // Función para ir a la imagen siguiente
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === property.images.length - 1 ? 0 : prevIndex + 1));
        setSelectedImage(property.images[currentIndex === property.images.length - 1 ? 0 : currentIndex + 1]);
    };

    return (
        <Container className="container">
            <div className="row">
                <div className="col-lg-8 order-lg-1">
                    <div className="blog-detail">
                        {/* Carrusel de fotos */}
                        <CustomCarousel interval={5000} indicators={false} controls={true} fade>
                            {property.images && property.images.length > 0 ? (
                                property.images.map((image, index) => (
                                    <CarouselItemCentered key={index}>
                                        <CenteredImage
                                            src={image}
                                            alt={`Imagen ${index + 1}`}
                                            onClick={() => openModal(image, index)} // Al hacer clic se abre el modal
                                        />
                                    </CarouselItemCentered>
                                ))
                            ) : (
                                <CarouselItemCentered>
                                    <CenteredImage
                                        src="/img/product1.jpeg"
                                        alt="Imagen predeterminada"
                                        onClick={() => openModal("/img/product1.jpeg", 0)} // Abrir el modal con la imagen por defecto
                                    />
                                </CarouselItemCentered>
                            )}
                        </CustomCarousel>

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

            {/* Modal para mostrar la imagen en grande */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Imagen en grande"
                style={{
                    content: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "transparent", // Fondo transparente para eliminar los bordes negros
                        borderRadius: "10px",
                        padding: "20px",
                        position: "relative", // Añadir posición relativa para que el botón de cierre esté encima
                        zIndex: 1050, // Asegura que el modal esté por encima de otros elementos
                        maxWidth: "90%",
                        maxHeight: "90vh",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.7)", // Mantener el overlay oscuro, pero limpio sin bordes
                        zIndex: 1040, // Asegura que el overlay esté debajo del modal
                    },
                }}
            >
                <div style={{ position: "relative", textAlign: "center" }}>
                    <button
                        onClick={prevImage}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "10px",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "none",
                            color: "white",
                            fontSize: "30px",
                            padding: "10px",
                            cursor: "pointer",
                            borderRadius: "50%",
                        }}
                    >
                        &#10094;
                    </button>

                    <img
                        src={selectedImage}
                        alt="Imagen en grande"
                        style={{
                            maxWidth: "90%",  // La imagen ocupará hasta el 90% del ancho de la pantalla
                            maxHeight: "80vh",  // La imagen ocupará hasta el 80% de la altura de la pantalla
                            objectFit: "contain",  // La imagen no se recortará, mantendrá su proporción
                            margin: "auto",  // Centra la imagen
                            borderRadius: "10px",  // Bordes redondeados en la imagen
                        }}
                    />

                    <button
                        onClick={nextImage}
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "none",
                            color: "white",
                            fontSize: "30px",
                            padding: "10px",
                            cursor: "pointer",
                            borderRadius: "50%",
                        }}
                    >
                        &#10095;
                    </button>

                    <button
                        onClick={closeModal}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "50%",
                            fontSize: "20px",
                            padding: "10px",
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                </div>
            </Modal>
        </Container>
    );
};

export default BlogDetail;
