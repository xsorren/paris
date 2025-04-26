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
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
`;

const CarouselItemCentered = styled(Carousel.Item)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
`;

const CenteredImage = styled.img`
    max-width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    cursor: pointer;
`;

Modal.setAppElement('#root');

const BlogDetail = () => {
    const { state } = useLocation();
    const property = state.property;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage("");
    };

    return (
        <Container className="container">
            <div className="row">
                <div className="col-lg-8 order-lg-1">
                    <div className="blog-detail">
                        <CustomCarousel interval={5000} indicators={false} controls={true} fade>
                            {property.images && property.images.length > 0 ? (
                                property.images.map((image, index) => (
                                    <CarouselItemCentered key={index}>
                                        <CenteredImage
                                            src={image}
                                            alt={`Imagen ${index + 1}`}
                                            onClick={() => openModal(image, index)}
                                        />
                                    </CarouselItemCentered>
                                ))
                            ) : (
                                <CarouselItemCentered>
                                    <CenteredImage
                                        src={process.env.REACT_APP_DEFAULT_IMAGE_URL}
                                        alt="Imagen predeterminada"
                                        onClick={() => openModal(process.env.REACT_APP_DEFAULT_IMAGE_URL, 0)}
                                    />
                                </CarouselItemCentered>
                            )}
                        </CustomCarousel>

                        <span className="blog-detail-category">{property.type}</span>
                        <h1 className="blog-detail-title">{property.title} - {property.location}</h1>
                        <span className="blog-detail-date">Publicado el {property.date}</span>
                        <p className="blog-detail-content">{property.description}</p>
                    </div>
                </div>
                <div className="col-lg-4 order-lg-2">
                    <Sidebar />
                </div>
            </div>

            {/* Modal para mostrar imagen ampliada */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Vista de Imagen"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 1000,
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#fff',
                        borderRadius: '10px',
                        padding: '0',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflow: 'hidden',
                    },
                }}
            >
                <img
                    src={selectedImage}
                    alt="Vista ampliada"
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
            </Modal>
        </Container>
    );
};

export default BlogDetail;
