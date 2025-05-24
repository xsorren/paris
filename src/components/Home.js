import React from "react";
import Banner from "./Banner";
import Info from "./Info";
import FlatList from "./FlatList";
import TeamList from "./TeamList";
import References from "./References";
import Subscribe from "./Subscribe";
import Map from "./Map";

const Home = () => {
    return (
        <React.Fragment>
            <Banner />
            <Info />
            <Map />
        </React.Fragment>
    );
};

export default Home;
