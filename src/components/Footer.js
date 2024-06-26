import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    const history = useHistory();
    const timerRef = useRef(null);

    const handleMouseDown = () => {
        timerRef.current = setTimeout(() => {
            history.push('/login');
        }, 3000);  // 3 segundos antes de redirigir
    };

    const handleMouseUp = () => {
        clearTimeout(timerRef.current);
    };

    return (
        <section className="footer">
            <div className="container">
                <div className="row" style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div className="col-lg-3 col-md-6">
                        <FontAwesomeIcon icon={faUserTie} size="2x"
                            onMouseDown={handleMouseDown} 
                            onMouseUp={handleMouseUp} 
                            onMouseLeave={handleMouseUp}
                            style={{ cursor: 'default' }}  // No mostrar el cursor pointer
                        />
                        <span className="footer-other-text d-block mt-3 mb-3">
                            Paris Negocios Inmobiliarios
                        </span>
                        <span className="footer-other-text d-block mt-3 mb-3">
                            Asesoramiento Inmobiliario
                        </span>
                        <span className="footer-other-text d-block mt-3 mb-3">
                            Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes
                        </span>
                        <div className="footer-social">
                            <div className="footer-social-item"><FontAwesomeIcon icon={faEnvelope} size="lg" /></div>
                            <div className="footer-social-item"> <i className="fab fa-instagram"></i></div>
                        </div>
                    </div>
                
                    <div className="col-lg-3 col-md-6">
                        <p className="footer-title">Contactos</p>
                        <ul className="footer-ul">
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-clock"></i></div> <span>Horarios de Atencion:</span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-clock"></i></div> <span>08:00-13:00 - 15:00-19:00</span>
                            </li>
                            <li className="d-flex">
                                <div style={{ marginRight: 10 }} className="footer-info-item"><i className="fas fa-envelope"></i></div> <span>parisnegociosinmobiliarios@gmail.com</span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-map-marker-alt"></i></div> <span>calle 28 n°917, Navarro, Buenos Aires</span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-phone-alt"></i></div> <span>2227-535057</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Footer;
