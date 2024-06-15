import { Link } from "react-router-dom"

const BlogItem = ({ title, link }) => {
    return (
        <div className="col-lg-4">
            <div className="blog-item">
                <div className="blog-img">
                    <img src="/img/product1.jpeg" alt="product" className="w-100" />
                </div>
                <div className="blog-content">
                    <h2 className="blog-title"><Link to={`/blog/${link}`}>{title}</Link></h2>
                    <div className="blog-info">
                    </div>
                    <div className="blog-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogItem