import usePageTitle from "../hooks/usePageTitle";
import emailjs from "emailjs-com";
import { useRef, useState, useEffect } from "react";
import styled from "styled-components";

// Estilos
const ContactSection = styled.section`
  background-color: var(--bg-white);
  padding: var(--space-xxxl) var(--space-xl);
`;

const PageTop = styled.div`
  text-align: center;
  margin-bottom: var(--space-xxl);
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: var(--space-xl);
`;

const PageTitle = styled.h1`
  font-size: var(--font-xxl);
  color: var(--primary);
  margin: 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-xxxl);

  @media (max-width: 768px) {
    gap: var(--space-l);
  }
`;

const ContactItem = styled.div`
  background-color: var(--bg-white);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  h4 {
    color: var(--primary);
    margin-bottom: var(--space-s);
    font-size: var(--font-lg);
  }

  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: var(--font-sm);
  }
`;

const ContactIcon = styled.i`
  font-size: 32px;
  color: var(--primary);
  margin-bottom: var(--space-l);
  display: block;
`;

const ContactForm = styled.form`
  background-color: var(--bg-light);
  padding: var(--space-xxl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-l);
  margin-bottom: var(--space-l);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: var(--font-bold);
    color: var(--primary);
    margin-bottom: var(--space-s);
    font-size: var(--font-sm);
  }
`;

const FormInput = styled.input`
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

const FormTextarea = styled.textarea`
  padding: var(--space-m) var(--space-l);
  font-size: var(--font-base);
  border-radius: var(--radius-sm);
  border: 1px solid #ddd;
  background-color: var(--bg-white);
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(1, 33, 97, 0.1);
  }
`;

const SubmitButton = styled.button`
  margin-top: var(--space-xl);
  padding: var(--space-m) var(--space-xl);
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-base);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;

  &:hover {
    background-color: var(--primary-light);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Message = styled.div`
  margin-bottom: var(--space-m);
  padding: var(--space-m);
  border-radius: var(--radius-sm);
  font-weight: var(--font-bold);
  font-size: var(--font-sm);
  &.success {
    background: #e6ffef;
    color: #0a7a3d;
    border: 1px solid #b7f0c9;
  }
  &.error {
    background: #fff1f0;
    color: #a4262c;
    border: 1px solid #f5c2c0;
  }
  &.sending {
    background: #f0f7ff;
    color: #004b8d;
    border: 1px solid #cfe6ff;
  }
`;

const Contact = () => {
  usePageTitle("Contacto");
  const formRef = useRef();
  // Estado para feedback de usuario
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Leer variables de entorno (create-react-app espera REACT_APP_ prefix)
  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "";
  const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "";
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "";

  // Inicializar emailjs (opcional)
  useEffect(() => {
    if (PUBLIC_KEY && emailjs && typeof emailjs.init === "function") {
      try {
        emailjs.init(PUBLIC_KEY);
      } catch (err) {
        // ignore init errors
      }
    }
  }, [PUBLIC_KEY]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!SERVICE_ID || !TEMPLATE_ID) {
      setErrorMsg(
        "Faltan variables de entorno para EmailJS. Revisá .env y reiniciá el servidor."
      );
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY || undefined)
      .then(
        () => {
          setStatus("success");
          if (formRef.current) formRef.current.reset();
        },
        (error) => {
          console.error("Error al enviar (EmailJS):", error);
          setErrorMsg(
            error?.text || "Hubo un error al enviar el mensaje. Intentá nuevamente."
          );
          setStatus("error");
        }
      )
      .catch((err) => {
        console.error("Error inesperado al enviar:", err);
        setErrorMsg("Error inesperado. Intentá nuevamente más tarde.");
        setStatus("error");
      });
  };

  return (
    <ContactSection>
      <PageTop>
        <PageTitle>Contacto</PageTitle>
      </PageTop>

      <Container>
        {/* Información de contacto */}
        <ContactGrid>
          <ContactItem>
            <ContactIcon className="fas fa-envelope" />
            <h4>Mail</h4>
            <p>parisnegociosinmobiliarios@gmail.com</p>
          </ContactItem>
          <ContactItem>
            <ContactIcon className="fas fa-map-marker-alt" />
            <h4>Ubicación</h4>
            <p>Calle 28 N°917, Navarro, Buenos Aires</p>
          </ContactItem>
          <ContactItem>
            <ContactIcon className="fas fa-phone-alt" />
            <h4>Teléfono</h4>
            <p>2227-535057</p>
          </ContactItem>
        </ContactGrid>

        {/* Formulario */}
        <ContactForm ref={formRef} onSubmit={handleSubmit}>
          {status === "success" && (
            <Message className="success">✅ Mensaje enviado correctamente.</Message>
          )}
          {status === "error" && (
            <Message className="error">❌ {errorMsg}</Message>
          )}
          {status === "sending" && (
            <Message className="sending">Enviando mensaje...</Message>
          )}
          <FormRow>
            <FormGroup>
              <label>Nombre y Apellido</label>
              <FormInput
                type="text"
                name="user_name"
                placeholder="Ej: Juan Pérez"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Teléfono</label>
              <FormInput
                type="text"
                name="user_phone"
                placeholder="Ej: 2227-XXXXXX"
              />
            </FormGroup>
          </FormRow>
          <FormGroup style={{ marginBottom: 'var(--space-l)' }}>
            <label>Asunto</label>
            <FormInput
              type="text"
              name="subject"
              placeholder="Consulta sobre propiedad..."
            />
          </FormGroup>
          <FormGroup style={{ marginBottom: 'var(--space-xl)' }}>
            <label>Mensaje</label>
            <FormTextarea
              name="message"
              placeholder="Escriba su mensaje aquí..."
              required
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Enviando..." : "Enviar mensaje"}
          </SubmitButton>
        </ContactForm>
      </Container>
    </ContactSection>
  );
};

export default Contact;
