import BlogItem from "./BlogItem"

const Blog = () => {
    let propiedades = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return (
        <section className="blog">
            <div className="page-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="page-title">Blog</h1>
                            <h2 className="page-description">Blog</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-content">
                <div className="container">
                    <div className="row">
                        {propiedades.map((e) => (
                            
                            <BlogItem link="blog-1" title={e} />

                        ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Blog