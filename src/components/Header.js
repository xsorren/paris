import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Colores sobrios y elegantes para inmobiliaria
const HeaderWrapper = styled.header`
  background-color: #0b1f44;  // Azul oscuro elegante
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  cursor: pointer;
`;

const Logo = styled.img`
  max-height: 60px;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.4));
`;

const NavbarMenu = styled.ul`
  display: flex;
  gap: 30px;
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    right: ${({ open }) => (open ? "0" : "-100%")};
    background-color: #0b1f44;
    height: calc(100vh - 70px);
    width: 250px;
    flex-direction: column;
    padding: 30px 20px;
    gap: 20px;
    transition: right 0.3s ease-in-out;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.5);
  }
`;

const NavbarItem = styled.li``;

const NavbarLink = styled(Link)`
  text-decoration: none;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #184a8e;
    color: #fff;
  }
`;

// Botón hamburguesa para menú móvil
const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 6px;

  span {
    height: 3px;
    width: 25px;
    background: #f0f0f0;
    border-radius: 2px;
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <HeaderWrapper>
      <Container>
        <LogoContainer>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo src="/logoINMO.jpg" alt="Logo Paris Inmobiliaria" />
          </Link>
        </LogoContainer>

        <Hamburger onClick={toggleMenu} aria-label="Toggle menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </Hamburger>

        <NavbarMenu open={menuOpen}>
          <NavbarItem>
            <NavbarLink to="/" onClick={() => setMenuOpen(false)}>Inicio</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink to="/blog" onClick={() => setMenuOpen(false)}>Nuestras Propiedades</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink to="/about" onClick={() => setMenuOpen(false)}>Sobre nosotros</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink to="/contact" onClick={() => setMenuOpen(false)}>Contacto</NavbarLink>
          </NavbarItem>
        </NavbarMenu>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
