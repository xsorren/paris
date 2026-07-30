import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

// Estilos
const FooterSection = styled.footer`
  background-color: #0b1f44;
  color: white;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
`;

const Column = styled.div`
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;



const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const IconBox = styled.a`
  font-size: 20px;
  color: white;
  transition: color 0.3s;

  &:hover {
    color: #ea6d16;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 15px;
  color: #f0f0f0;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    line-height: 1.5;
  }
`;

const Copyright = styled.div`
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
  width: 100%;
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
          <title>Sobre Nosotros</title>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <FontAwesomeIcon
              icon={faUserTie}
              size="2x"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={() => navigate('/login')}
              style={{ cursor: 'default', color: '#ea6d16', marginTop: '4px' }}
            />
            <InfoList>
              <li><i className="fas fa-user" /> Claudio Paris</li>
              <li><i className="fas fa-briefcase" /> Asesor Inmobiliario</li>
              <li><i className="fas fa-id-badge" /> Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes</li>
            </InfoList>
          </div>
          <SocialIcons>
            <IconBox href="mailto:parisnegociosinmobiliarios@gmail.com" title="Enviar mail">
              <FontAwesomeIcon icon={faEnvelope} />
            </IconBox>
            <IconBox href="https://www.instagram.com/parisnegociosinmobiliarios/" target="_blank" title="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </IconBox>
          </SocialIcons>
        </Column>

        <Column>
          <title>Contacto</title>
          <InfoList>
            <li><i className="fas fa-clock" /> Horarios: 09:00–12:00 / 16:00–20:00</li>
            <li><i className="fas fa-phone" /> Teléfono: 2227-535057</li>
            <li><i className="fas fa-envelope" /> Email: parisnegociosinmobiliarios@gmail.com</li>
            <li><i className="fas fa-map-marker-alt" /> Oficina: Calle 28 Nº917, Navarro, Buenos Aires</li>
          </InfoList>
        </Column>
      </Container>
      <Copyright
        sx={{
          mt: 4,
          py: 2,
          textAlign: "center",
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.7)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          letterSpacing: "0.5px",
        }}
      >
        Paris Negocios Inmobiliarios © 2026 · Desarrollado por{" "}
        <a
          href="https://studio--studio-2931549742-72d7c.us-central1.hosted.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(255,255,255,0.7)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            fontWeight: 500,
            transition: "opacity 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.opacity = "0.8";
          }}
          onMouseOut={(e) => {
            e.target.style.opacity = "1";
          }}
        >
          FALTRA STUDIO
        </a>
      </Copyright>
    </FooterSection>
  );
};

export default Footer;
