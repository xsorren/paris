const About = () => {
    return (
        <section className="about">
            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <img src={"/img/LOGOINMO.jpeg"} alt="product" className="w-100" />
                        </div>
                        <div className="col-lg-6">
                            <div className="about-item">
                                <div className="title">
                                    Paris Negocios Inmobiliarios
                            </div>
                                <div className="about-text">
                                Somos una inmobiliaria comprometida con ofrecerte las mejores propiedades y servicios. Nuestro equipo de expertos está dedicado a ayudarte a encontrar la casa de tus sueños o la inversión perfecta.
                                Con años de experiencia en el mercado, nos enorgullece brindar un servicio personalizado y de alta calidad. Nuestro objetivo es superar tus expectativas y garantizar tu satisfacción en cada paso del proceso inmobiliario.
                            </div>
                                <div className="about-features">
                                    <p className="about-feature"><i className="fas fa-long-arrow-alt-right"></i> Claudio Paris</p>
                                    <p className="about-feature" ><i className="fas fa-long-arrow-alt-right"></i> Asesoramiento Inmobiliario</p>
                                    <p className="about-feature"><i className="fas fa-long-arrow-alt-right"></i> Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About