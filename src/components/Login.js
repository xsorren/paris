import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../firebase/authService';
import usePageTitle from '../hooks/usePageTitle';

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
    <div style={styles.wrapper}>
      <div style={styles.form}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <p style={styles.subtitle}>Solo emails autorizados pueden acceder</p>
        {error && (
          <div style={styles.errorMessage}>{error}</div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "12px" }}>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email"
              style={styles.input}
              required
            />
          </div>

          <div style={{ position: 'relative', width: '100%', marginBottom: "16px" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{
                ...styles.input,
                paddingRight: "44px",
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...styles.emailButton }}
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Ingresar con Email'}
          </button>
        </form>
      </div>

      {/* Modal personalizado */}
      {showModal && authSuccess && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: "15px" }}>
              ¿Querés mantener la sesión iniciada en este dispositivo?
            </h3>
            <div style={styles.modalButtons}>
              <button
                style={styles.confirmBtn}
                onClick={() => handleConfirm(true)}
              >
                Sí
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => handleConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  form: {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    minWidth: '350px',
    maxWidth: '400px',
  },
  title: {
    color: "#0b1f44",
    marginBottom: "10px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666",
    marginBottom: "25px",
    fontSize: "14px",
  },
  errorMessage: {
    background: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid #ffcdd2",
  },
  input: {
    padding: "12px 15px",
    width: '100%',
    fontSize: "16px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
  button: {
    marginTop: "10px",
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  emailButton: {
    backgroundColor: "#0b1f44",
    color: "#fff",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  confirmBtn: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "#b71c1c",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  }
};

export default Login;
