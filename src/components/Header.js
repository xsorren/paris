import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { slide as Menu } from "react-burger-menu";

// Estilos con styled-components
const HeaderWrapper = styled.div`
  background-color: #012161;
  box-shadow: 0 4px 2px -2px gray;
  padding: 10px 0;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  padding: 8px;
`;

const Logo = styled.img`
  max-height: 70px;
`;

const NavbarMenu = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    display: none; /* Escondemos el menú en pantallas pequeñas cuando usas react-burger-menu */
  }
`;

const NavbarItem = styled.li`
  list-style-type: none;
`;

const NavbarLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 16px;
  padding: 8px 12px;
  
  &:hover {
    background-color: #013b88;
    border-radius: 4px;
  }
`;

// Botón del menú hamburguesa
const BurgerButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  
  .bm-burger-bars {
    background: white; /* El ícono del menú hamburguesa será blanco */
  }
`;

// Estilos personalizados para el menú hamburguesa
const StyledBurgerMenu = styled(Menu)`
  .bm-menu {
    background-color: #012161;
    padding: 2.5em 1.5em 0;
    font-size: 1.15em;
    color: white; /* Las letras del menú serán blancas */
  }

  .bm-item {
    display: inline-block;
    margin: 0.5em 0;
  }

  .bm-item-list {
    padding: 0;
  }

  .bm-item a {
    text-decoration: none;
    color: white; /* Letras blancas */
    padding: 10px 15px;
    display: block;
  }

  .bm-item a:hover {
    background-color: #013b88;
    border-radius: 4px;
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <div className="container">
        <Navbar className="navbar navbar-expand-lg navbar-light">
          <LogoContainer>
            <Link to="/">
              <Logo src={"/img/LOGOINMO.png"} alt="Logo" />
            </Link>
          </LogoContainer>

          {/* Botón del menú hamburguesa */}
          <BurgerButton>
            <StyledBurgerMenu right>
              <NavbarItem>
                <NavbarLink to="/">Inicio</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/blog">Nuestras Propiedades</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/about">Sobre Nosotros</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/contact">Contactos</NavbarLink>
              </NavbarItem>
            </StyledBurgerMenu>
          </BurgerButton>

          {/* Menú de navegación en pantallas grandes */}
          <NavbarMenu>
            <ul className="navbar-nav ms-auto">
              <NavbarItem>
                <NavbarLink to="/">Inicio</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/blog">Nuestras Propiedades</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/about">Sobre Nosotros</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/contact">Contactos</NavbarLink>
              </NavbarItem>
            </ul>
          </NavbarMenu>
        </Navbar>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
