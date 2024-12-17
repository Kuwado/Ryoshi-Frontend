import React, { useState, useEffect } from 'react';
import "./index.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { type } from '@testing-library/user-event/dist/type';

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

async function getPlaceDetail(locationId, token) {
  try{
    const response = await axios.get(`http://localhost:8000/api/v1/locations/${locationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if(response.status === 200){
      return response.data.location;
    }
  }catch(error){
    console.log(error);
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

  const [isEditable, setIsEditable] = useState({
    name: false,
    region: false,
    district: false,
    place: false,
    placeDetail: false,
    openTime: false,
    closingTime: false,
    ageGroupStart: false,
    ageGroupEnd: false,
    visitorsAdult: false,
    visitorsChild: false,
    dailyVisitors: false,
    description: false,
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

  const [address, setAddress] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);

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

/*
  useEffect(() => {
    const fetchPlaceDetail = async () => {
      const location = await getPlaceDetail(locationId, token);
      if(location){
        setAddress(location.address);
        const addressArr = location.address.split(',').map(item => item.trim());
        setSelectedCity(addressArr[addressArr.length - 1]);
        setSelectedWard(addressArr[addressArr.length - 2]);
        setSelectedTown(addressArr[addressArr.length - 3]);
        setCity(cityList.find(city => city.name === selectedCity));
        console.log(selectedCity, selectedWard, selectedTown, city);
        setFormData({
          name: location.name,
          region: location.address.split(',')[0],
          district: location.address.split(',')[1],
          place: location.address.split(',')[2],
          placeDetail: location.address.split(',')[0],
          openTime: location.open_time,
          closingTime: location.close_time,
          ageGroupStart: location.age_start,
          ageGroupEnd: location.age_end,
          visitorsAdult: location.adult_price,
          visitorsChild: location.child_price,
          dailyVisitors: location.number_tourist,
          description: location.description,
          image: location.images,
        });
      }
    };

    fetchPlaceDetail();
  }, [cityList]);

  useEffect(() => {
    const fetchWards = async () => {
      if(city){
        const wards = await getWardList(city.id);
        if(wards){
          setWardList(wards);
          console.log(wardList, selectedWard);
          const findWard = wardList.find(ward => ward.name === selectedWard);
          console.log(findWard);
          setWard(findWard);
        }
      }
    }
    fetchWards();
    }, [city]
  );

  useEffect(() => {
    const fetchTowns = async () => {
    console.log(ward);

      if(ward){
        const towns = await getTownList(ward.id);
        if(towns){
          setTownList(towns);
        }
      }
    }
    fetchTowns();
    setTown(townList.find(town => town.name === selectedTown));
    console.log(townList);
  }, [ward]);
*/

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchWithRetry = async (fetchFunction, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fetchFunction();
    } catch (error) {
      if (error.response?.status === 429 && retries < maxRetries) {
        retries++;
        await sleep(1000); // Nghỉ 1 giây trước khi thử lại
      } else {
        throw error;
      }
    }
  }
};

useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        const location = await fetchWithRetry(() => getPlaceDetail(locationId, token));
        if(location){
          setAddress(location.address);
          const addressArr = location.address.split(',').map(item => item.trim());
          const selectedCityName = addressArr[addressArr.length - 1];
          const selectedWardName = addressArr[addressArr.length - 2];
          const selectedTownName = addressArr[addressArr.length - 3];

          setSelectedCity(selectedCityName);
          setSelectedWard(selectedWardName);
          setSelectedTown(selectedTownName);
          
          const foundCity = cityList.find(city => city.name === selectedCityName);
          setCity(foundCity);
          console.log(selectedCityName, selectedWardName, selectedTownName, foundCity);
          
          setFormData({
            name: location.name,
            region: addressArr[0],
            district: addressArr[1],
            place: addressArr[2],
            placeDetail: addressArr[0],
            openTime: location.open_time,
            closingTime: location.close_time,
            ageGroupStart: location.age_start,
            ageGroupEnd: location.age_end,
            visitorsAdult: location.adult_price,
            visitorsChild: location.child_price,
            dailyVisitors: location.number_tourist,
            description: location.description,
            image: location.images,
          });
        }
      } catch (error) {
        console.error("Error fetching place detail:", error);
      }
    };

    if (locationId && token) fetchPlaceDetail();
  }, [locationId, token, cityList]);

  useEffect(() => {
    const fetchWards = async () => {
      if(city){
        try {
          const wards = await fetchWithRetry(() => getWardList(city.id));
          if(wards){
            setWardList(wards);
            setWard(wards.find(ward => ward.name === selectedWard));
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      }
    };

    if (city) fetchWards();
  }, [city]);

  useEffect(() => {
    const fetchTowns = async () => {
      if(ward){
        try {
          const towns = await fetchWithRetry(() => getTownList(ward.id));
          if(towns){
            setTownList(towns);
            setTown(towns.find(town => town.name === selectedTown));
          }
        } catch (error) {
          console.error("Error fetching towns:", error);
        }
      }
    };

    if (ward) fetchTowns();
  }, [ward]);


  const handleEditClick = (field) => {
    // Chuyển trạng thái của trường này thành editable
    setIsEditable((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Xử lý khi người dùng nhấn nút tạo
    e.preventDefault();
    const data = {
      name: formData.name,
      address: `${formData.placeDetail}, ${formData.place}, ${formData.district}, ${formData.region}`,
      open_time: formData.openTime,
      close_time: formData.closingTime,
      type:'',
      age_start: formData.ageGroupStart,
      age_end: formData.ageGroupEnd,
      adult_price: formData.visitorsAdult,
      child_price: formData.visitorsChild,
      number_tourist: formData.dailyVisitors,
      description: formData.description,
      images: formData.image,
    };

    try {
      const response = await axios.put(`http://localhost:8000/api/v1/locations/${locationId}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        toast.success(response.data.message);
        navigate('/admin/admin-place-list');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    }
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
                onChange={handleChange}
                readOnly={!isEditable.name}
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
                  onChange={handleChange}
                  disabled={!isEditable.region}
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
                  onChange={handleChange}
                  disabled={!isEditable.district}
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
                  onChange={handleChange}
                  disabled={!isEditable.place}
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
                onChange={handleChange}
                readOnly={!isEditable.placeDetail}
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
                onChange={handleChange}
                readOnly={!isEditable.openTime}
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
                onChange={handleChange}
                readOnly={!isEditable.closingTime}
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
                  onChange={handleChange}
                  readOnly={!isEditable.ageGroupStart}
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
                  onChange={handleChange}
                  readOnly={!isEditable.ageGroupEnd}
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
            onChange={handleChange}
            readOnly={!isEditable.visitorsAdult}
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
            onChange={handleChange}
            readOnly={!isEditable.visitorsChild}
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
            onChange={handleChange}
            readOnly={!isEditable.dailyVisitors}
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
        </div>

        {/* Right Side */}
        <div className="right-side">
                    {/* Label 9: 画像をアップロード */}
                    <div className="form-group">
            <label className="form-label-1 image-upload-label">
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
