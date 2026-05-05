import { Link } from "react-router-dom";

const BlogItem = ({ property }) => {
  return (
    <div className="blog-item">
      <img
        src={property.images?.[0] || "https://via.placeholder.com/300"}
        alt={property.title}
        className="property-img"
      />
      <h3>
        <Link to={`/blog/${property.id}`}>{property.title}</Link>
      </h3>
      <p><strong>Ubicación:</strong> {property.location}</p>
      <p><strong>Metros:</strong> {property.price}</p>
    </div>
  );
};

export default BlogItem;
