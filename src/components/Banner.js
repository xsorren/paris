import banner from "../banner.jpg"

const Banner = () => {
    return (
        <div className="banner d-flex align-items-center" style={{ backgroundImage: `url(${banner})` }}>
            <div className="bg-custom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mx-auto">
                            <div className="banner-area text-center pt-4 pb-4">
                                <h2 className="mt-2 mb-4 banner-title"><strong>Paris Negocios Inmobiliarios</strong> </h2>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;