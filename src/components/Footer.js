// src/components/Footer.js
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faPhone,
  faEnvelope,
  faClock,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram,
  faFacebookF,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';

// Componentes Estilizados
const FooterWrapper = styled.footer`
  background-color: #13264D;
  color: #ffffff;
  padding: 50px 24px 28px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", sans-serif;
  width: 100%;
  box-sizing: border-box;
`;

const FooterContainer = styled.div`
  max-width: 1140px;
  margin: 0 auto;
`;

/* Parte Superior - Nombre de la Empresa */
const HeaderBrand = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const BrandTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0 0 6px 0;
`;

const BrandSubtitle = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  letter-spacing: 1px;
  margin: 0;
  font-weight: 400;
`;

const HeaderDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
`;

/* Columnas Principales */
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 36px;
    text-align: center;
  }
`;

const SectionColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #ffffff;
  margin: 0 0 24px 0;
  display: inline-block;
  position: relative;
  padding-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 36px;
    height: 2px;
    background-color: #ea6d16;
  }

  @media (max-width: 960px) {
    margin-left: auto;
    margin-right: auto;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

/* Columna 1 - Nuestro Equipo */
const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AdviserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 960px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const AdviserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(234, 109, 22, 0.12);
  border: 1px solid rgba(234, 109, 22, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ea6d16;
  font-size: 1.15rem;
  flex-shrink: 0;
  cursor: default;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const AdviserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AdviserName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const AdviserRole = styled.p`
  font-size: 0.84375rem;
  color: #ea6d16;
  font-weight: 500;
  margin: 0;
`;

const AdviserLicense = styled.p`
  font-size: 0.78125rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.35;
`;

/* Columnas de Información */
const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 960px) {
    flex-direction: column;
    align-items: center;
  }
`;

const InfoIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ea6d16;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.925rem;
  line-height: 1.5;
  color: #cbd5e1;

  strong {
    color: #ffffff;
    font-weight: 600;
  }
`;

/* Secciones Inferiores - Redes Sociales & Copyright */
const SocialDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 40px 0 28px 0;
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
`;

const SocialIconLink = styled.a`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: #ea6d16;
    border-color: #ea6d16;
    color: #ffffff;
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 6px 16px rgba(234, 109, 22, 0.35);
  }
`;

const CopyrightText = styled.div`
  text-align: center;
  font-size: 0.8125rem;
  color: #94a3b8;
  margin-top: 24px;
  line-height: 1.6;

  a {
    color: #cbd5e1;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 500;
    transition: opacity 0.2s ease, color 0.2s ease;

    &:hover {
      opacity: 0.9;
      color: #ffffff;
    }
  }
`;

const Footer = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Acceso discreto para administración
  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <FooterWrapper>
      <FooterContainer>
        {/* Nombre de la Empresa Centrado en la Parte Superior */}
        <HeaderBrand>
          <BrandTitle>París Negocios Inmobiliarios</BrandTitle>
          <BrandSubtitle> Asesoramiento Inmobiliario</BrandSubtitle>
        </HeaderBrand>

        <HeaderDivider />

        {/* Tres Columnas Principales */}
        <MainGrid>
          {/* Columna 1: NUESTRO EQUIPO */}
          <SectionColumn>
            <ColumnTitle>Quiénes somos</ColumnTitle>
            <TeamList>
              {/* Asesor 1 */}
              <AdviserCard>
                <AdviserAvatar
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onDoubleClick={() => navigate('/login')}
                  title="Claudio París"
                >
                  <FontAwesomeIcon icon={faUserTie} />
                </AdviserAvatar>
                <AdviserDetails>
                  <AdviserName>Claudio París</AdviserName>
                  <AdviserRole>Martillero y Corredor Público</AdviserRole>
                  <AdviserLicense>Colegiado N° 4058 T°IX F°4058 - CMCPDJ Mercedes</AdviserLicense>
                </AdviserDetails>
              </AdviserCard>

              {/* Asesor 2 */}
              <AdviserCard>
                <AdviserAvatar title="Franco París">
                  <FontAwesomeIcon icon={faUserTie} />
                </AdviserAvatar>
                <AdviserDetails>
                  <AdviserName>Franco París</AdviserName>
                  <AdviserRole>Martillero y Corredor Público</AdviserRole>
                  <AdviserLicense>Colegiado N° 4149 T°IX F°4149 - CMCPDJ Mercedes</AdviserLicense>
                </AdviserDetails>
              </AdviserCard>
            </TeamList>
          </SectionColumn>

          {/* Columna 2: INFORMACIÓN DE CONTACTO */}
          <SectionColumn>
            <ColumnTitle>Información de Contacto</ColumnTitle>
            <InfoList>
              {/* Teléfono */}
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faPhone} />
                </InfoIcon>
                <InfoText>
                  <strong>Teléfonos</strong>
                  <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <a
                      href="tel:2227535057"
                      style={{ color: '#cbd5e1', textDecoration: 'none' }}
                    >
                      2227-535057
                    </a>
                    <span style={{ color: '#64748b' }}>/</span>
                    <a
                      href="tel:2227513616"
                      style={{ color: '#cbd5e1', textDecoration: 'none' }}
                    >
                      2227-513616
                    </a>
                  </span>
                </InfoText>
              </InfoItem>

              {/* Email */}
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faEnvelope} />
                </InfoIcon>
                <InfoText>
                  <strong>Email</strong>
                  <a
                    href="mailto:parisnegociosinmobiliarios@gmail.com"
                    style={{ color: '#cbd5e1', textDecoration: 'none' }}
                  >
                    parisnegociosinmobiliarios@gmail.com
                  </a>
                </InfoText>
              </InfoItem>
            </InfoList>
          </SectionColumn>

          {/* Columna 3: NOS ENCONTRÁS */}
          <SectionColumn>
            <ColumnTitle>Nos Encontrás</ColumnTitle>
            <InfoList>
              {/* Dirección de Oficina (Ubicación Primero) */}
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </InfoIcon>
                <InfoText>
                  <strong>Dirección de Oficina</strong>
                  <span>Calle 28 Nº 917</span>
                  <span>Navarro, Buenos Aires</span>
                </InfoText>
              </InfoItem>

              {/* Horarios de Atención (Horario Después) */}
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faClock} />
                </InfoIcon>
                <InfoText>
                  <strong>Horarios de Atención</strong>
                  <span>09:00 – 12:00 / 16:00 – 20:00</span>
                </InfoText>
              </InfoItem>
            </InfoList>
          </SectionColumn>
        </MainGrid>

        {/* Redes Sociales Centradas */}
        <SocialDivider />
        <SocialContainer>
          <SocialIconLink
            href="https://www.instagram.com/parisnegociosinmobiliarios/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </SocialIconLink>

          {/* <SocialIconLink
            href="https://www.facebook.com/parisnegociosinmobiliarios"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </SocialIconLink> */}

          <SocialIconLink
            href="https://wa.me/5492227535057"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            aria-label="WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </SocialIconLink>
        </SocialContainer>

        {/* Copyright & Enlace de Desarrollador */}
        <CopyrightText>
          París Negocios Inmobiliarios © 2026 · Desarrollado por{" "}
          <a
            href="https://studio--studio-2931549742-72d7c.us-central1.hosted.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            FALTRA STUDIO
          </a>
        </CopyrightText>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
