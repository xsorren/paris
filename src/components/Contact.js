import usePageTitle from "../hooks/usePageTitle";
import emailjs from "emailjs-com";
import { useRef } from "react";

const Contact = () => {
  usePageTitle("Contacto");
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "TU_SERVICE_ID",       // 🔹 Reemplazá con tu Service ID de EmailJS
        "TU_TEMPLATE_ID",      // 🔹 Reemplazá con tu Template ID de EmailJS
        formRef.current,
        "TU_PUBLIC_KEY"        // 🔹 Reemplazá con tu Public Key de EmailJS
      )
      .then(
        () => {
          alert("✅ Mensaje enviado correctamente");
          e.target.reset();
        },
        (error) => {
          console.error("Error al enviar:", error);
          alert("❌ Hubo un error al enviar el mensaje. Intentá nuevamente.");
        }
      );
  };

  return (
    <section style={styles.section}>
      <div style={styles.pageTop}>
        <h1 style={styles.pagetitle}>Contacto</h1>
      </div>

      <div style={styles.container}>
        {/* Información de contacto */}
        <div style={styles.contactGrid}>
          <div style={styles.contactItem}>
            <i className="fas fa-envelope" style={styles.icon}></i>
            <h4>Mail</h4>
            <p>facuperalta1234@gmail.com</p>
          </div>
          <div style={styles.contactItem}>
            <i className="fas fa-map-marker-alt" style={styles.icon}></i>
            <h4>Ubicación</h4>
            <p>Calle 28 N°917, Navarro, Buenos Aires</p>
          </div>
          <div style={styles.contactItem}>
            <i className="fas fa-phone-alt" style={styles.icon}></i>
            <h4>Teléfono</h4>
            <p>2227-535057</p>
          </div>
        </div>

        {/* Formulario */}
        <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label>Nombre y Apellido</label>
              <input
                type="text"
                name="user_name"
                style={styles.input}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Teléfono</label>
              <input
                type="text"
                name="user_phone"
                style={styles.input}
                placeholder="Ej: 2227-XXXXXX"
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label>Asunto</label>
            <input
              type="text"
              name="subject"
              style={styles.input}
              placeholder="Consulta sobre propiedad..."
            />
          </div>
          <div style={styles.formGroup}>
            <label>Mensaje</label>
            <textarea
              rows="4"
              name="message"
              style={styles.textarea}
              placeholder="Escriba su mensaje aquí..."
              required
            ></textarea>
          </div>
          <button type="submit" style={styles.button}>
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

const styles = {
  section: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    padding: "40px 20px",
  },
  pageTop: {
    textAlign: "center",
    marginBottom: "40px",
  },
  pagetitle: {
    fontSize: "36px",
    color: "#333",
    margin: 0,
    borderBottom: "2px solid #ccc",
    display: "inline-block",
    paddingBottom: "10px",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  contactGrid: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "50px",
  },
  contactItem: {
    flex: "1 1 30%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  icon: {
    fontSize: "24px",
    color: "#2a6ebd",
    marginBottom: "10px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  formRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  formGroup: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
    resize: "vertical",
  },
  button: {
    marginTop: "20px",
    backgroundColor: "#012161",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default Contact;
