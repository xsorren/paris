const Info = () => {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-4">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <h5>Mail</h5>
              <h6>info@info.com</h6>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <h5>Address</h5>
              <h6>Lorem Ipsum</h6>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="contact-item">
              <i className="fas fa-phone-alt"></i>
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
