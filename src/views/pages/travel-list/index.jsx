import React, { useState, useEffect } from "react";
import { Select, Space } from "antd";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Collection from "../../../components/collection";
import "./index.css";

const { Option } = Select;

const TravelList = () => {
  const location = useLocation();
  const likeState = useState(location.state?.likeState || "");
  const goneState = useState(location.state?.goneState || "");

  const region = location.pathname.split("/").pop();
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
  const [selectedDistance, setSelectedDistance] = useState(goneState);
  const [selectedLiked, setSelectedLiked] = useState(likeState);

  const filterByRegion = (places) => {
    // Nếu miền được chọn là "all", trả về danh sách gốc
    if (region === "all") {
      return places;
    }

    const regions = {
        "north": [
            "Hà Nội", "Bắc Ninh", "Bắc Giang", "Hà Nam", "Hải Dương", 
            "Hải Phòng", "Hòa Bình", "Lai Châu", "Lào Cai", "Nam Định", 
            "Ninh Bình", "Phú Thọ", "Quảng Ninh", "Sơn La", "Thái Bình", 
            "Thái Nguyên", "Tuyên Quang", "Vĩnh Phúc", "Yên Bái"
        ],
        "central": [
            "Đà Nẵng", "Huế", "Khánh Hòa", "Bình Định", "Quảng Nam", 
            "Quảng Ngãi", "Quảng Trị", "Thừa Thiên Huế", "Ninh Thuận", 
            "Phú Yên", "Bình Thuận", "Đắk Lắk", "Đắk Nông", "Gia Lai", 
            "Kon Tum", "Lâm Đồng", "Quảng Bình", "Hà Tĩnh", "Nghệ An"
        ],
        "south": [
            "Hồ Chí Minh", "Bà Rịa-Vũng Tàu", "Bình Dương", "Bình Phước", 
            "Cần Thơ", "Đồng Nai", "Đồng Tháp", "Hậu Giang", "Kiên Giang", 
            "Long An", "Sóc Trăng", "Tây Ninh", "Tiền Giang", "Vĩnh Long", 
            "An Giang", "Bạc Liêu", "Bến Tre", "Cà Mau", "Trà Vinh"
        ],
    };

    return places.filter((place) => {
        const addressParts = place.address.split(",").map((part) => part.trim());
        const province = addressParts[addressParts.length - 1].toLowerCase();
        
        return regions[region]?.some(
            (provinceName) => provinceName.toLowerCase() === province
        );
    });
  };

  useEffect(() => {
    setFilteredCollections(filterByRegion(collections));
  }, [region]);
  
  const fetchPlaces = async () => {
    const userId = JSON.parse(sessionStorage.getItem("auth")).id;
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:8000/api/v1/locations", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        
        const storedDistances = localStorage.getItem('distance');
        const distance = JSON.parse(storedDistances);
        
        const location = data.location.map(locationItem => {
          // Tìm kiếm trong mảng distance
          const foundDistance = distance.find(distItem => distItem.location_id === locationItem.location_id);
          
          return {
            ...locationItem, // Giữ nguyên tất cả các thuộc tính ban đầu
            distance: foundDistance ? foundDistance.distance : null // Thêm thuộc tính distance
          };
        });

        setCollections(filterByRegion(location)); // Lưu danh sách địa điểm vào state
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
  
  const fetchData = async () => {
    await fetchPlaces();
    await fetchUserInfo();
  };

  useEffect(() => {
    fetchData();

    if (likeState) {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [likeState[0].key]: likeState[0].value,
        }));
    }

    if (goneState) {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [goneState[0].key]: goneState[0].value,
        }));
    }
  }, []); // Chạy effect chỉ khi component mount

  const itemUpdate = (type, locationId) => {
    console.log(type, locationId)
    if (type === "fav") {
      // Thêm locationId vào likedCollections
      const findLocationById = collections.find(distItem => distItem.location_id === locationId);
      setLikedCollections(prevCollections => [...prevCollections, findLocationById]);
    } else if (type === "rev-fav") {
      // Loại bỏ locationId khỏi goneCollections
      setLikedCollections(prevCollections => prevCollections.filter(location => location.location_id !== locationId));
      console.log(likedCollections)
    } else if (type === "gone") {
      // Thêm locationId vào goneCollections
      const findLocationById = collections.find(distItem => distItem.location_id === locationId);
      setGoneCollections(prevCollections => [...prevCollections, findLocationById]);
    } else if (type === "rev-gone") {
      // Loại bỏ locationId khỏi goneCollections
      setGoneCollections(prevCollections => prevCollections.filter(location => location.location_id !== locationId));
    }
  }

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

  const applyFilters = async () => {
    let filtered = collections;

    // Áp dụng lọc theo độ tuổi
    if (selectedFilters.age && selectedFilters.age !== "すべて") {
      
      if(selectedFilters.age.includes("+")) {
        const [start] = selectedFilters.age.split("+").map(Number);
        filtered = filtered.filter(
          (place) => place.age_end > start
        );
      }
      else {
        const [start, end] = selectedFilters.age.split("-").map(Number);
        filtered = filtered.filter(
          (place) => place.age_start >= start && place.age_end <= end
        );
      }
    }

    // Áp dụng lọc theo loại hình du lịch
    if (selectedFilters.style && selectedFilters.style !== "すべて") {
      filtered = filtered.filter(
        (place) => place.type.includes(selectedFilters.style)
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
      if(selectedFilters.distance.includes('+')) {
        const [min] = selectedFilters.distance.split("+").map(Number);
        // Lọc filtered để chỉ chứa các địa điểm có distance trong khoảng từ min đến min
        filtered = filtered.filter((place) => {
          const distance = place.distance; // Sử dụng distance của từng place
          return distance > min; // Kiểm tra khoảng cách
        });
      } else {
        const [min, max] = selectedFilters.distance.split("-").map(Number);
        // Lọc filtered để chỉ chứa các địa điểm có distance trong khoảng từ min đến max
        filtered = filtered.filter((place) => {
          const distance = place.distance; // Sử dụng distance của từng place
          return distance >= min && distance <= max; // Kiểm tra khoảng cách
        });
      }    
    }

    setFilteredCollections(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, collections, likedCollections, goneCollections]);

  return (
    <div className="travel-list">
      <header className="admin-header">
        <h2>
          {(() => {
            if (region === "all") {
              return "三地域の観光地";
            } else if (region === "north") {
              return "北部の観光地";
            } else if (region === "central") {
              return "中央部の観光地"; // Sửa lại để phản ánh đúng khu vực
            } else if (region === "south") {
              return "南部の観光地"; // Sửa lại để phản ánh đúng khu vực
            } else {
              return ""; // Trả về chuỗi rỗng nếu không khớp với bất kỳ điều kiện nào
            }
          })()}
        </h2>
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
                <Option value="40+">40+km</Option>
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
          onItemUpdate={itemUpdate}
        ></Collection>
      </div>
    </div>
  );
};

export default TravelList;
