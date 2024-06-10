import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

const Info = () => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px', 
    flexDirection: 'column'
  };

  return (
    <div className="row" style={style}>
      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-4">
            <div className="contact-item text-center">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
              <h5>Mail</h5>
              <h6>info@info.com</h6>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="contact-item text-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
              <h5>Address</h5>
              <h6>Lorem Ipsum</h6>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="contact-item text-center">
              <FontAwesomeIcon icon={faPhoneAlt} size="2x" />
              <h5>Phone</h5>
              <h6>00000000000</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
