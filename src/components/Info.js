import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

const Item = ({ icon, title, text }) => (
  <div className="card" style={{textAlign:'center'}}>
    <div className="card-body">
      <div style={{color:'var(--primary)',marginBottom:8}}>
        <FontAwesomeIcon icon={icon} size="2x" />
      </div>
      <h5 style={{margin:0}}>{title}</h5>
      <p className="card-sub" style={{marginTop:8}}>{text}</p>
    </div>
  </div>
);

const Info = () => {
  return (
    <section>
      <div className="container-narrow">
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
          <Item icon={faUsers} title={process.env.REACT_APP_INFO_SERVICE_1 || 'Servicio profesional'} text="Tasaciones y asesoramiento" />
          <Item icon={faBuilding} title={process.env.REACT_APP_INFO_SERVICE_2 || 'Amplio catálogo'} text="Casas, Departamentos, lotes y más" />
          <Item icon={faMoneyBillAlt} title={process.env.REACT_APP_INFO_SERVICE_3 || 'Cobertura regional'} text="Propiedades en Navarro y alrededores" />
        </div>
      </div>
    </section>
  );
};

export default Info;
