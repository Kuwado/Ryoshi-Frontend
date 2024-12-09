import React, { useState, useEffect } from "react";
import { Table, Button, Select, Space, message, Modal } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Collection from "../../../components/collection";
import "./index.css";

const { Option } = Select;
const { confirm } = Modal;

const TravelList = () => {
  // const collections = [
  //   {
  //     id: 1,
  //     name: "Quốc đảo chim",
  //     place: "Thiên đường Bảo Sơn - Hà Nội (11km)",
  //     price: 500000, // Giá
  //     visitors: 150, // Lượt tham quan
  //     age: "0-1", // Nhóm tuổi
  //     style: "家族旅行", // Phong cách
  //     visited: "行っていない", // Trạng thái đã đi chưa
  //     distance: "10-20km", // Khoảng cách
  //     like: "好き", // Thích hay không
  //   },
  //   {
  //     id: 2,
  //     name: "Khu bảo tồn rừng quốc gia",
  //     place: "Ba Vì - Hà Nội (50km)",
  //     price: 300000,
  //     visitors: 200,
  //     age: "1-3",
  //     style: "エコツーリズム",
  //     visited: "行ってきました",
  //     distance: "40-100km",
  //     like: "好きじゃない",
  //   },
  //   {
  //     id: 3,
  //     name: "Vịnh Hạ Long",
  //     place: "Quảng Ninh (160km)",
  //     price: 1500000,
  //     visitors: 500,
  //     age: "1-3",
  //     style: "リゾート",
  //     visited: "行ってきました",
  //     distance: "40-100km",
  //     like: "好き",
  //   },
  //   {
  //     id: 4,
  //     name: "Làng cổ Đường Lâm",
  //     place: "Sơn Tây - Hà Nội (40km)",
  //     price: 200000,
  //     visitors: 50,
  //     age: "1-3",
  //     style: "文化旅行",
  //     visited: "行っていない",
  //     distance: "30-40km",
  //     like: "好き",
  //   },
  //   {
  //     id: 5,
  //     name: "Đỉnh Fansipan",
  //     place: "Lào Cai (300km)",
  //     price: 2000000,
  //     visitors: 300,
  //     age: "10+",
  //     style: "冒険",
  //     visited: "行ってきました",
  //     distance: "40-100km",
  //     like: "好き",
  //   },
  //   {
  //     id: 6,
  //     name: "Biển Sầm Sơn",
  //     place: "Thanh Hóa (170km)",
  //     price: 700000,
  //     visitors: 400,
  //     age: "3-6",
  //     style: "ビーチ",
  //     visited: "行ってきました",
  //     distance: "40-100km",
  //     like: "好き",
  //   },
  //   {
  //     id: 7,
  //     name: "Hồ Gươm",
  //     place: "Hà Nội (1km)",
  //     price: 100000,
  //     visitors: 1000,
  //     age: "すべて",
  //     style: "都市",
  //     visited: "行ってきました",
  //     distance: "0-10km",
  //     like: "好き",
  //   },
  //   {
  //     id: 8,
  //     name: "Núi Bà Đen",
  //     place: "Tây Ninh (1200km)",
  //     price: 400000,
  //     visitors: 250,
  //     age: "6-10",
  //     style: "探検",
  //     visited: "行っていない",
  //     distance: "40-100km",
  //     like: "好き",
  //   },
  //   {
  //     id: 9,
  //     name: "Hồ Gươm",
  //     place: "Hà Nội (1km)",
  //     price: 100000,
  //     visitors: 1000,
  //     age: "すべて",
  //     style: "都市",
  //     visited: "行ってきました",
  //     distance: "0-10km",
  //     like: "好き",
  //   },
  //   {
  //     id: 10,
  //     name: "Núi Bà Đen",
  //     place: "Tây Ninh (1200km)",
  //     price: 400000,
  //     visitors: 250,
  //     age: "6-10",
  //     style: "探検",
  //     visited: "行っていない",
  //     distance: "40-100km",
  //     like: "好き",
  //   },
  // ];
  const [collections, setCollections] = useState([]); // Dữ liệu từ API
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedButton, setSelectedButton] = useState("all");

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
  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);

    if (button === "all") {
      setFilteredCollections(collections); // Hiển thị tất cả
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
      if (selectedFilters.age) {
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
  if (selectedFilters.visited && selectedFilters.visited !== "すべて") {
    const isGone = selectedFilters.visited === "行ってきました"; // "Đã đi"
    filtered = filtered.filter((place) => place.isGone === isGone);
  }

  // Áp dụng lọc theo trạng thái thích
  if (selectedFilters.like && selectedFilters.like !== "すべて") {
    const isLiked = selectedFilters.like === "好き"; // "Thích"
    filtered = filtered.filter((place) => place.isLiked === isLiked);
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
    <div className="admin-place-list">
      <header className="admin-header">
        <h2>北部の観光地</h2>
        <div className="header-filters-actions">
          <div className="header-filters">
            <Space size="middle">
              <Select
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
                placeholder="行っていない"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("visited", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="行っていない">行っていない</Option>
                <Option value="行ってきました">行ってきました</Option>
              </Select>
              <Select
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
