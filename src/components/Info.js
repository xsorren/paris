import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

const Info = () => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px', 
    flexDirection: 'column',
    color: '#012161'
  };

  return (
    <div className="row" style={style}>
      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-4">
            <div className="contact-item text-center">
            <FontAwesomeIcon icon={faUsers} size="2x" />
              <h5>Tasaciones y Asesoramientos</h5>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="contact-item text-center">
              <FontAwesomeIcon icon={faBuilding} size="2x" />
              <h5>Casa, Lotes y mas </h5>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="contact-item text-center">
              <FontAwesomeIcon icon={faMoneyBillAlt} size="2x" />
              <h5>El mejor precio para vos</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
