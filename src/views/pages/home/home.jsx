import "./home.css";
import React, { useState } from "react";
import Carousel from "../../../components/carousel";
import Collection from "../../../components/collection";
import HomeImg from "../../../assets/images/home.png";
import ItemImg from "../../../assets/images/item.png";

function Home() {
    const slides = [
        {
            id: 1,
            src: HomeImg,
            alt: "First slide"
        },
        {
            id: 2,
            src: ItemImg,
            alt: "Second slide"
        },
        {
            id: 3,
            src: HomeImg,
            alt: "Third slide"
        }
    ];

    const collections = [
        {
            id: 1,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 2,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 3,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 4,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 5,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 6,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 7,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 8,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 9,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        },
        {
            id: 10,
            name: "Quốc đảo chim",
            place: "Thiên đường Bảo Sơn - Hà Nội (11km)"
        }
    ];

return (
    <div className="home-content">
        <div className="home-content-1">
            <Carousel slideData={slides}></Carousel>
        </div>
        <div className="home-content-2">
            <div className="for-u-collection">
                <div className="title-collection">
                    <span>あなたに合った観光地</span>
                </div>
                <Collection collectionData={collections} itemsPerSlide={5} showIndicator={false}></Collection>
            </div>
            <div className="hot-collection">
                <div className="title-collection">
                    <span>最も人気のある観光地</span>
                </div>
                <Collection collectionData={collections} itemsPerSlide={5} showIndicator={false}></Collection>
            </div>
        </div>
    </div>
  );
}

export default Home;