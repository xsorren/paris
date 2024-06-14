import { faEnvelope, faPhone, fainstagram, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {
    return (
        <div >
            <div className="right-sidebar">
                <div className="widget-contact">
                    <section className="contact" style={{ width: '100%' }}>
                        <div className="page-content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12" >
                                        <h2 style={{ textAlign: 'center' }}>Contacto</h2>
                                        <div className="row mt-5">
                                            <div className="col-lg-12">
                                                <label>Nombre y Apellido</label>
                                                <input type="text" className="inp-contact" style={{ width: '100%' }} />
                                            </div>
                                            <div className="col-lg-12">
                                                <label>Teléfono</label>
                                                <input type="text" className="inp-contact" style={{ width: '100%' }} />
                                            </div>
                                            <div className="col-lg-12">
                                                <label>Asunto</label>
                                                <input type="text" className="inp-contact" style={{ width: '100%' }} />
                                            </div>
                                            <div className="col-lg-12">
                                                <label>Mensaje</label>
                                                <textarea className="ta-contact" rows="4" style={{ width: '100%' }}></textarea>
                                            </div>
                                            <div className="col-lg-12">
                                                <button className="btn-contact" style={{ width: '100%' }}>Enviar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
    <a href="https://www.instagram.com/tuusuario" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="icon IgIcon">
            <i className="fab fa-instagram"></i>
        </div>
    </a>
    <a href="mailto:tuemail@dominio.com" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="icon">
            <FontAwesomeIcon icon={faEnvelope} />
        </div>
    </a>
    <a href="tel:+1234567890" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="icon">
            <FontAwesomeIcon icon={faPhone} />
        </div>
    </a>
</div>


                </div>
            </div>
    );
};

export default Sidebar;
