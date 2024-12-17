import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import "./index.css";
import Collection from "../../../components/collection";
import axios from "axios";
import Carousel from "./carousel";

const PlaceDetail = () => {
  const [locationData, setLocationData] = useState(null); // State lưu dữ liệu địa điểm
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("authToken");
  const currentLocation = useLocation(); // Lấy thông tin location từ router
  const locationId = currentLocation.pathname.split("/").pop();
  const [slides, setSlides] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [similarCollections, setSimilarCollections] = useState([]);

  // Hàm fetch dữ liệu API
  const fetchLocationData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/locations/${locationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const location = response.data.location;
      setLocationData(location);
      if (location.images) {
        const imageNames = location.images.split(",");
        const slideData = imageNames.map((imageName, index) => ({
          id: index + 1,
          src: `http://localhost:8000/uploads/${imageName.trim()}`,
          alt: `Slide ${index + 1}`,
        }));
        setSlides(slideData);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchLocationData();
    }
  }, [locationId]);

  const fetchLocationsList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/locations",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocationsList(response.data.location);
      return response.data.location;
    } catch (error) {
      console.error("Error fetching locations list:", error);
      return [];
    }
  };

  const similarLocations = (collections, currentLocation) => {
    if (!currentLocation || !currentLocation.type) return;
  
    // Lọc các địa điểm có cùng type nhưng khác với địa điểm hiện tại
    const filteredCollections = collections.filter(
      (location) =>
        location.type === currentLocation.type && location.location_id !== currentLocation.location_id
    );
  
    // Cập nhật state với danh sách đã lọc và sắp xếp
    setSimilarCollections(filteredCollections);
  };  

  const initiateFetch = async () => {
    try {
      const locations = await fetchLocationsList();
      if (locationData) {
        similarLocations(locations, locationData); // Truyền locationData vào
      }
    } catch (error) {
      console.error("Error during fetching process:", error);
    }
  };  
  
  useEffect(() => {
    if (locationData) {
      initiateFetch();
    }
  }, [locationData]); // Chạy khi locationData đã được cập nhật
  
  
  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang fetch dữ liệu
  }

  return (
    <div className="place-detail-container">
      <div className="ad-header">
        <div className="ad-header-text">遊園地の詳細</div>
      </div>
      <div className="content-wrapper">
        {/* Phần bên trái - Carousel */}
        <div className="left-content">
          <Carousel slideData={slides}></Carousel>
        </div>

        {/* Phần bên phải - Thông tin chi tiết */}
        <div className="right-content">
          <div className="place-info">
            {/* Tên địa điểm */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector1.png")}
                alt="Icon"
                className="info-icon"
              />
              <span className="info-label">名前：</span>
              <span className="info-value">{locationData.name}</span>
            </div>

            {/* Địa chỉ */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector3.png")}
                alt="Icon"
                className="info-icon"
              />
              <span className="info-label">場所：</span>
              <span className="info-value">{locationData.address}</span>
            </div>

            {/* Khoảng cách */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector16.png")}
                alt="Icon"
                className="info-icon"
              />
              <span className="info-label">距離：</span>
              <span className="info-value">3.5キロメートル</span>
            </div>

            {/* Giờ mở cửa */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector4.png")}
                alt="Icon"
                className="info-icon"
              />
              <span className="info-label">営業時間：</span>
              <span className="info-value">{locationData.open_time}時</span>
            </div>

            {/* Giờ đóng cửa */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector5.png")}
                alt="Icon"
                className="info-icon"
              />
              <span className="info-label">閉店時間：</span>
              <span className="info-value">{locationData.close_time}時</span>
            </div>

            {/* Độ tuổi */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector6.png")}
                alt="Icon"
                className="info-icon"
              />
              <span className="info-label">適齢期：</span>
              <span className="info-value">
                ({locationData.age_start} - {locationData.age_end} 歳)
              </span>
            </div>

            {/* Giá vé */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector7.png")}
                alt="Icon"
                className="info-icon"
              />
             <span className="info-label">チケット価格：</span>
              <div className="info-value ticket-price">
                <div>アダルト: {locationData.adult_price?.toLocaleString() || "N/A"} ドン</div>
                <div>子供: {locationData.child_price?.toLocaleString() || "N/A"} ドン</div>
              </div>
            </div>

            {/* Lượt khách */}
            <div className="info-group">
              <img
                src={require("../../../assets/images/Vector8.png")}
                alt="Icon"
                className="info-icon"
              />
              <span className="info-label">訪問者数：</span>
              <span className="info-value">{locationData.number_tourist} 人/日</span>
            </div>
          </div>
          <div className="toggle-button">
            <button>お気に入り</button>
            <button>行ったことがある</button>
          </div>
        </div>
      </div>
      
      {/* Phần mô tả */}
      <div className="place-description">
        <label className="form-label">
          <img
            src={require('../../../assets/images/Vector10.png')}
            alt="Icon"
            className="form-icon"
          />
          説明：
        </label>
        <p className="description-text">{locationData.description}</p>
      </div>

      {/* Phần danh sách địa điểm tương tự */}
      <div className="similar-places">
        <h2>似たような場所</h2>
        <Collection collectionData={similarCollections} itemsNumber={5} showIndicator={true} rowNumber={1}></Collection>
      </div>
    </div>
  );
};

export default PlaceDetail;
