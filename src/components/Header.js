import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

const Header = () => {
  return (
    <HeaderWrapper>
      <div className="container">
        <Navbar className="navbar navbar-expand-lg navbar-light">
          <LogoContainer>
            <Link to="/">
              <Logo src={process.env.REACT_APP_LOGO_URL} alt="Logo" />
            </Link>
          </LogoContainer>

          {/* Menú de navegación en pantallas grandes */}
          <NavbarMenu>
            <ul className="navbar-nav ms-auto">
              <NavbarItem>
                <NavbarLink to="/">{process.env.REACT_APP_MENU_HOME}</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/blog">{process.env.REACT_APP_MENU_PROPERTIES}</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/about">{process.env.REACT_APP_MENU_ABOUT}</NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink to="/contact">{process.env.REACT_APP_MENU_CONTACT}</NavbarLink>
              </NavbarItem>
            </ul>
          </NavbarMenu>
        </Navbar>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
