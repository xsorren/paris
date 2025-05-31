import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "inmoParis2024") {
      setAuthSuccess(true);
      setShowModal(true); // Mostrar el modal de confirmación
    } else {
      alert("Usuario o contraseña incorrectos.");
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
  window.location.reload(); // 👈 esto soluciona que el Header lo reconozca
};


  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Usuario"
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Ingresar</button>
      </form>

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
  },
  form: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "10px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  input: {
    margin: 10,
    padding: 12,
    width: '100%',
    minWidth: '250px',
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: 15,
    padding: '10px 25px',
    fontSize: "16px",
    backgroundColor: "#0b1f44",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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
