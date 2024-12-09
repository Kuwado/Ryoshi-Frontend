import React, { useState, useEffect } from 'react';
import "./index.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

async function getCityList() {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1', {
      method: 'GET',
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map(city => ({
      name: city.name,
      id: city.code,
    }));
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    return null;
  }
}

async function getWardList(cityId) {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${cityId}&limit=-1`, {
      method: 'GET',
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map(ward => ({
      name: ward.name,
      id: ward.code,
    }));
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    return null;
  }
}

async function getTownList(wardId) {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${wardId}&limit=-1`, {
      method: 'GET',
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map(town => ({
      name: town.name,
      id: town.code,
    }));
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    return null;
  }
}

const AdminPlaceDetail = () => {
  const [formData, setFormData] = useState({
    name: '', // Tên địa điểm
    region: '', // Thành phố 市 
    district: '', // Khu vực 
    place: '', // Quận 区 
    placeDetail: '', // Chi tiết vị trí
    openTime: '', // Giờ làm việc 営業時間
    closingTime: '', // Giờ đóng cửa 閉店時間
    ageGroupStart: '', // Tuổi bắt đầu 適齢期
    ageGroupEnd: '', // Tuổi kết thúc 適齢期
    visitorsAdult: '', // Giá vé khách người lớn 訪問者数
    visitorsChild: '', // Giá vé khách trẻ em 訪問者数
    dailyVisitors: '', // Số khách tham quan mỗi ngày 訪問者数
    description: '', // Mô tả
    image: null,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const locationId = location.pathname.split('/').pop();
  const token = sessionStorage.getItem('authToken');

  const [city, setCity] = useState(null); 
  const [ward, setWard] = useState(null); 
  const [town, setTown] = useState(null); 

  const [cityList, setCityList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [townList, setTownList] = useState([]);
  const [cityId, setCityId] = useState('');

  // Lấy danh sách thành phố khi component được render
  useEffect(() => {
    const fetchCityList = async () => {
      const cities = await getCityList();
      if (cities) {
        setCityList(cities);
      }
    };
    fetchCityList();
  }, []);

  const handleCityChange = async (e) => {
    const selectedId = e.target.value;
    const selectedCity = cityList.find((city) => city.id === selectedId);

    setCity(selectedCity);
    setCityId(selectedId);
  };

  // Lấy danh sách quận huyện khi cityId thay đổi
  useEffect(() => {
    const fetchWardList = async () => {
      if (cityId) {
        const wards = await getWardList(cityId);
        if (wards) {
          setWardList(wards);
        }
      }
    };

    fetchWardList();
  }, [cityId]);

  const handleWardChange = async (e) => {
    const selectedId = e.target.value;
    const selectedWard = wardList.find((ward) => ward.id === selectedId);

    setWard(selectedWard);
  };

  // Lấy danh sách phường/xã khi wardId thay đổi
  useEffect(() => {
    const fetchTownList = async () => {
      if (ward) {
        const towns = await getTownList(ward.id);
        if (towns) {
          setTownList(towns);
        }
      }
    };

    fetchTownList();
  }, [ward]);

  const handleTownChange = (e) => {
    const selectedId = e.target.value;
    const selectedTown = townList.find((town) => town.id === selectedId);

    setTown(selectedTown);
  };

  const getPlace = async () => {
    try{
      const response = await axios.get(`http://localhost:8000/api/v1/locations/${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        setFormData({
          name: response.data.location.name,
          //region: response.data.city_id,
          //district: response.data.district_id,
          //place: response.data.ward_id,
          //placeDetail: response.data.address,
          openTime: response.data.location.open_time,
          closingTime: response.data.location.close_time,
          ageGroupStart: response.data.location.age_start,
          ageGroupEnd: response.data.location.age_end,
          visitorsAdult: response.data.location.adult_price,
          visitorsChild: response.data.location.child_price,
          dailyVisitors: response.data.location.number_tourist,
          description: response.data.location.description,
          image: response.data.location.images,
        })
      }
    }catch(error){
      console.log(error);
    }
  };

  useEffect(() => {
    getPlace();
  }, []);

  const handleEditClick = (field) => {
    // Logic xử lý khi người dùng nhấn nút edit
  };

  const handleSubmit = async (e) => {
    // Xử lý khi người dùng nhấn nút tạo
  };

  const handleCancel = async (e) => {
    // Xử lý khi người dùng nhấn nút hủy
    e.preventDefault();
    navigate('/admin/admin-place-list');
  };

  return (
    <div className="admin-create-place">
      <div className="ad-header">
        <div className="ad-header-text">場所の詳細</div>
      </div>

      <div className="form-container">
        <div className="left-side">
          {/* Tên địa điểm */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector1.png')}
                alt="Icon"
                className="form-icon"
              />
              名前：
            </label>
            <div className="input-with-edit">
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                className="input-field"
              />
              <button
                onClick={() => handleEditClick('name')}
                className="edit-btn"
              >
                <img
                  src={require('../../../assets/images/edit.png')}
                  alt="Edit"
                  className="edit-icon"
                />
              </button>
            </div>
          </div>

          {/* Thành phố, Quận, Phường */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector2.png')}
                alt="Icon"
                className="form-icon"
              />
              場所：
            </label>
            <div className="selectors-container">
              <div className="input-with-edit">
                <select
                  name="region"
                  value={city ? city.id : ''}
                  readOnly
                  className="select-field"
                >
                  <option value="" disabled>市</option>
                  {cityList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-with-edit">
                <select
                  name="district"
                  value={ward ? ward.id : ''}
                  readOnly
                  className="select-field"
                >
                  <option value="" disabled>地区</option>
                  {wardList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-with-edit">
                <select
                  name="place"
                  value={town ? town.id : ''}
                  readOnly
                  className="select-field"
                >
                  <option value="" disabled>区</option>
                  {townList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chi tiết vị trí */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector3.png')}
                alt="Icon"
                className="form-icon"
              />
              場所の詳細：
            </label>
            <div className="input-with-edit">
              <input
                type="text"
                name="placeDetail"
                value={formData.placeDetail}
                readOnly
                className="input-field"
              />
              <button
                onClick={() => handleEditClick('placeDetail')}
                className="edit-btn"
              >
                <img
                  src={require('../../../assets/images/edit.png')}
                  alt="Edit"
                  className="edit-icon"
                />
              </button>
            </div>
          </div>

          {/* Giờ mở cửa */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector4.png')}
                alt="Icon"
                className="form-icon"
              />
              営業時間：
            </label>
            <div className="input-with-edit">
              <input
                type="text"
                name="openTime"
                value={formData.openTime}
                readOnly
                className="input-field"
              />
              <button
                onClick={() => handleEditClick('openTime')}
                className="edit-btn"
              >
                <img
                  src={require('../../../assets/images/edit.png')}
                  alt="Edit"
                  className="edit-icon"
                />
              </button>
            </div>
          </div>

          {/* Giờ đóng cửa */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector5.png')}
                alt="Icon"
                className="form-icon"
              />
              閉店時間：
            </label>
            <div className="input-with-edit">
              <input
                type="text"
                name="closingTime"
                value={formData.closingTime}
                readOnly
                className="input-field"
              />
              <button
                onClick={() => handleEditClick('closingTime')}
                className="edit-btn"
              >
                <img
                  src={require('../../../assets/images/edit.png')}
                  alt="Edit"
                  className="edit-icon"
                />
              </button>
            </div>
          </div>

          {/* Tuổi bắt đầu và kết thúc */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector6.png')}
                alt="Icon"
                className="form-icon"
              />
              適齢期：
            </label>
            <div className="age-group">
              <div className="input-with-edit">
                <input
                  type="number"
                  name="ageGroupStart"
                  value={formData.ageGroupStart}
                  readOnly
                  className="input-field"
                  placeholder=""
                />
                <button
                  onClick={() => handleEditClick('ageGroupStart')}
                  className="edit-btn"
                >
                  <img
                    src={require('../../../assets/images/edit.png')}
                    alt="Edit"
                    className="edit-icon"
                  />
                </button>
              </div>
              <div className="age-text">から</div>
              <div className="input-with-edit">
                <input
                  type="number"
                  name="ageGroupEnd"
                  value={formData.ageGroupEnd}
                  readOnly
                  className="input-field"
                  placeholder=""
                />
                <button
                  onClick={() => handleEditClick('ageGroupEnd')}
                  className="edit-btn"
                >
                  <img
                    src={require('../../../assets/images/edit.png')}
                    alt="Edit"
                    className="edit-icon"
                  />
                </button>
              </div>
              <div className="age-text">まで</div>
            </div>
          </div>

          {/* Giá vé */}
          <div className="form-group-2">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector7.png')}
                alt="Icon"
                className="form-icon"
              />
              チケット価格：
            </label>
            
            <div className="visit-group">
        <div className="visit-text">アダルト（ドン）</div>
        <div className="input-with-edit">
          <input
            type="number"
            name="visitorsAdult"
            value={formData.visitorsAdult}
            readOnly
            className="input-field"
            placeholder=""
          />
          <button
            onClick={() => handleEditClick('visitorsAdult')}
            className="edit-btn"
          >
            <img
              src={require('../../../assets/images/edit.png')}
              alt="Edit"
              className="edit-icon"
            />
          </button>
        </div>
      </div>
      <div className="visit-group">
        <div className="visit-text">子供（ドン）</div>
        <div className="input-with-edit">
          <input
            type="number"
            name="visitorsChild"
            value={formData.visitorsChild}
            readOnly
            className="input-field"
            placeholder=""
          />
          <button
            onClick={() => handleEditClick('visitorsChild')}
            className="edit-btn"
          >
            <img
              src={require('../../../assets/images/edit.png')}
              alt="Edit"
              className="edit-icon"
            />
          </button>
        </div>
      </div>
          </div>

          {/* Label 8: 訪問者数 (人/日) */}
          <div className="form-group-2">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector8.png')}
                alt="Icon"
                className="form-icon"
              />
              訪問者数 :
              </label>
              <div className="visit-group">
        <div className="visit-text">(人/日)</div>
        <div className="input-with-edit">
          <input
            type="number"
            name="dailyVisitors"
            value={formData.dailyVisitors}
            readOnly
            className="input-field"
            placeholder=""
          />
          <button
            onClick={() => handleEditClick('dailyVisitors')}
            className="edit-btn"
          >
            <img
              src={require('../../../assets/images/edit.png')}
              alt="Edit"
              className="edit-icon"
            />
          </button>
        </div>
      </div>
          </div>
          {/* Label 9: 画像をアップロード */}
          <div className="form-group">
            <label className="form-label image-upload-label">
              <img
                src={require('../../../assets/images/Vector9.png')}
                alt="Icon"
                className="form-icon"
              />
              画像をアップロード：
            </label>
            <div className="image-upload">
              <input
                type="file"
                name="image"
                id="image-upload"
                className="image-input"
              />
              {formData.image && (
                <div className="image-preview">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="preview-image"
                  />
                  <button  className="remove-image">
                    <img
                      src={require('../../../assets/images/Vector12.png')}
                      alt="Remove"
                      className="remove-icon"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector10.png')}
                alt="Icon"
                className="form-icon"
              />
              右側ラベル：
            </label>
            <textarea
              className="right-textarea"
              placeholder="詳細情報を入力してください"
              name="description"
              value={formData.description}
            />
          </div>
        </div>
      </div>
              {/* Action Buttons */}
              <div className="action-buttons">
  <button className="btn-create" onClick={handleSubmit}>
    <img
      src={require('../../../assets/images/Vector11.png')}
      alt="Create"
      className="form-icon"
    />
    アップデート
  </button>
  <button className="btn-cancel" onClick={handleCancel}>
    <img
      src={require('../../../assets/images/VectorDelete.png')}
      alt="Cancel"
      className="form-icon"
    />
    消去
  </button>
</div>
    </div>
  );
};

export default AdminPlaceDetail;
