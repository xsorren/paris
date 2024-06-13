const Sidebar = () => {
    return (
        <div className="col-lg-4">
            <div className="right-sidebar">
                <div className="widget">
                    <div className="widget-content">
                        <input type="text" className="widget-search-inp" placeholder="Search" />
                    </div>
                </div>
                <div className="widget">
                    <section className="contact" style={{ width: '100%' }}>
                        <div className="page-content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row mt-5">
                                            <div className="col-lg-12">
                                                <label>Nombre y Apellido</label>
                                                <input type="text" className="inp-contact" style={{ width: '100%' }} />
                                            </div>
                                            <div className="col-lg-12">
                                                <label>Telefono</label>
                                                <input type="text" className="inp-contact" style={{ width: '100%' }} />
                                            </div>
                                            <div className="col-lg-12">
                                                <label>Asunto</label>
                                                <input type="text" className="inp-contact" style={{ width: '100%' }} />
                                            </div>
                                            <div className="col-lg-12">
                                                <label>Mensaje</label>
                                                <textarea className="ta-contact" rows="4" style={{ width: '100%' }}></textarea>
                                            </div>
                                            <div className="col-lg-12">
                                                <button className="btn-contact" style={{ width: '100%' }}>Enviar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
                <div className="widget">
                    <p className="widget-title">Title</p>
                    <div className="widget-content">
                    </div>
                </div>
                <div className="widget">
                    <p className="widget-title">Title</p>
                    <div className="widget-content">
                    </div>
                </div>
                <div className="widget">
                    <p className="widget-title">Title</p>
                    <div className="widget-content">
                    </div>
                </div>
                <div className="widget">
                    <p className="widget-title">Title</p>
                    <div className="widget-content">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar