import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../firebase/authService';
import usePageTitle from '../hooks/usePageTitle';
import styles from './Login.module.css';

const Login = () => {
  usePageTitle("Iniciar Sesión");

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmail(username, password);

      if (result.success) {
        // Login correcto → mostrar modal de confirmación
        setAuthSuccess(true);
        setShowModal(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = (mantenerSesion) => {
    if (mantenerSesion) {
      localStorage.setItem("isAdmin", "true");
    } else {
      sessionStorage.setItem("isAdmin", "true");
    }

    localStorage.setItem(
      "welcomeMessage",
      "Ahora sos administrador y podés agregar propiedades"
    );

    setShowModal(false);

    // Navegar directamente al panel sin recargar la página
    navigate('/admin', { replace: true });
  };

  return (
    <div className={styles.wrapper}>
      {/* Fondo y ambientación */}
      <div className={styles.ambientGrid} />
      <div className={styles.glowOrb} />

      {/* Tarjeta de Formulario Principal */}
      <div className={styles.formCard}>
        <div className={styles.logoWrapper}>
          <img 
            src="/logoINMOsinFondo_cropped.png" 
            alt="Paris Negocios Inmobiliarios" 
            className={styles.logo}
          />
        </div>

        <h2 className={styles.title}>Iniciar Sesión</h2>
        <p className={styles.subtitle}>Solo emails autorizados pueden acceder</p>

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-email">Correo Electrónico</label>
            <div className={styles.inputWrapper}>
              <input
                id="login-email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@paris.com"
                className={styles.input}
                required
                autoFocus
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-password">Contraseña</label>
            <div className={styles.inputWrapper}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} /> Iniciando...
              </>
            ) : (
              'Ingresar al Panel'
            )}
          </button>
        </form>
      </div>

      {/* Modal de confirmación de sesión */}
      {showModal && authSuccess && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalBadge}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            <h3 className={styles.modalQuestion}>
              ¿Querés mantener la sesión iniciada en este dispositivo?
            </h3>

            <div className={styles.modalButtons}>
              <button
                className={styles.confirmBtn}
                onClick={() => handleConfirm(true)}
              >
                Sí, recordar
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => handleConfirm(false)}
              >
                No, solo esta sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
