import { Link } from "react-router-dom";

const BlogItem = ({ property }) => {
    return (
        <div className="col-lg-4">
            <div className="blog-item">
                <div className="blog-img">
                    <img src={property.images[0] || "/img/product1.jpeg"} alt={property.title} className="w-100" />
                </div>
                <div className="blog-content">
                    <h2 className="blog-title">
                        <Link to={{
                            pathname: `/blog/${property._id}`,
                            state: { property }
                        }}>
                            {property.title}
                        </Link>
                    </h2>
                    <div className="blog-info">
                        <div className="blog-info-item"><i className="far fa-calendar-alt"></i><span>20.10.2020</span></div>
                        <div className="blog-info-item"><i className="far fa-comments"></i><span>0 Comments</span></div>
                    </div>
                    <div className="blog-text">
                        {property.description.substring(0, 100)}...
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogItem;
