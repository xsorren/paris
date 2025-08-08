const About = () => {
    return (
        <section>
            <div className="container-narrow">
                <h1 className="title-xl">Sobre nosotros</h1>
                <div className="title-underline" />

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24,alignItems:'center'}}>
                    <div className="card" style={{textAlign:'center'}}>
                        <img src="/logoINMO.JPG" alt="Paris Negocios Inmobiliarios" className="card-image" style={{height:380,objectFit:'contain'}} />
                    </div>
                    <div>
                        <h2 style={{fontSize:'1.8rem',marginTop:0,color:'var(--text)'}}>Paris Negocios Inmobiliarios</h2>
                        <p style={{fontSize:'1.05rem',lineHeight:1.7,color:'var(--muted)'}}>
                            Somos una inmobiliaria comprometida con ofrecerte las mejores propiedades y servicios. Nuestro equipo está dedicado a ayudarte a encontrar la casa de tus sueños o la inversión perfecta. Con años de experiencia en el mercado, brindamos un servicio personalizado y de alta calidad.
                        </p>
                        <div style={{marginTop:16}}>
                            <p style={{color:'var(--text)',marginBottom:8}}><i className="fas fa-long-arrow-alt-right" style={{marginRight:8,color:'var(--primary)'}}></i> Claudio Paris</p>
                            <p style={{color:'var(--text)',marginBottom:8}}><i className="fas fa-long-arrow-alt-right" style={{marginRight:8,color:'var(--primary)'}}></i> Asesoramiento Inmobiliario</p>
                            <p style={{color:'var(--text)',marginBottom:8}}><i className="fas fa-long-arrow-alt-right" style={{marginRight:8,color:'var(--primary)'}}></i> Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
