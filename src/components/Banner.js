import banner from "../banner.jpg"
import styled from "styled-components";

const BannerWrapper = styled.div`
  min-height: 450px;
  background-image: ${props => `url(${props.bgImage})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(29, 34, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 600px;
  padding: 0 var(--space-xl);

  @media (max-width: 768px) {
    padding: 0 var(--space-l);
  }
`;

const BannerTitle = styled.h1`
  color: white;
  font-size: var(--font-xxl);
  font-weight: var(--font-bold);
  margin: 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Banner = () => {
  return (
    <BannerWrapper bgImage={banner}>
      <BannerOverlay />
      <BannerContent>
        <BannerTitle>Paris Negocios Inmobiliarios</BannerTitle>
      </BannerContent>
    </BannerWrapper>
  );
};

export default Banner;