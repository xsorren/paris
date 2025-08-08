import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

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
    <footer style={{background:'#012161', color:'#fff', padding:'40px 20px'}}>
      <div className="container-narrow" style={{display:'flex',flexWrap:'wrap',gap:24,justifyContent:'space-between'}}>
        <div style={{flex:'1 1 320px'}}>
          <h4 style={{fontWeight:700,fontSize:22,color:'#ffc107',borderBottom:'2px solid #ffc107',width:'fit-content',paddingBottom:5,marginTop:0}}>Sobre Nosotros</h4>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <FontAwesomeIcon
              icon={faUserTie}
              size="2x"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={() => navigate('/login')}
              style={{ cursor: 'default', color: '#ffc107', marginTop: '4px' }}
            />
            <ul style={{listStyle:'none',margin:0,padding:0,fontSize:15,color:'#f0f0f0'}}>
              <li style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}><i className="fas fa-user" /> Claudio Paris</li>
              <li style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}><i className="fas fa-briefcase" /> Asesor Inmobiliario</li>
              <li style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}><i className="fas fa-id-badge" /> Coleg. N° 4058 T°IX F°4058 - CMCPDJ Mercedes</li>
            </ul>
          </div>
          <div style={{display:'flex',gap:15,marginTop:10}}>
            <a href="mailto:parisnegociosinmobiliarios@gmail.com" title="Enviar mail" style={{color:'#fff',fontSize:20}}>
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href="https://www.instagram.com/parisnegociosinmobiliarios/" target="_blank" title="Instagram" style={{color:'#fff',fontSize:20}}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>

        <div style={{flex:'1 1 320px'}}>
          <h4 style={{fontWeight:700,fontSize:22,color:'#ffc107',borderBottom:'2px solid #ffc107',width:'fit-content',paddingBottom:5,marginTop:0}}>Contacto</h4>
          <ul style={{listStyle:'none',margin:0,padding:0,fontSize:15,color:'#f0f0f0'}}>
            <li style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}><i className="fas fa-clock" /> Horarios: 08:00–12:30 / 16:00–20:00</li>
            <li style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}><i className="fas fa-phone" /> Teléfono: 2227-535057</li>
            <li style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}><i className="fas fa-envelope" /> Email: parisnegociosinmobiliarios@gmail.com</li>
            <li style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}><i className="fas fa-map-marker-alt" /> Oficina: Calle 28 Nº917, Navarro, Buenos Aires</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
