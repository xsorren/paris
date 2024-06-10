import React, { useState } from 'react';
import BlogItem from "./BlogItem";

const Blog = () => {
    const [selectedFilter, setSelectedFilter] = useState('');

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    let propiedades = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Defining inline styles
    const filterButtonStyle = {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: 'orange',
        cursor: 'pointer',
        margin: '0 5px',
        transition: 'all 0.3s ease'
    };

    const activeFilterButtonStyle = {
        ...filterButtonStyle,
        backgroundColor: '#007bff',
        color: '#ffffff'
    };

    return (
        <section className="blog">
            <div className="page-top">
                <div className="container">
                    <div className="filtros">
                        <div className="col-lg-12">
                            <h1 className="page-title">Blog</h1>
                            <h2 className="page-description">Blog</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-content">
                <div className="container">
                    <div className="filters">
                        <button style={selectedFilter === 'house' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('house')}>Casas</button>
                        <button style={selectedFilter === 'apartment' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('apartment')}>Departamentos</button>
                        <button style={selectedFilter === 'lot' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('lot')}>Lotes</button>
                        <button style={selectedFilter === 'commercial' ? activeFilterButtonStyle : filterButtonStyle} onClick={() => handleFilterChange('commercial')}>Locales</button>
                    </div>
                    <div className="row">
                        {propiedades.map((e) => (
                            <BlogItem key={e} link="blog-1" title={`Item ${e}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Blog;
