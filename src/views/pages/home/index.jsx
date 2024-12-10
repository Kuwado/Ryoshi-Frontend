import "./index.css";
import React, { useState, useEffect } from "react";
import Carousel from "../../../components/carousel";
import Collection from "../../../components/collection";
import HomeImg from "../../../assets/images/home.png";
import ItemImg from "../../../assets/images/item.png";

function Home() {
    const token = sessionStorage.getItem("authToken");
    const userId = JSON.parse(sessionStorage.getItem("auth")).id
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

    const [recomcollections, setRecomLocationList] = useState([]);
    const [hotCollections, setHotCollections] = useState([]);
    const [userInfoForRecom, setUserInfoForRecom] = useState({});
    
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            const data = await response.json();

            // Extract interest and children_ages
            const { interest, children_ages } = data.user;
            setUserInfoForRecom({ interest, children_ages });

            return;
        } catch (error) {
            console.error("Error fetching user info:", error);
            throw error; // Re-throw the error for further handling
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/locations", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch locations");
            }

            const data = await response.json();
            return data.location; // Return the locations for further processing
        } catch (error) {
            console.error("Error fetching locations:", error);
            throw error; // Re-throw the error for further handling
        }
    };

    const recommendLocations = async (collections) => {
        try {
            const { children_ages, interest } = userInfoForRecom;

            const filteredCollections = [];

            // If both children_ages and interest are empty
            if (!children_ages && !interest) {
                const uniqueCollections = [];
                const seenTags = new Set();
                const seenAges = new Set();

                for (const collection of collections) {
                    if (uniqueCollections.length >= 10) break;

                    if (!seenTags.has(collection.type) && !seenAges.has(collection.age_start)) {
                        uniqueCollections.push(collection);
                        seenTags.add(collection.type);
                        seenAges.add(collection.age_start);
                    }
                }
                setRecomLocationList(uniqueCollections);
                return;
            }

            // If there are children_ages or interest, filter by them
            for (const collection of collections) {
                const age = `${collection.age_start}-${collection.age_end}`;
                const isAgeMatch = children_ages && children_ages.includes(age);
                const isInterestMatch = interest && collection.type.includes(interest);

                if (isAgeMatch || isInterestMatch) {
                    filteredCollections.push(collection);
                }
            }

            setRecomLocationList(filteredCollections);
        } catch (error) {
            console.error("Error:", error);
            setRecomLocationList([]); // Return empty array on error
        }
    };
    
    const hotLocations = (collections) => {
        // Sort the collections by number of tourists in descending order
        const sortedCollections = [...collections] // Create a shallow copy of collections
            .sort((a, b) => b.number_tourist - a.number_tourist) // Sort by number of tourists
            .slice(0, 10); // Take the top 10
    
        // Set the sorted top 10 collections to state
        setHotCollections(sortedCollections);
    };
    
    const initiateFetch = async () => {
        try {
            await fetchUserInfo(); // Fetch user info
            const locations = await fetchLocations(); // Fetch locations
            await recommendLocations(locations); // Recommend locations
            hotLocations(locations); // Recommend locations
        } catch (error) {
            console.error("Error during fetching process:", error);
        }
    };

    useEffect(() => {
        // Initiate the process
        initiateFetch();
  }, []); // Empty dependency array to run only on mount

// const collections = [
//     {
//       id: 1,
//       name: "Quốc đảo chim",
//       place: "Thiên đường Bảo Sơn - Hà Nội (11km)",
//       price: 500000, // Giá
//       visitors: 150, // Lượt tham quan
//       age: "0-1", // Nhóm tuổi
//       style: "家族旅行", // Phong cách
//       visited: "行っていない", // Trạng thái đã đi chưa
//       distance: "10-20km", // Khoảng cách
//       like: "好き", // Thích hay không
//     },
//     {
//       id: 2,
//       name: "Khu bảo tồn rừng quốc gia",
//       place: "Ba Vì - Hà Nội (50km)",
//       price: 300000,
//       visitors: 200,
//       age: "1-3",
//       style: "エコツーリズム",
//       visited: "行ってきました",
//       distance: "40-100km",
//       like: "好きじゃない",
//     },
//     {
//       id: 3,
//       name: "Vịnh Hạ Long",
//       place: "Quảng Ninh (160km)",
//       price: 1500000,
//       visitors: 500,
//       age: "1-3",
//       style: "リゾート",
//       visited: "行ってきました",
//       distance: "40-100km",
//       like: "好き",
//     },
//     {
//       id: 4,
//       name: "Làng cổ Đường Lâm",
//       place: "Sơn Tây - Hà Nội (40km)",
//       price: 200000,
//       visitors: 50,
//       age: "1-3",
//       style: "文化旅行",
//       visited: "行っていない",
//       distance: "30-40km",
//       like: "好き",
//     },
//     {
//       id: 5,
//       name: "Đỉnh Fansipan",
//       place: "Lào Cai (300km)",
//       price: 2000000,
//       visitors: 300,
//       age: "10+",
//       style: "冒険",
//       visited: "行ってきました",
//       distance: "40-100km",
//       like: "好き",
//     },
//     {
//       id: 6,
//       name: "Biển Sầm Sơn",
//       place: "Thanh Hóa (170km)",
//       price: 700000,
//       visitors: 400,
//       age: "3-6",
//       style: "ビーチ",
//       visited: "行ってきました",
//       distance: "40-100km",
//       like: "好き",
//     },
//     {
//       id: 7,
//       name: "Hồ Gươm",
//       place: "Hà Nội (1km)",
//       price: 100000,
//       visitors: 1000,
//       age: "すべて",
//       style: "都市",
//       visited: "行ってきました",
//       distance: "0-10km",
//       like: "好き",
//     },
//     {
//       id: 8,
//       name: "Núi Bà Đen",
//       place: "Tây Ninh (1200km)",
//       price: 400000,
//       visitors: 250,
//       age: "6-10",
//       style: "探検",
//       visited: "行っていない",
//       distance: "40-100km",
//       like: "好き",
//     },
//     {
//       id: 9,
//       name: "Hồ Gươm",
//       place: "Hà Nội (1km)",
//       price: 100000,
//       visitors: 1000,
//       age: "すべて",
//       style: "都市",
//       visited: "行ってきました",
//       distance: "0-10km",
//       like: "好き",
//     },
//     {
//       id: 10,
//       name: "Núi Bà Đen",
//       place: "Tây Ninh (1200km)",
//       price: 400000,
//       visitors: 250,
//       age: "6-10",
//       style: "探検",
//       visited: "行っていない",
//       distance: "40-100km",
//       like: "好き",
//     },
//   ];

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
                <Collection collectionData={recomcollections} itemsNumber={5} showIndicator={true} rowNumber={1}></Collection>
            </div>
            <div className="hot-collection">
                <div className="title-collection">
                    <span>最も人気のある観光地</span>
                </div>
                <Collection collectionData={hotCollections} itemsNumber={5} showIndicator={true} rowNumber={1}></Collection>
            </div>
        </div>
    </div>
  );
}

export default Home;