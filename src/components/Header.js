import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Estilos
const HeaderWrapper = styled.header`
  background-color: var(--primary);
  box-shadow: var(--shadow-sm);
  padding: var(--space-s) var(--space-xl);
  position: sticky;
  top: 0;
  z-index: var(--z-header);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 60px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.15));
  transition: all var(--transition-fast);

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    height: 50px;
  }
`;

const NavbarMenu = styled.ul`
  display: flex;
  gap: var(--space-xl);
  list-style: none;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: ${({ open }) => (open ? "0" : "-100%")};
    background-color: var(--primary);
    height: calc(100vh - 60px);
    width: 250px;
    flex-direction: column;
    padding: var(--space-xl) var(--space-l);
    transition: right var(--transition-base);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  }
`;

const NavbarItem = styled.li``;

const NavbarLink = styled(Link)`
  text-decoration: none;
  color: #f0f0f0;
  font-weight: var(--font-bold);
  font-size: var(--font-sm);
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--primary-light);
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: var(--font-base);
    padding: var(--space-m) var(--space-s);
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: var(--space-s);

  span {
    height: 2px;
    width: 24px;
    background: #f0f0f0;
    border-radius: 2px;
    transition: all var(--transition-fast);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

// Badge de admin y cerrar sesión
const AdminContainer = styled.div`
  position: fixed;
  bottom: var(--space-l);
  right: var(--space-l);
  text-align: right;
  z-index: var(--z-modal);
`;

const AdminBadge = styled.div`
  background-color: var(--primary-light);
  color: white;
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--primary);
  }
`;

const LogoutButton = styled.button`
  margin-top: var(--space-s);
  background-color: var(--error);
  color: white;
  border: none;
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: var(--font-bold);
  font-size: var(--font-xs);
  transition: all var(--transition-fast);

  &:hover {
    background-color: #c82333;
  }
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
          <Logo src="/imageLogo.png" alt="Logo Paris Inmobiliaria" />

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
