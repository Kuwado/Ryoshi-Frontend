import React, { useState, useEffect } from "react";
import { Select, Space } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import Collection from "../../../components/collection";
import "./index.css";

const { Option } = Select;

const TravelList = () => {
  const [collections, setCollections] = useState([]); // Dữ liệu từ API
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [goneCollections, setGoneCollections] = useState([]);
  const [likedCollections, setLikedCollections] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedButton, setSelectedButton] = useState("all");

  const [selectedAge, setSelectedAge] = useState(undefined);
  const [selectedStyle, setSelectedStyle] = useState(undefined);
  const [selectedGone, setSelectedGone] = useState(undefined);
  const [selectedDistance, setSelectedDistance] = useState(undefined);
  const [selectedLiked, setSelectedLiked] = useState(undefined);

  const fetchPlaces = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8000/api/v1/locations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { location } = response.data;
        setCollections(location); // Lưu danh sách địa điểm vào state
        setFilteredCollections(location); // Mặc định hiển thị tất cả địa điểm
      } else {
        console.error("Error fetching locations:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching places:",
        error.response?.data || error.message
      );
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const userId = JSON.parse(sessionStorage.getItem("auth")).id;
  
      if (userId) {
        const response = await axios.get(
          `http://localhost:8000/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          const userData = response.data.user;
          setUserInfo(userData); // Lưu thông tin người dùng vào state
          setLikedCollections(userData.liked_location);
          setGoneCollections(userData.gone_location);
        } else {
          console.error("Error fetching user info:", response.data.message);
        }
      } else {
        console.error("User ID not found");
      }
    } catch (error) {
      console.error(
        "Error fetching user info:",
        error.response?.data || error.message
      );
    }
  };
  
  useEffect(() => {
    fetchPlaces();
    fetchUserInfo();
  }, []);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));

    // Cập nhật giá trị tương ứng
    switch (filterKey) {
      case 'age':
        setSelectedAge(value);
        break;
      case 'style':
        setSelectedStyle(value);
        break;
      case 'visited':
        setSelectedGone(value);
        break;
      case 'distance':
        setSelectedDistance(value);
        break;
      case 'like':
        setSelectedLiked(value);
        break;
      default:
        break;
    }
  };

  const resetFilters = () => {
    if (selectedAge !== undefined) setSelectedAge("すべて");
    if (selectedStyle !== undefined) setSelectedStyle("すべて");
    if (selectedGone !== undefined) setSelectedGone("すべて");
    if (selectedDistance !== undefined) setSelectedDistance("すべて");
    if (selectedLiked !== undefined) setSelectedLiked("すべて");
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);

    if (button === "all") {
      setFilteredCollections(collections); // Hiển thị tất cả
      resetFilters();
      
    } else if (button === "price") {
      const sortedByPrice = [...filteredCollections].sort(
        (a, b) => a.adult_price - b.adult_price
      ); // Sắp xếp theo giá tăng dần
      setFilteredCollections(sortedByPrice);
    } else if (button === "general") {
      const sortedByVisitors = [...filteredCollections].sort(
        (a, b) => b.number_tourist - a.number_tourist // Sắp xếp giảm dần theo lượng người tham quan
      );
      setFilteredCollections(sortedByVisitors);
    }
  };

  useEffect(() => {
    const applyFilters = async () => {
      let filtered = collections;

      // Áp dụng lọc theo độ tuổi
      if (selectedFilters.age && selectedFilters.age !== "すべて") {
        const [start, end] = selectedFilters.age.split("-").map(Number);
        filtered = filtered.filter(
          (place) => place.age_start <= start && place.age_end >= end
        );
      }

      // Áp dụng lọc theo loại hình du lịch
      if (selectedFilters.style && selectedFilters.style !== "すべて") {
        filtered = filtered.filter(
          (place) => place.type === selectedFilters.style
        );
      }

      // Áp dụng lọc theo trạng thái đã đi
      //Lấy ra danh sách kết hợp với danh sách địa điểm đã đi và danh sách địa điểm hiện tại
      if (selectedFilters.visited && selectedFilters.visited === "行ってきました") {
        if (userInfo && goneCollections) {
          const goneIds = goneCollections.map(location => location.location_id);  
          filtered = filtered.filter(place => goneIds.includes(place.location_id));
        }
      }

      //
      if (selectedFilters.visited && selectedFilters.visited === "行っていない") {
        if (userInfo && goneCollections) {
          const goneIds = goneCollections.map(location => location.location_id);  
          filtered = filtered.filter(place => !goneIds.includes(place.location_id));
        }
      }

      // Áp dụng lọc theo trạng thái thích
      if (selectedFilters.like && selectedFilters.like === "好き") {
        console.log(likedCollections)
        if (userInfo && likedCollections) {
          const likedIds = likedCollections.map(location => location.location_id);  
          filtered = filtered.filter(place => likedIds.includes(place.location_id));
        }
      }

      //
      if (selectedFilters.like && selectedFilters.like === "好きじゃない") {
        console.log(likedCollections)
        if (userInfo && likedCollections) {
          const likedIds = likedCollections.map(location => location.location_id);  
          filtered = filtered.filter(place => !likedIds.includes(place.location_id));
        }
      }

      // Áp dụng lọc theo khoảng cách
      if (selectedFilters.distance && selectedFilters.distance !== "すべて") {
        try {
          const token = sessionStorage.getItem("authToken");
          const [min, max] = selectedFilters.distance.split("-").map(Number);

          for (const place of filtered) {
            const response = await axios.get(
              `http://localhost:8000/api/v1/users/distance/${place.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const distance = response.data.distance;
            if (distance < min || distance > max) {
              filtered = filtered.filter((p) => p.id !== place.id);
            }
          }
        } catch (error) {
          console.error("Error fetching distances:", error);
        }
      }

      setFilteredCollections(filtered);
    };

    applyFilters();
  }, [selectedFilters, collections]);

  return (
    <div className="travel-list">
      <header className="admin-header">
        <h2>北部の観光地</h2>
        <div className="header-filters-actions">
          <div className="header-filters">
            <Space size="middle">
              <Select
                value={selectedAge}
                placeholder="子供の年齢"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("age", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="0-1">0-1歳</Option>
                <Option value="1-3">1-3歳</Option>
                <Option value="3-6">3-6歳</Option>
                <Option value="6-10">6-10歳</Option>
                <Option value="10+">10+歳</Option>
              </Select>

              <Select
                value={selectedStyle}
                placeholder="旅行のスタイル"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("style", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="エコツーリズム">エコツーリズム</Option>
                <Option value="文化旅行">文化旅行</Option>
                <Option value="リゾート">リゾート</Option>
                <Option value="レクリエーション">レクリエーション</Option>
                <Option value="スポーツ">スポーツ</Option>
                <Option value="探検">探検</Option>
                <Option value="冒険">冒険</Option>
                <Option value="コンビネーション">コンビネーション</Option>
                <Option value="家族旅行">家族旅行</Option>
                <Option value="団体旅行">団体旅行</Option>
                <Option value="個人旅行">個人旅行</Option>
                <Option value="ビーチ">ビーチ</Option>
                <Option value="山">山</Option>
                <Option value="都市">都市</Option>
                <Option value="田舎">田舎</Option>
                <Option value="あなたにぴったり">あなたにぴったり</Option>
              </Select>

              <Select
                value={selectedGone}
                placeholder="行っていない"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("visited", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="行っていない">行っていない</Option>
                <Option value="行ってきました">行ってきました</Option>
              </Select>
              <Select
                value={selectedDistance}
                placeholder="距離"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("distance", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="0-10">0 - 10km</Option>
                <Option value="10-20">10 - 20km</Option>
                <Option value="20-30">20 - 30km</Option>
                <Option value="30-40">30 - 40km</Option>
                <Option value="40-100">40+km</Option>
              </Select>
              <Select
                value={selectedLiked}
                placeholder="好き"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("like", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="好き">好き</Option>
                <Option value="好きじゃない">好きじゃない</Option>
              </Select>
            </Space>
          </div>
          <div className="header-actions">
            <div className="pill-buttons">
              <button
                className={`pill-button ${
                  selectedButton === "all" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("all")}
              >
                すべて
              </button>
              <button
                className={`pill-button ${
                  selectedButton === "price" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("price")}
              >
                価格
              </button>
              <button
                className={`pill-button ${
                  selectedButton === "general" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("general")}
              >
                一般的
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="for-u-collection">
        <Collection
          collectionData={filteredCollections}
          itemsNumber={5}
          showIndicator={false}
          showPagination={true}
          rowNumber={2}
        ></Collection>
      </div>
    </div>
  );
};

export default TravelList;
