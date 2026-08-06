// src/components/Maintenance/Maintenance.jsx
import React, { useState, useRef } from 'react';
import styles from './Maintenance.module.css';
import AdminLoginModal from './AdminLoginModal';
import ContactModal from './ContactModal';

const Maintenance = ({ onAdminLoginSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const pressTimer = useRef(null);

  // Easter Egg Exclusivo: Mantener presionado el punto de acento en el indicador de estado durante 2 segundos
  const handleDotMouseDown = () => {
    pressTimer.current = setTimeout(() => {
      setIsModalOpen(true);
    }, 2000);
  };

  const handleDotMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    if (onAdminLoginSuccess) {
      onAdminLoginSuccess();
    }
  };

  return (
    <div className={styles.viewport}>
      {/* Fondo y Orbes Ambientales */}
      <div className={styles.ambientGrid} />
      <div className={styles.glowOrb} />

      {/* Header con Logo */}
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <img 
            src="/logoINMOsinFondo_cropped.png" 
            alt="Paris Negocios Inmobiliarios" 
            className={styles.logo}
          />
        </div>
      </header>

      {/* Tarjeta de Contenido Principal Centrada */}
      <main className={styles.mainContainer}>
        <div className={styles.statusBadge}>
          <span 
            className={styles.statusDot}
            onMouseDown={handleDotMouseDown}
            onMouseUp={handleDotMouseUp}
            onTouchStart={handleDotMouseDown}
            onTouchEnd={handleDotMouseUp}
            title="Estado del servicio"
          />
          Actualización en curso
        </div>

        <h1 className={styles.title}>Estamos preparando algo mejor.</h1>

        <p className={styles.description}>
          Estamos realizando los últimos ajustes para brindarte la mejor experiencia.
          <span className={styles.highlightText}>
            Muy pronto podrás acceder a todas nuestras propiedades.
          </span>
          <br />
          Gracias por tu paciencia.
        </p>

        {/* Indicador de Carga Minimalista */}
        <div className={styles.loaderContainer} aria-hidden="true">
          <span className={styles.loaderDot} />
          <span className={styles.loaderDot} />
          <span className={styles.loaderDot} />
        </div>

        {/* Contacto Sutil */}
        <div className={styles.contactSection}>
          <span className={styles.contactLabel}>¿Necesitás comunicarte con nosotros?</span>
          <button 
            className={styles.contactLink}
            onClick={() => setIsContactOpen(true)}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Contactanos
          </button>
        </div>
      </main>

      {/* Footer Discreto con Crédito a Desarrollador */}
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} Paris Negocios Inmobiliarios. Desarrollado por{' '}
          <a 
            href="https://studio--studio-2931549742-72d7c.us-central1.hosted.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.developerLink}
          >
            FALTRA STUDIO
          </a>
        </span>
      </footer>

      {/* Modal de Contacto con todas las vías */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Modal de Inicio de Sesión de Admin (Firebase Auth) */}
      <AdminLoginModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Maintenance;
