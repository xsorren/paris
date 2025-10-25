import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

// Estilos
const InfoSection = styled.section`
  padding: var(--space-xxxl) var(--space-xl);
  background-color: var(--bg-light);
  color: var(--primary);
  font-family: var(--font-family);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: var(--font-xxl);
  color: var(--primary);
  margin-bottom: var(--space-xxl);
  font-weight: var(--font-bold);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: var(--space-l);
  }
`;

const InfoBox = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const IconWrapper = styled.div`
  margin-bottom: var(--space-l);
  color: var(--primary);
  font-size: 32px;
`;

const BoxTitle = styled.h3`
  font-size: var(--font-lg);
  color: var(--primary);
  margin-bottom: var(--space-m);
  font-weight: var(--font-bold);
`;

const Text = styled.p`
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
`;

const Info = () => {
  return (
    <InfoSection>
      <SectionTitle>Nuestros Servicios</SectionTitle>
      <InfoGrid>
        <InfoBox>
          <IconWrapper>
            <FontAwesomeIcon icon={faUsers} />
          </IconWrapper>
          <BoxTitle>{process.env.REACT_APP_INFO_SERVICE_1}</BoxTitle>
          <Text>Tasaciones y asesoramiento profesional para tus inversiones inmobiliarias</Text>
        </InfoBox>

        <InfoBox>
          <IconWrapper>
            <FontAwesomeIcon icon={faBuilding} />
          </IconWrapper>
          <BoxTitle>{process.env.REACT_APP_INFO_SERVICE_2}</BoxTitle>
          <Text>Casas, departamentos, lotes y más inmuebles de calidad</Text>
        </InfoBox>

        <InfoBox>
          <IconWrapper>
            <FontAwesomeIcon icon={faMoneyBillAlt} />
          </IconWrapper>
          <BoxTitle>{process.env.REACT_APP_INFO_SERVICE_3}</BoxTitle>
          <Text>Propiedades en Navarro y sus alrededores</Text>
        </InfoBox>
      </InfoGrid>
    </InfoSection>
  );
};

export default Info;
