const About = () => {
    return (
        <section className="about" style={{ padding: "40px 0", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div className="page-content">
                <div className="container" style={{ maxWidth: "1200px", margin: "auto" }}>
                    <div className="row" style={{ alignItems: "center", gap: "30px" }}>
                        <div className="col-lg-6" style={{ textAlign: "center" }}>
                            <img 
                                src="/logoINMO.png" 
                                alt="Paris Negocios Inmobiliarios" 
                                style={{ 
                                    width: "100%", 
                                    maxWidth: "450px", 
                                    height: "auto", 
                                    borderRadius: "12px", 
                                    filter: "drop-shadow(3px 5px 6px rgba(0,0,0,0.4))",
                                    objectFit: "contain",
                                    margin: "0 auto",
                                    display: "block"
                                }} 
                            />
                        </div>
                        <div className="col-lg-6" style={{ padding: "0 20px" }}>
                            <div className="about-item">
                                <div className="title" style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "20px", color: "#2c3e50" }}>
                                    Paris Negocios Inmobiliarios
                                </div>
                                <div className="about-text" style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#555" }}>
                                    Somos una inmobiliaria comprometida con ofrecerte las mejores propiedades y servicios. Nuestro equipo de expertos está dedicado a ayudarte a encontrar la casa de tus sueños o la inversión perfecta.
                                    Con años de experiencia en el mercado, nos enorgullece brindar un servicio personalizado y de alta calidad. Nuestro objetivo es superar tus expectativas y garantizar tu satisfacción en cada paso del proceso inmobiliario.
                                </div>
                                <div className="about-features" style={{ marginTop: "25px" }}>
                                    <p className="about-feature" style={{ fontSize: "1rem", marginBottom: "8px", color: "#34495e" }}>
                                        <i className="fas fa-long-arrow-alt-right" style={{ marginRight: "8px", color: "#2980b9" }}></i> Claudio Paris
                                    </p>
                                    <p className="about-feature" style={{ fontSize: "1rem", marginBottom: "8px", color: "#34495e" }}>
                                        <i className="fas fa-long-arrow-alt-right" style={{ marginRight: "8px", color: "#2980b9" }}></i> Asesoramiento Inmobiliario
                                    </p>
                                    <p className="about-feature" style={{ fontSize: "1rem", marginBottom: "8px", color: "#34495e" }}>
                                        <i className="fas fa-long-arrow-alt-right" style={{ marginRight: "8px", color: "#2980b9" }}></i> Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
