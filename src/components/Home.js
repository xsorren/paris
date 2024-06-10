import FlatList from "./FlatList"
import Banner from "./Banner"
import React from "react"
import TeamList from "./TeamList"
import References from "./References"
import Subscribe from "./Subscribe"
import Map from "./Map"
import Info from "./Info"

const Home=()=>{
    return (
        <React.Fragment>
            <Banner/>
            <Info />    
            <Subscribe/>
            <Map />
        </React.Fragment>
    )
}

export default Home;