import { useEffect, useState } from "react";
import banner from "../banner.jpg";

const Banner = () => {
    return (
        <section style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '80px 0'
        }}>
            <div className="container-narrow" style={{textAlign:'center'}}>
                <h2 className="title-xl" style={{color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,.35)'}}>Paris Negocios Inmobiliarios</h2>
                <div className="title-underline" />
            </div>
        </section>
    );
};

export default Banner;