import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

// Estilos
const FooterSection = styled.footer`
  background-color: var(--primary);
  color: white;
  padding: var(--space-xxxl) var(--space-xl);
  font-family: var(--font-family);
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-xxl);

  @media (max-width: 768px) {
    gap: var(--space-xl);
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
`;

const ColumnTitle = styled.h3`
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-m);
  color: white;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: var(--space-l);
  margin-top: var(--space-m);
`;

const IconBox = styled.a`
  font-size: 20px;
  color: white;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffc107;
    transform: scale(1.1);
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: var(--font-sm);
  color: rgba(255, 255, 255, 0.9);

  li {
    display: flex;
    align-items: center;
    gap: var(--space-m);
    margin-bottom: var(--space-s);
    line-height: 1.6;

    i {
      color: #ffc107;
      width: 16px;
      text-align: center;
      flex-shrink: 0;
    }
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-l);
`;

const InfoIcon = styled.div`
  color: #ffc107;
  font-size: 24px;
  flex-shrink: 0;
  margin-top: var(--space-s);
`;

const Footer = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
  };

  return (
    <FooterSection>
      <Container>
        <Column>
          <ColumnTitle>Sobre Nosotros</ColumnTitle>
          <InfoHeader>
            <InfoIcon>
              <FontAwesomeIcon
                icon={faUserTie}
                size="lg"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={() => navigate('/login')}
                style={{ cursor: 'pointer' }}
              />
            </InfoIcon>
            <InfoList>
              <li><i className="fas fa-user" /> Claudio Paris</li>
              <li><i className="fas fa-briefcase" /> Asesor Inmobiliario</li>
              <li><i className="fas fa-id-badge" /> Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes</li>
            </InfoList>
          </InfoHeader>
          <SocialIcons>
            <IconBox href="mailto:parisnegociosinmobiliarios@gmail.com" title="Enviar mail">
              <FontAwesomeIcon icon={faEnvelope} />
            </IconBox>
            <IconBox href="https://www.instagram.com/parisnegociosinmobiliarios/" target="_blank" rel="noopener noreferrer" title="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </IconBox>
          </SocialIcons>
        </Column>

        <Column>
          <ColumnTitle>Contacto</ColumnTitle>
          <InfoList>
            <li><i className="fas fa-clock" /> Horarios: 08:00–12:30 / 16:00–20:00</li>
            <li><i className="fas fa-phone" /> Teléfono: 2227-535057</li>
            <li><i className="fas fa-envelope" /> Email: parisnegociosinmobiliarios@gmail.com</li>
            <li><i className="fas fa-map-marker-alt" /> Oficina: Calle 28 Nº917, Navarro, Buenos Aires</li>
          </InfoList>
        </Column>
      </Container>
    </FooterSection>
  );
};

export default Footer;
