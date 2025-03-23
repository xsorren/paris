import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    const navigate = useNavigate();

    const timerRef = useRef(null);

    const handleMouseDown = () => {
        timerRef.current = setTimeout(() => {
            navigate('/login');
        }, 3000);
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
                            {process.env.REACT_APP_COMPANY_NAME}
                        </span>
                        <span className="footer-other-text d-block mt-3 mb-3">
                            {process.env.REACT_APP_COMPANY_ADVISOR}
                        </span>
                        <span className="footer-other-text d-block mt-3 mb-3">
                            {process.env.REACT_APP_COMPANY_REGISTRATION}
                        </span>
                        <div className="footer-social">
                            <div className="footer-social-item">
                                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                            </div>
                            <div className="footer-social-item">
                                <i className="fab fa-instagram"></i>
                            </div>
                        </div>
                    </div>
                
                    <div className="col-lg-3 col-md-6">
                        <p className="footer-title">Contactos</p>
                        <ul className="footer-ul">
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-clock"></i></div> 
                                <span>Horarios de Atención:</span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-clock"></i></div> 
                                <span>{process.env.REACT_APP_COMPANY_WORKING_HOURS}</span>
                            </li>
                            <li className="d-flex">
                                <div style={{ marginRight: 10 }} className="footer-info-item"><i className="fas fa-envelope"></i></div> 
                                <span>{process.env.REACT_APP_COMPANY_EMAIL}</span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-map-marker-alt"></i></div> 
                                <span>{process.env.REACT_APP_COMPANY_ADDRESS}</span>
                            </li>
                            <li className="d-flex">
                                <div className="footer-info-item"><i className="fas fa-phone-alt"></i></div> 
                                <span>{process.env.REACT_APP_COMPANY_PHONE}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Footer;
