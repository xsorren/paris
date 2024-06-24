import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_gmmagig', 'template_v0idr8a', form.current, '2AntrPYn0iA2iDL3R')
      .then((result) => {
        console.log(result.text);
        toast.success('Se envió su mail a Paris Negocios Inmobiliarios.');
      }, (error) => {
        console.log(error.text);
        toast.error('Hubo un error al enviar su mail.');
      });
  };

  return (
    <section className="contact">
      <div className="page-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-title">Contacto</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row mt-5">
                <form ref={form} onSubmit={sendEmail}>
                  <div className="col-lg-6">
                    <label>Nombre y Apellido</label>
                    <input type="text" name="user_name" className="inp-contact" />
                  </div>
                  <div className="col-lg-6">
                    <label>Teléfono</label>
                    <input type="text" name="user_phone" className="inp-contact" />
                  </div>
                  <div className="col-lg-12">
                    <label>Asunto</label>
                    <input type="text" name="subject" className="inp-contact" />
                  </div>
                  <div className="col-lg-12">
                    <label>Mensaje</label>
                    <textarea name="message" className="ta-contact" rows="4"></textarea>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn-contact">Enviar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
};

export default Contact;
