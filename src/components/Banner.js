const Banner = () => {
    return (
        <div className="banner d-flex align-items-center" style={{
            backgroundImage: "url('/FONDOPARIS.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            position: "relative"
        }}>
            <div className="bg-custom" style={{
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.78) 100%)",
                width: "100%",
                height: "100%"
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 mx-auto">
                            <div className="banner-area text-center py-4 py-md-5 px-2 px-sm-3">
                                <div className="banner-content" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 'clamp(12px, 2.5vh, 20px)'
                                }}>

                                    {/* Accent Badge */}
                                    {/* <span style={{
                                        textTransform: 'uppercase',
                                        letterSpacing: 'clamp(1.5px, 0.5vw, 3px)',
                                        fontSize: 'clamp(0.7rem, 2vw, 0.82rem)',
                                        fontWeight: '600',
                                        color: '#ea6d16',
                                        background: 'rgba(234, 109, 22, 0.12)',
                                        padding: '6px 14px',
                                        borderRadius: '50px',
                                        border: '1px solid rgba(234, 109, 22, 0.3)',
                                        display: 'inline-block',
                                        backdropFilter: 'blur(4px)',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                    }}>
                                        Garantía & Confianza
                                    </span> */}

                                    {/* Main Punchy Title */}
                                    <h1 className="banner-title" style={{
                                        fontSize: "clamp(1.3rem, 4.2vw, 2.5rem)",
                                        lineHeight: "1.3",
                                        fontWeight: "800",
                                        color: "#ffffff",
                                        letterSpacing: "-0.3px",
                                        textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                                        margin: "0",
                                        textAlign: "center",
                                        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word"
                                    }}>
                                        El negocio inmobiliario suele ser el negocio más importante en la vida de una persona, y es allí donde radica nuestra responsabilidad en brindar garantías en el tráfico jurídico, confianza y asesoramiento en todo lo que necesites
                                    </h1>

                                    {/* Elegant Divider */}
                                    <div style={{
                                        width: 'clamp(40px, 8vw, 60px)',
                                        height: '4px',
                                        background: '#ea6d16',
                                        borderRadius: '2px',
                                        margin: '2px 0'
                                    }}></div>

                                    {/* Professional Paragraph */}
                                    {/*  <p className="banner-subtitle" style={{
                                        fontSize: "clamp(0.88rem, 2.2vw, 1.15rem)",
                                        lineHeight: "1.65",
                                        fontWeight: "400",
                                        color: "rgba(255, 255, 255, 0.92)",
                                        maxWidth: "720px",
                                        margin: "0 auto",
                                        textAlign: "center",
                                        textShadow: "0 1px 4px rgba(0,0,0,0.25)"
                                    }}>
                                        Por ello, asumimos el compromiso de acompañarle con absoluta responsabilidad, garantizando la seguridad jurídica de su patrimonio y brindándole un asesoramiento integral en cada paso del camino.
                                    </p> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;