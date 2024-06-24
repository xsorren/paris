import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <section className="footer">
            <div className="container">
                <div className="row" style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div className="col-lg-3 col-md-6">
                        <FontAwesomeIcon icon={faUserTie} size="2x" />
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
                            <a href="/Contact" style={{ textDecoration: 'none', color: 'inherit', marginRight: '10px' }}>
                                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                            </a>
                            <a href="https://www.instagram.com/parisnegociosinmobiliarios/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div>
                              <i className="fab fa-instagram"></i>
                            </div>
                            </a>
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
                                <div style={{marginRight: 10}} className="footer-info-item" ><i className="fas fa-envelope"></i></div> <span>parisnegociosinmobiliarios@gmail.com</span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-map-marker-alt"></i></div> <span> calle 28 n°917, Navarro, Buenos Aires </span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-phone-alt"></i></div> <span> 2227-535057</span>
                            </li>
                        </ul>
                    </div>
                    {/* <div className="col-lg-3 col-md-6">
                        <p className="footer-title">Subscribe</p>
                        <span className="footer-other-text">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore dolore magna
                        </span>
                        <div className="subscribe-area mb-2 mt-2">
                            <input type="text" placeholder="Email" className="inp-footer w-100" />
                        </div>
                        <button className="btn-subscribe">Subscribe</button>
                    </div> */}
                </div>
            </div>
        </section>
    );
}

export default Footer;
