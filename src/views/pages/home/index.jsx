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

  const collectionUpdate = () => { }
  
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
                <Collection onItemUpdate={collectionUpdate} collectionData={recomcollections} itemsNumber={5} showIndicator={true} showLeftRight={true} rowNumber={1}></Collection>
            </div>
            <div className="hot-collection">
                <div className="title-collection">
                    <span>最も人気のある観光地</span>
                </div>
                <Collection onItemUpdate={collectionUpdate} collectionData={hotCollections} itemsNumber={5} showIndicator={true} showLeftRight={true} rowNumber={1}></Collection>
            </div>
        </div>
    </div>
  );
}

export default Home;