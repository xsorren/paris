import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { deleteProperty, updatePropertyStatus } from "../firebase/propertyService";
import { isUserAuthorized } from "../firebase/authService";
import usePageTitle from "../hooks/usePageTitle";
import styled from "styled-components";

const Blog = () => {
  usePageTitle("Propiedades");

  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState("todas");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;

  useEffect(() => {
    // Verificar si el usuario es administrador
    setIsAdmin(isUserAuthorized());

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
    setCurrentPage(1); // Reset a primera página
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
    setCurrentPage(1); // Reset a primera página
    const filtradas = propiedades.filter(
      (prop) => prop.operacion?.toLowerCase() === tipoOperacion.toLowerCase()
    );
    setFiltered(filtradas);
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    setDeleting(true);
    try {
      const result = await deleteProperty(propertyToDelete.id);
      if (result.success) {
        // Actualizar las listas locales
        const updatedPropiedades = propiedades.filter(prop => prop.id !== propertyToDelete.id);
        setPropiedades(updatedPropiedades);
        setFiltered(updatedPropiedades);
        setShowDeleteModal(false);
        setPropertyToDelete(null);
      } else {
        console.error("Error al eliminar propiedad:", result.error);
        alert("Error al eliminar la propiedad. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      alert("Error al eliminar la propiedad. Intenta nuevamente.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      const result = await updatePropertyStatus(propertyId, newStatus);
      if (result.success) {
        // Actualizar las listas locales
        const updatedPropiedades = propiedades.map(prop =>
          prop.id === propertyId ? { ...prop, estado: newStatus } : prop
        );
        setPropiedades(updatedPropiedades);
        setFiltered(updatedPropiedades);
      } else {
        console.error("Error al actualizar estado:", result.error);
        alert("Error al actualizar el estado de la propiedad. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado de la propiedad. Intenta nuevamente.");
    }
  };

  const handleCardClick = (propertyId, e) => {
    // Evitar navegación si se clickeó un botón
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/blog/${propertyId}`);
  };

  // Lógica de paginación
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filtered.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filtered.length / propertiesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <span>Propiedades</span> disponibles
        </PageTitle>
        <ResultCount>{filtered.length} propiedades encontradas</ResultCount>
      </PageHeader>

      <FilterSection>
        {["todas", "casa", "departamento", "lote"].map((tipo) => (
          <FilterButton
            key={tipo}
            active={filtroActivo === tipo}
            onClick={() => filtrarPorTipo(tipo)}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </FilterButton>
        ))}

        <FilterButton
          active={filtroActivo === "venta"}
          onClick={() => filtrarPorOperacion("venta")}
        >
          En Venta
        </FilterButton>

        <FilterButton
          active={filtroActivo === "alquiler"}
          onClick={() => filtrarPorOperacion("alquiler")}
        >
          En Alquiler
        </FilterButton>
      </FilterSection>

      {loading ? (
        <LoadingPropertiesComponent />
      ) : filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🏠</EmptyIcon>
          <EmptyTitle>No se encontraron propiedades</EmptyTitle>
          <EmptyText>Intenta cambiar los filtros para ver más resultados</EmptyText>
        </EmptyState>
      ) : (
        <>
          <PropertiesGrid>
            {currentProperties.map((property) => (
              <PropertyCard 
                key={property.id}
                onClick={(e) => handleCardClick(property.id, e)}
              >
                <ImageContainer>
                  <PropertyImage
                    src={property.images?.[0]?.url || "https://via.placeholder.com/400x300?text=Sin+imagen"}
                    alt={property.titulo}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Error+al+cargar";
                    }}
                  />

                  {/* Badge de estado */}
                  {property.estado && property.estado !== 'disponible' && (
                    <StatusBadge status={property.estado}>
                      {property.estado === 'vendida' ? 'VENDIDA' : 'ALQUILADA'}
                    </StatusBadge>
                  )}

                  {/* Contador de imágenes */}
                  {property.images && property.images.length > 0 && (
                    <ImageCounter>
                      📷 {property.images.length}
                    </ImageCounter>
                  )}

                  {/* Botón eliminar (solo admin) */}
                  {isAdmin && (
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(property);
                      }}
                      title="Eliminar propiedad"
                    >
                      🗑️
                    </DeleteButton>
                  )}
                </ImageContainer>

                <CardContent>
                  <PropertyTitle>{property.titulo}</PropertyTitle>
                  
                  <PropertyInfo>
                    <InfoItem>
                      <InfoIcon>📍</InfoIcon>
                      <InfoText>{property.localidad}</InfoText>
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon>📏</InfoIcon>
                      <InfoText>{property.metros} m²</InfoText>
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon>🏷️</InfoIcon>
                      <InfoText>{property.categoria}</InfoText>
                    </InfoItem>
                  </PropertyInfo>

                  <ViewDetailsButton>
                    Ver Detalles →
                  </ViewDetailsButton>

                  {/* Botones de admin */}
                  {isAdmin && (
                    <AdminActions onClick={(e) => e.stopPropagation()}>
                      <StatusToggleButton
                        status="vendida"
                        active={property.estado === 'vendida'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(property.id, property.estado === 'vendida' ? 'disponible' : 'vendida');
                        }}
                      >
                        {property.estado === 'vendida' ? '✓ Vendida' : 'Marcar Vendida'}
                      </StatusToggleButton>
                      <StatusToggleButton
                        status="alquilada"
                        active={property.estado === 'alquilada'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(property.id, property.estado === 'alquilada' ? 'disponible' : 'alquilada');
                        }}
                      >
                        {property.estado === 'alquilada' ? '✓ Alquilada' : 'Marcar Alquilada'}
                      </StatusToggleButton>
                    </AdminActions>
                  )}
                </CardContent>
              </PropertyCard>
            ))}
          </PropertiesGrid>

          {/* Paginación */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Anterior
              </PaginationButton>

              <PageNumbers>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Mostrar solo páginas cercanas a la actual
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PageNumber
                        key={pageNumber}
                        active={currentPage === pageNumber}
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
                      </PageNumber>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <PageDots key={pageNumber}>...</PageDots>;
                  }
                  return null;
                })}
              </PageNumbers>

              <PaginationButton
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && propertyToDelete && (
        <ModalOverlay onClick={handleCancelDelete}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>¿Eliminar Propiedad?</ModalTitle>
            <ModalContent>
              <ModalImage
                src={propertyToDelete.images?.[0]?.url || "https://via.placeholder.com/200x150?text=Sin+imagen"}
                alt={propertyToDelete.titulo}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200x150?text=Error+al+cargar";
                }}
              />
              <ModalDetails>
                <ModalPropertyTitle>{propertyToDelete.titulo}</ModalPropertyTitle>
                <p><strong>Tipo:</strong> {propertyToDelete.categoria}</p>
                <p><strong>Operación:</strong> {propertyToDelete.operacion}</p>
                <p><strong>Ubicación:</strong> {propertyToDelete.localidad}</p>
                <p><strong>Metros:</strong> {propertyToDelete.metros} m²</p>
                <WarningText>
                  ⚠️ Esta acción no se puede deshacer
                </WarningText>
              </ModalDetails>
            </ModalContent>
            <ModalButtons>
              <CancelButton
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancelar
              </CancelButton>
              <ConfirmDeleteButton
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </ConfirmDeleteButton>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: var(--space-xxxl) var(--space-l);
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-m);
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-xxxl);
`;

const PageTitle = styled.h1`
  font-size: var(--font-xxl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-m);
  
  span {
    color: var(--primary);
  }
  
  @media (max-width: 768px) {
    font-size: var(--font-xl);
  }
`;

const ResultCount = styled.p`
  font-size: var(--font-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-m);
  margin-bottom: var(--space-xxxl);
`;

const FilterButton = styled.button`
  padding: var(--space-m) var(--space-xl);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  border: 2px solid ${props => props.active ? 'var(--primary)' : 'var(--bg-lighter)'};
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--bg-white)'};
  color: ${props => props.active ? 'var(--bg-white)' : 'var(--text-primary)'};
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary);
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-l);
  margin-bottom: var(--space-xxxl);
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-l);
  }
`;

const PropertyCard = styled.div`
  background: var(--bg-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background-color: var(--bg-lighter);
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
  
  ${PropertyCard}:hover & {
    transform: scale(1.08);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: var(--space-l);
  left: var(--space-l);
  background-color: ${props => props.status === 'vendida' ? 'var(--error)' : 'var(--warning)'};
  color: ${props => props.status === 'vendida' ? 'var(--bg-white)' : 'var(--text-primary)'};
  padding: var(--space-s) var(--space-l);
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-md);
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: var(--space-l);
  right: var(--space-l);
  background-color: rgba(0, 0, 0, 0.75);
  color: var(--bg-white);
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`;

const DeleteButton = styled.button`
  position: absolute;
  top: var(--space-l);
  right: var(--space-l);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: none;
  background-color: var(--error);
  color: var(--bg-white);
  font-size: 18px;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
  
  ${PropertyCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }
  
  &:hover {
    transform: scale(1.1) !important;
    background-color: #c82333;
  }
`;

const CardContent = styled.div`
  padding: var(--space-xl);
`;

const PropertyTitle = styled.h3`
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-l);
  line-height: 1.3;
  
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  margin-bottom: var(--space-l);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-m);
`;

const InfoIcon = styled.span`
  font-size: 18px;
  width: 24px;
  text-align: center;
`;

const InfoText = styled.span`
  font-size: var(--font-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
`;

const ViewDetailsButton = styled.div`
  display: inline-block;
  width: 100%;
  padding: var(--space-m) var(--space-l);
  background-color: var(--primary);
  color: var(--bg-white);
  text-align: center;
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--primary-light);
  }
`;

const AdminActions = styled.div`
  display: flex;
  gap: var(--space-s);
  margin-top: var(--space-l);
  padding-top: var(--space-l);
  border-top: 1px solid var(--bg-lighter);
`;

const StatusToggleButton = styled.button`
  flex: 1;
  padding: var(--space-s) var(--space-m);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  background-color: ${props => {
    if (props.active) return 'var(--success)';
    if (props.status === 'vendida') return 'var(--error)';
    if (props.status === 'alquilada') return 'var(--warning)';
    return 'var(--bg-lighter)';
  }};
  
  color: ${props => {
    if (props.active) return 'var(--bg-white)';
    if (props.status === 'vendida') return 'var(--bg-white)';
    if (props.status === 'alquilada') return 'var(--text-primary)';
    return 'var(--text-secondary)';
  }};
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

// Paginación
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-l);
  margin-top: var(--space-xxxl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-m);
  }
`;

const PageNumbers = styled.div`
  display: flex;
  gap: var(--space-s);
  align-items: center;
`;

const PageNumber = styled.button`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  border: 2px solid ${props => props.active ? 'var(--primary)' : 'var(--bg-lighter)'};
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--bg-white)'};
  color: ${props => props.active ? 'var(--bg-white)' : 'var(--text-primary)'};
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    border-color: var(--primary);
    transform: scale(1.1);
  }
`;

const PageDots = styled.span`
  color: var(--text-secondary);
  font-weight: var(--font-bold);
  padding: 0 var(--space-s);
`;

const PaginationButton = styled.button`
  padding: var(--space-m) var(--space-xl);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  border: 2px solid var(--primary);
  background-color: var(--bg-white);
  color: var(--primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background-color: var(--primary);
    color: var(--bg-white);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: var(--bg-lighter);
    color: var(--text-muted);
  }
`;

// Estado vacío
const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-xxxl);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: var(--space-l);
`;

const EmptyTitle = styled.h3`
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-m);
`;

const EmptyText = styled.p`
  font-size: var(--font-base);
  color: var(--text-secondary);
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--space-xxxl);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: var(--shadow-lg);
`;

const ModalTitle = styled.h3`
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--error);
  margin-bottom: var(--space-xl);
  text-align: center;
`;

const ModalContent = styled.div`
  display: flex;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalImage = styled.img`
  width: 150px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-md);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ModalDetails = styled.div`
  flex: 1;
  
  p {
    margin-bottom: var(--space-s);
    font-size: var(--font-sm);
    color: var(--text-secondary);
  }
  
  strong {
    color: var(--text-primary);
  }
`;

const ModalPropertyTitle = styled.h4`
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-m);
`;

const WarningText = styled.p`
  color: var(--error);
  font-weight: var(--font-bold);
  font-size: var(--font-sm);
  margin-top: var(--space-l);
  padding: var(--space-m);
  background-color: #f8d7da;
  border-radius: var(--radius-sm);
  border: 1px solid #f5c6cb;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: var(--space-l);
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: var(--space-m) var(--space-xl);
  background-color: var(--text-secondary);
  color: var(--bg-white);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: #5a6268;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmDeleteButton = styled.button`
  padding: var(--space-m) var(--space-xl);
  background-color: var(--error);
  color: var(--bg-white);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: #c82333;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Loading Component - Mantener el existente
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: var(--bg-lighter);
  border-radius: var(--radius-lg);
`;

const LoadingContent = styled.div`
  text-align: center;
  max-width: 600px;
  padding: var(--space-xxxl);
  background-color: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
`;

const SpinnerContainer = styled.div`
  margin-bottom: var(--space-xxxl);
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid var(--bg-lighter);
  border-top: 4px solid var(--primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingTitle = styled.h2`
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-m);
`;

const LoadingSubtitle = styled.p`
  font-size: var(--font-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-xxxl);
  line-height: 1.5;
`;

const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-m);
  margin-bottom: var(--space-xxxl);
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  background-color: var(--primary);
  border-radius: var(--radius-full);
  animation: bounce 1.4s ease-in-out infinite both;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const LoadingProperties = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-xl);
`;

const PropertySkeleton = styled.div`
  height: 200px;
  background: linear-gradient(90deg, var(--bg-lighter) 25%, #e0e0e0 50%, var(--bg-lighter) 75%);
  background-size: 200px 100%;
  border-radius: var(--radius-md);
  animation: shimmer 1.5s ease-in-out infinite;
  
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

const LoadingPropertiesComponent = () => {
  return (
    <LoadingContainer>
      <LoadingContent>
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
        <LoadingTitle>Cargando Propiedades</LoadingTitle>
        <LoadingSubtitle>Buscando las mejores propiedades para ti...</LoadingSubtitle>
        <LoadingDots>
          <Dot />
          <Dot />
          <Dot />
        </LoadingDots>
        <LoadingProperties>
          <PropertySkeleton />
          <PropertySkeleton />
          <PropertySkeleton />
        </LoadingProperties>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default Blog;
