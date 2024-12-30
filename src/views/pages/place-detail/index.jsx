import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import "./index.css";
import Collection from "../../../components/collection";
import axios from "axios";
import Carousel from "./carousel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceDetail = () => {
  const [locationData, setLocationData] = useState(null); // State lưu dữ liệu địa điểm
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("authToken");
  const currentLocation = useLocation(); // Lấy thông tin location từ router
  const locationId = currentLocation.pathname.split("/").pop();
  const [slides, setSlides] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [similarCollections, setSimilarCollections] = useState([]);
  const navigate = useNavigate();
  const id = JSON.parse(sessionStorage.getItem("auth")).id;
  const [isLiked, setIsLiked] = useState(false);
  const [isVisited, setIsVisited] = useState(false);  
  const [distance, setDistance] = useState(null);

  // Hàm fetch dữ liệu API
  const fetchLocationData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/locations/${locationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const location = response.data.location;

      const storedDistances = localStorage.getItem('distance');
      const distance = JSON.parse(storedDistances);
      
      // Tìm kiếm distance cho location_id trong distances
      const foundDistance = distance.find(distItem => distItem.location_id === location.location_id);

      // Thêm thuộc tính distance vào data
      location.distance = foundDistance ? foundDistance.distance : null;

      setLocationData(location);
      setDistance(location.distance);
      if (location.images) {
        const imageNames = location.images.split(",");
        const slideData = imageNames.map((imageName, index) => ({
          id: index + 1,
          src: `http://localhost:8000/uploads/${imageName.trim()}`,
          alt: `Slide ${index + 1}`,
        }));
        setSlides(slideData);
      }
      setIsLiked(location.like.id);
      setIsVisited(location.gone.id);
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

  const collectionUpdate = (type, locationId) => { }

  const handleLikeButton = async () => {
    // Xử lý khi click vào nút Like
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/liked`,
        { user_id: id,
          location_id: locationId,
         },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
      if(response.status === 200){
        console.log(1)
        setIsLiked(!isLiked);
        toast.success(response.data.message);
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error liking location:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleVisitedButton = async () => {
    // Xử lý khi click vào nút Visited
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/gone`,
        { user_id: id,
          location_id: locationId,
         },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
      if(response.status === 200){
        console.log(1)
        setIsVisited(!isVisited);
        toast.success(response.data.message);
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error visiting location:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleNavigateButton = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationData.address)}`;
    window.open(googleMapsUrl, "_blank");
  };
  
  return (
    <div className="place-detail-container">
      <div className="ad-header" style={{paddingLeft: '20px', paddingTop: '20px', marginBottom: '0px'}}>
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
              <span className="info-value">
                {distance ? `${distance} キロメートル` : `未定`}
              </span>
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
            <button onClick={handleNavigateButton} style={{ backgroundColor: "orange", color: "white" }}>
              <img
                src={require('../../../assets/images/VectorFlag.png')}
                alt="Flag"
                style={{ width: '12px', height: '16px', objectFit: 'cover' }}
              />
              方向</button>
            <div className="toggle-button-left">
              <button
                onClick={handleLikeButton}
              >
                <div className="product-slider__fav js-fav" >
                  <span className={`heart ${isLiked ? 'is-active' : ''}`}></span>
                </div>
                お気に入り</button>
              <button
                onClick={handleVisitedButton}
              >
                <div className="product-slider__fav js-fav">
                  <span className={`tick ${isVisited ? 'is-active' : ''}`}></span>
                </div>
                行ったことがある</button>
            </div>
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
        <Collection onItemUpdate={collectionUpdate} collectionData={similarCollections} itemsNumber={5} showIndicator={true} rowNumber={1}></Collection>
      </div>
    </div>
  );
};

export default PlaceDetail;