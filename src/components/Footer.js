import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

// Estilos
const FooterSection = styled.footer`
  background-color: #012161;
  color: white;
  padding: 60px 20px 40px 20px;
  font-family: 'Segoe UI', sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Column = styled.div`
  flex: 1 1 300px;
  margin: 20px 0;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 20px;
`;

const InfoText = styled.span`
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

const IconBox = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: white;

  &:hover {
    color: #ffc107;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 14px;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    i {
      margin-right: 10px;
      font-size: 16px;
    }
  }
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
                    <FontAwesomeIcon
                        icon={faUserTie}
                        size="2x"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onDoubleClick={() => navigate('/login')} // 👉 nuevo comportamiento
                        style={{ cursor: 'default' }}
                    />

                    <InfoText>{process.env.REACT_APP_COMPANY_NAME}</InfoText>
                    <InfoText>{process.env.REACT_APP_COMPANY_ADVISOR}</InfoText>
                    <InfoText>{process.env.REACT_APP_COMPANY_REGISTRATION}</InfoText>
                    <SocialIcons>
                        <IconBox>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </IconBox>
                        <IconBox>
                            <FontAwesomeIcon icon={faInstagram} />
                        </IconBox>
                    </SocialIcons>
                </Column>

                <Column>
                    <Title>Contactos</Title>
                    <InfoList>
                        <li><i className="fas fa-clock" /> Horarios de Atención: 08:00 a 12:30 am y 16:00 a 20:00 pm</li>
                        <li><i className="fas fa-clock" />  Telefono 2227-535057</li>
                        <li><i className="fas fa-envelope" />Mail: parisnegociosinmobiliarios@gmail.com</li>
                        <li><i className="fas fa-map-marker-alt" />Nuestra oficina: calle 28 n°917, Navarro, Buenos Aires</li>
                    </InfoList>
                </Column>
            </Container>
        </FooterSection>
    );
};

export default Footer;
