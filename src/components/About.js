// src/components/About.js
import React from "react";
import styled from "styled-components";
import usePageTitle from "../hooks/usePageTitle";

// Estilos
const AboutSection = styled.section`
  padding: 80px 24px;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", sans-serif;
  color: #1e293b;
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
`;

/* Encabezado Principal */
const HeaderGroup = styled.div`
  text-align: center;
  margin-bottom: 56px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0b1f44;
  margin: 0 0 14px 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.9rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

/* Grid Principal de Dos Columnas */
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

/* Columna Izquierda - Fotografía */
const ImageColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 520px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(11, 31, 68, 0.07);
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  max-height: 580px;
  object-fit: cover;
  display: block;
`;

/* Columna Derecha - Contenido y Equipo */
const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ParagraphText = styled.p`
  font-size: 1.125rem;
  line-height: 1.75;
  color: #334155;
  margin: 0 0 44px 0;
  font-weight: 400;
  text-align: center;

  @media (max-width: 960px) {
    font-size: 1.05rem;
  }
`;

/* Sección del Equipo */
const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeamTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0b1f44;
  margin: 0 0 20px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 8px;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 2px;
    background-color: #ea6d16;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
`;

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.05);
  text-align: center;
`;

const MemberName = styled.h4`
  font-size: 1.15rem;
  font-weight: 700;
  color: #0b1f44;
  margin: 0 0 2px 0;
`;

const MemberRole = styled.p`
  font-size: 0.925rem;
  font-weight: 600;
  color: #ea6d16;
  margin: 0 0 8px 0;
`;

const LicenseDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.45;
`;

const About = () => {
  usePageTitle("Nosotros");

  return (
    <AboutSection>
      <Container>
        {/* Título y Subtítulo de Presentación */}
        <HeaderGroup>
          <Title>Somos París Negocios Inmobiliarios</Title>
        </HeaderGroup>

        {/* Layout Principal en Dos Columnas */}
        <MainGrid>
          {/* Columna Izquierda: Fotografía Familiar */}
          <ImageColumn>
            <ImageWrapper>
              <Photo
                src="/FONDOPARIS.jpeg"
                alt="Claudio París y Franco París - París Negocios Inmobiliarios"
              />
            </ImageWrapper>
          </ImageColumn>

          {/* Columna Derecha: Texto de Valor y Nuestro Equipo */}
          <ContentColumn>
            <ParagraphText>
              El negocio inmobiliario suele ser el negocio más importante en la vida de una persona, y es allí donde radica nuestra responsabilidad en brindar garantías en el tráfico jurídico, confianza y asesoramiento en todo lo que necesites.
            </ParagraphText>

            {/* Presentación Limpia de los Dos Martilleros */}
            <TeamSection>
              <TeamTitle>Detrás de París Negocios Inmobiliarios</TeamTitle>
              <TeamGrid>
                {/* Claudio París */}
                <MemberCard>
                  <MemberName>Claudio París</MemberName>
                  <MemberRole>Martillero y Corredor Público</MemberRole>
                  <LicenseDetails>
                    <span>Colegiado Nº 4058</span>
                    <span>T° IX F° 4058</span>
                    <span>CMCPDJ Mercedes</span>
                  </LicenseDetails>
                </MemberCard>

                {/* Franco París */}
                <MemberCard>
                  <MemberName>Franco París</MemberName>
                  <MemberRole>Martillero y Corredor Público</MemberRole>
                  <LicenseDetails>
                    <span>Colegiado Nº 4149</span>
                    <span>T° IX F° 4149</span>
                    <span>CMCPDJ Mercedes</span>
                  </LicenseDetails>
                </MemberCard>
              </TeamGrid>
            </TeamSection>
          </ContentColumn>
        </MainGrid>
      </Container>
    </AboutSection>
  );
};

export default About;
