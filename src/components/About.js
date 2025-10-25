import usePageTitle from "../hooks/usePageTitle";
import styled from "styled-components";

const AboutSection = styled.section`
  padding: var(--space-xxxl) var(--space-xl);
  background-color: var(--bg-white);
  font-family: var(--font-family);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
`;

const AboutRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxl);
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageColumn = styled.div`
  text-align: center;

  img {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: var(--radius-md);
    filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.15));
    object-fit: contain;
  }
`;

const TextColumn = styled.div``;

const AboutTitle = styled.h2`
  font-size: var(--font-xxl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xl);
  color: var(--primary);

  @media (max-width: 768px) {
    font-size: var(--font-xl);
  }
`;

const AboutDescription = styled.p`
  font-size: var(--font-base);
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
`;

const FeatureList = styled.div`
  margin-top: var(--space-xl);
`;

const FeatureItem = styled.p`
  color: var(--primary);
  margin-bottom: var(--space-m);
  font-size: var(--font-base);
  display: flex;
  align-items: center;
  gap: var(--space-m);

  i {
    color: var(--primary);
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }
`;

const About = () => {
  usePageTitle("Nosotros");
  return (
    <AboutSection>
      <Container>
        <AboutRow>
          {/* Imagen a la izquierda */}
          <ImageColumn>
            <img
              src="/logoINMO.JPG"
              alt="Paris Negocios Inmobiliarios"
            />
          </ImageColumn>

          {/* Texto a la derecha */}
          <TextColumn>
            <AboutTitle>Paris Negocios Inmobiliarios</AboutTitle>
            <AboutDescription>
              Somos una inmobiliaria comprometida con ofrecerte las mejores propiedades y servicios. Nuestro equipo de expertos está dedicado a ayudarte a encontrar la casa de tus sueños o la inversión perfecta. Con años de experiencia en el mercado, nos enorgullece brindar un servicio personalizado y de alta calidad. Nuestro objetivo es superar tus expectativas y garantizar tu satisfacción en cada paso del proceso inmobiliario.
            </AboutDescription>
            <FeatureList>
              <FeatureItem>
                <i className="fas fa-long-arrow-alt-right" />
                Claudio Paris
              </FeatureItem>
              <FeatureItem>
                <i className="fas fa-long-arrow-alt-right" />
                Asesoramiento Inmobiliario
              </FeatureItem>
              <FeatureItem>
                <i className="fas fa-long-arrow-alt-right" />
                Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes
              </FeatureItem>
            </FeatureList>
          </TextColumn>
        </AboutRow>
      </Container>
    </AboutSection>
  );
};

export default About;
