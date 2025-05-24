import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

// Estilos
const InfoSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: #f8f9fa;
  color: #012161;
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
`;

const InfoGrid = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
`;

const InfoBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  width: 300px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 15px;
  color: #012161;
`;

const Title = styled.h5`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const Text = styled.p`
  font-size: 15px;
  color: #444;
  margin-top: 10px;
  line-height: 1.4;
`;

const Info = () => {
  return (
    <InfoSection>
      <InfoGrid>
        <InfoBox>
          <IconWrapper>
            <FontAwesomeIcon icon={faUsers} size="2x" />
          </IconWrapper>
          <Title>{process.env.REACT_APP_INFO_SERVICE_1}</Title>
          <Text>Tasaciones y asesoramiento</Text>
        </InfoBox>

        <InfoBox>
          <IconWrapper>
            <FontAwesomeIcon icon={faBuilding} size="2x" />
          </IconWrapper>
          <Title>{process.env.REACT_APP_INFO_SERVICE_2}</Title>
          <Text>Casas, Departamentos, lotes y más</Text>
        </InfoBox>

        <InfoBox>
          <IconWrapper>
            <FontAwesomeIcon icon={faMoneyBillAlt} size="2x" />
          </IconWrapper>
          <Title>{process.env.REACT_APP_INFO_SERVICE_3}</Title>
          <Text>Propiedades en Navarro y alrededores</Text>
        </InfoBox>
      </InfoGrid>
    </InfoSection>
  );
};

export default Info;
