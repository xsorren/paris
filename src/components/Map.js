import React from "react";

const Map = () => {
  return (
    <div style={styles.container}>
      <iframe
        title="Ubicación París Negocios Inmobiliarios"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1634.1209588492086!2d-59.27322653529531!3d-35.00064884135128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc510067216373%3A0x989eb074f39b3bcd!2sParis%20Negocios%20Inmobiliarios!5e0!3m2!1ses-419!2sar!4v1785451024795!5m2!1ses-419!2sar"
        width="100%"
        height="450"
        style={{ border: 0, width: "100%", height: "450px", display: "block" }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    margin: "0 auto",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
};

export default Map;
