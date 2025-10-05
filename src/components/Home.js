import React from "react";
import Banner from "./Banner";
import Info from "./Info";
import FlatList from "./FlatList";
import TeamList from "./TeamList";
import References from "./References";
import Subscribe from "./Subscribe";
import Map from "./Map";
import usePageTitle from "../hooks/usePageTitle";

const Home = () => {
    usePageTitle("Inicio");
    
    return (
        <React.Fragment>
            <Banner />
            <Info />
            <Map />
        </React.Fragment>
    );
};

export default Home;
