import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {
    return (
        <aside>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title" style={{marginBottom:12,textAlign:'center'}}>Contacto</h3>
                    <form>
                        <label className="label">Nombre y Apellido</label>
                        <input type="text" className="form-control" />
                        <label className="label">Teléfono</label>
                        <input type="text" className="form-control" />
                        <label className="label">Asunto</label>
                        <input type="text" className="form-control" />
                        <label className="label">Mensaje</label>
                        <textarea rows="4" className="textarea"></textarea>
                        <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:10}}>Enviar</button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 12 }}>
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
        </aside>
    );
};

export default Sidebar;
