import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Estilos
const HeaderWrapper = styled.header`
  background-color: #0b1f44;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  padding: 10px 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 110px;
  width: 280px;
  object-fit: fill;
  filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const NavbarMenu = styled.ul`
  display: flex;
  gap: 25px;
  list-style: none;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    right: ${({ open }) => (open ? "0" : "-100%")};
    background-color: #0b1f44;
    height: calc(100vh - 70px);
    width: 250px;
    flex-direction: column;
    padding: 30px 20px;
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
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #184a8e;
    color: #fff;
  }
`;

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

// Badge de admin y cerrar sesión
const AdminContainer = styled.div`
  position: fixed;
  bottom: 15px;
  right: 15px;
  text-align: right;
  z-index: 9999;
`;

const AdminBadge = styled.div`
  background-color: #184a8e;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  font-family: Arial, sans-serif;
`;

const LogoutButton = styled.button`
  margin-top: 8px;
  background-color: #b71c1c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarCerrarSesion, setMostrarCerrarSesion] = useState(false);

  useEffect(() => {
    const adminStatus =
      localStorage.getItem("isAdmin") === "true" ||
      sessionStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <HeaderWrapper>
        <Container>
          <Logo src="/ParisLogoInmo.png" alt="Logo Paris Inmobiliaria" />

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
            {isAdmin && (
              <NavbarItem>
                <NavbarLink to="/admin" onClick={() => setMenuOpen(false)}>Panel de Administración</NavbarLink>
              </NavbarItem>
            )}
          </NavbarMenu>
        </Container>
      </HeaderWrapper>

      {isAdmin && (
        <AdminContainer>
          <AdminBadge onClick={() => setMostrarCerrarSesion(!mostrarCerrarSesion)}>
            🛡️ Modo Administrador Activo
          </AdminBadge>
          {mostrarCerrarSesion && (
            <LogoutButton
              onClick={() => {
                localStorage.removeItem("isAdmin");
                sessionStorage.removeItem("isAdmin");
                window.location.reload();
              }}
            >
              Cerrar sesión
            </LogoutButton>
          )}
        </AdminContainer>
      )}
    </>
  );
};

export default Header;
