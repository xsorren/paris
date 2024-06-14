import Sidebar from "./Sidebar";

const BlogDetail = () => {
    // Datos de la casa
    const casa = {
        tipo: 'Casa en Venta',
        ubicacion: 'Ciudad, País',
        metros: 200,
        habitaciones: 4,
        banos: 3,
        garajes: 2,
        descripcion: 'Esta hermosa casa en venta se encuentra ubicada en una zona residencial tranquila. Con 200 metros cuadrados de espacio habitable, cuenta con 4 habitaciones amplias, 3 baños completos, y 2 plazas de garaje. Ideal para familias que buscan comodidad y accesibilidad.'
    };

    return (
        <div className="container mt-4 mb-4">
            <div className="row">
                <div className="col-lg-8 order-lg-1">
                    <div className="blog-detail">
                        <img className="w-100" src="/img/product1.jpeg" alt="product" />
                        <span className="blog-detail-category">{casa.tipo}</span>
                        <h1 className="blog-detail-title">Casa en Venta - {casa.ubicacion}</h1>
                        <span className="blog-detail-date">Publicado el 13 de junio de 2024</span>
                        <p className="blog-detail-content">
                            {casa.descripcion}
                        </p>
                        <div className="caracteristicas">
                            <h3>Características de la Casa</h3>
                            <ul>
                                <li><strong>Ubicación:</strong> {casa.ubicacion}</li>
                                <li><strong>Metros cuadrados:</strong> {casa.metros} m²</li>
                                <li><strong>Habitaciones:</strong> {casa.habitaciones}</li>
                                <li><strong>Baños:</strong> {casa.banos}</li>
                                <li><strong>Garajes:</strong> {casa.garajes}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 order-lg-2">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
