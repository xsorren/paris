import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../firebase/authService';
import usePageTitle from '../hooks/usePageTitle';

const Login = () => {
  usePageTitle("Iniciar Sesión");
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      // Intentar autenticación con email y contraseña
      const result = await signInWithEmail(username, password);
      
      if (result.success) {
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
    localStorage.setItem("welcomeMessage", "Ahora sos administrador y podés agregar propiedades");
    setShowModal(false);
    navigate('/admin');
    window.location.reload();
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
          <input
            type="email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Email"
            style={styles.input}
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            style={styles.input}
            required
          />
          <button 
            type="submit" 
            style={{...styles.button, ...styles.emailButton}}
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Ingresar con Email'}
          </button>
        </form>
        <div style={styles.divider}>
          <span style={styles.dividerText}>O</span>
        </div>
      </div>
      {/* Modal personalizado */}
      {showModal && authSuccess && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: "15px" }}>¿Querés mantener la sesión iniciada en este dispositivo?</h3>
            <div style={styles.modalButtons}>
              <button style={styles.confirmBtn} onClick={() => handleConfirm(true)}>Sí</button>
              <button style={styles.cancelBtn} onClick={() => handleConfirm(false)}>No</button>
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
    margin: "8px 0",
    padding: "12px 15px",
    width: '100%',
    fontSize: "16px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
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
  googleButton: {
    backgroundColor: "#fff",
    color: "#333",
    border: "2px solid #e0e0e0",
  },
  divider: {
    margin: "20px 0",
    position: "relative",
    textAlign: "center",
  },
  dividerText: {
    background: "#fff",
    padding: "0 15px",
    color: "#666",
    fontSize: "14px",
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
