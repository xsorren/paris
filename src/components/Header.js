import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="header">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <Link to="/">
                            <div style={{padding:8}}>
                                <img src={"/img/LOGOINMO.png"} style={{maxHeight:70}}alt="Logo" /> 
                            </div>
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Inicio</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/blog">Nuestras Propiedades</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/about">Sobre Nosotros</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/contact">Contactos</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Header;
