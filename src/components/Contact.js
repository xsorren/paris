const Contact = () => {
    return (
        <section>
            <div className="container-narrow">
                <h1 className="title-xl">Contacto</h1>
                <div className="title-underline" />

                <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16,marginBottom:24}}>
                    <div className="card" style={{textAlign:'center'}}>
                        <div className="card-body">
                            <i className="fas fa-envelope" style={{color:'var(--primary)'}} />
                            <h4 style={{margin:'8px 0 6px'}}>Mail</h4>
                            <p>parisnegociosinmobiliarios@gmail.com</p>
                        </div>
                    </div>
                    <div className="card" style={{textAlign:'center'}}>
                        <div className="card-body">
                            <i className="fas fa-map-marker-alt" style={{color:'var(--primary)'}} />
                            <h4 style={{margin:'8px 0 6px'}}>Ubicación</h4>
                            <p>Calle 28 N°917, Navarro, Buenos Aires</p>
                        </div>
                    </div>
                    <div className="card" style={{textAlign:'center'}}>
                        <div className="card-body">
                            <i className="fas fa-phone-alt" style={{color:'var(--primary)'}} />
                            <h4 style={{margin:'8px 0 6px'}}>Teléfono</h4>
                            <p>2227-535057</p>
                        </div>
                    </div>
                </div>

                <form className="form">
                    <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                        <div style={{flex:1,minWidth:260}}>
                            <label className="label">Nombre y Apellido</label>
                            <input type="text" className="form-control" placeholder="Ej: Juan Pérez" />
                        </div>
                        <div style={{flex:1,minWidth:260}}>
                            <label className="label">Teléfono</label>
                            <input type="text" className="form-control" placeholder="Ej: 2227-XXXXXX" />
                        </div>
                    </div>
                    <label className="label">Asunto</label>
                    <input type="text" className="form-control" placeholder="Consulta sobre propiedad..." />
                    <label className="label">Mensaje</label>
                    <textarea rows="4" className="textarea" placeholder="Escriba su mensaje aquí..."></textarea>
                    <button type="submit" className="btn btn-primary" style={{marginTop:12}}>Enviar mensaje</button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
