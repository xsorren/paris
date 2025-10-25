import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../firebase/authService';
import usePageTitle from '../hooks/usePageTitle';
import styled from 'styled-components';

// Estilos
const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-light);
  padding: var(--space-xl);
`;

const LoginForm = styled.div`
  background: var(--bg-white);
  padding: var(--space-xxl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h2`
  color: var(--primary);
  margin-bottom: var(--space-m);
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  text-align: center;
`;

const LoginSubtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  font-size: var(--font-sm);
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: var(--error);
  padding: var(--space-l);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-l);
  font-size: var(--font-sm);
  border-left: 4px solid var(--error);
`;

const FormGroup = styled.div`
  margin-bottom: var(--space-l);
`;

const LoginInput = styled.input`
  width: 100%;
  padding: var(--space-m) var(--space-l);
  font-size: var(--font-base);
  border-radius: var(--radius-sm);
  border: 1px solid #ddd;
  background-color: var(--bg-white);
  transition: all var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(1, 33, 97, 0.1);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: var(--space-m) var(--space-l);
  margin-top: var(--space-l);
  font-size: var(--font-base);
  font-weight: var(--font-bold);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  background-color: var(--primary);
  color: white;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background-color: var(--primary-light);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  margin: var(--space-xl) 0;
  position: relative;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #eee;
  }
`;

const DividerText = styled.span`
  background: var(--bg-white);
  padding: 0 var(--space-m);
  color: var(--text-muted);
  font-size: var(--font-sm);
  position: relative;
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal);
`;

const Modal = styled.div`
  background: var(--bg-white);
  padding: var(--space-xxl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: var(--primary);
  margin-bottom: var(--space-xl);
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
`;

const ModalButtons = styled.div`
  display: flex;
  gap: var(--space-l);
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: var(--space-m) var(--space-xl);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: var(--font-bold);
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const ConfirmBtn = styled(ModalButton)`
  background-color: var(--success);
  color: white;

  &:hover {
    background-color: #0d8a31;
  }
`;

const CancelBtn = styled(ModalButton)`
  background-color: var(--error);
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;

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
    <LoginWrapper>
      <LoginForm>
        <LoginTitle>Iniciar Sesión</LoginTitle>
        <LoginSubtitle>Solo emails autorizados pueden acceder</LoginSubtitle>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <form onSubmit={handleLogin}>
          <FormGroup>
            <LoginInput
              type="email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </FormGroup>
          <FormGroup>
            <LoginInput
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </FormGroup>
          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Iniciando...' : 'Ingresar'}
          </LoginButton>
        </form>
        <Divider>
          <DividerText>O</DividerText>
        </Divider>
      </LoginForm>

      {showModal && authSuccess && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>¿Mantener sesión iniciada?</ModalTitle>
            <ModalButtons>
              <ConfirmBtn onClick={() => handleConfirm(true)}>Sí</ConfirmBtn>
              <CancelBtn onClick={() => handleConfirm(false)}>No</CancelBtn>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </LoginWrapper>
  );
};

export default Login;
