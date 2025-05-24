const About = () => {
    return (
        <section
            className="about"
            style={{
                padding: "40px 0",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
        >
            <div
                className="container"
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 20px"
                }}
            >
                <div
                    className="about-row"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "40px",
                        flexWrap: "nowrap" // EVITA que se apilen
                    }}
                >
                    {/* Logo a la izquierda */}
                    <div
                        style={{
                            flex: "0 0 45%",
                            textAlign: "center"
                        }}
                    >
                        <img
                            src="/logoINMO.JPG"
                            alt="Paris Negocios Inmobiliarios"
                            style={{
                                width: "150%",
                                maxWidth: "400px",
                                height: "650px",
                                borderRadius: "12px",
                                filter: "drop-shadow(3px 5px 6px rgba(0,0,0,0.4))",
                                objectFit: "contain"
                            }}
                        />
                    </div>

                    {/* Texto a la derecha */}
                    <div style={{ flex: "1" }}>
                        <h2
                            style={{
                                fontSize: "2rem",
                                fontWeight: "700",
                                marginBottom: "20px",
                                color: "#2c3e50"
                            }}
                        >
                            Paris Negocios Inmobiliarios
                        </h2>
                        <p
                            style={{
                                fontSize: "1.1rem",
                                lineHeight: "1.6",
                                color: "#555"
                            }}
                        >
                            Somos una inmobiliaria comprometida con ofrecerte las mejores propiedades y servicios. Nuestro equipo de expertos está dedicado a ayudarte a encontrar la casa de tus sueños o la inversión perfecta. Con años de experiencia en el mercado, nos enorgullece brindar un servicio personalizado y de alta calidad. Nuestro objetivo es superar tus expectativas y garantizar tu satisfacción en cada paso del proceso inmobiliario.
                        </p>
                        <div style={{ marginTop: "25px" }}>
                            <p style={{ color: "#34495e", marginBottom: "8px" }}>
                                <i className="fas fa-long-arrow-alt-right" style={{ marginRight: "8px", color: "#2980b9" }}></i>
                                Claudio Paris
                            </p>
                            <p style={{ color: "#34495e", marginBottom: "8px" }}>
                                <i className="fas fa-long-arrow-alt-right" style={{ marginRight: "8px", color: "#2980b9" }}></i>
                                Asesoramiento Inmobiliario
                            </p>
                            <p style={{ color: "#34495e", marginBottom: "8px" }}>
                                <i className="fas fa-long-arrow-alt-right" style={{ marginRight: "8px", color: "#2980b9" }}></i>
                                Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
