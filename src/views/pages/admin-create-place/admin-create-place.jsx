import React, { useState } from 'react';
import './admin-create-place.css';
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

const AdminCreatePlace = () => {
  const [formData, setFormData] = useState({
    name: '', // Tên địa điểm
    region: '', // Thành phố 市 
    district: '', // Khu vực 
    place: '', // Quận 区 
    description: '', // Mô tả
    businessHours: '', // Giờ làm việc 営業時間 (Thời gian mở cửa)
    closingTime: '', // Giờ đóng cửa 閉店時間 (Giờ đóng cửa địa điểm)
    ageGroupStart: '', // Tuổi bắt đầu 適齢期 (Tuổi tối thiểu phù hợp để tham quan địa điểm)
    ageGroupEnd: '', // Tuổi kết thúc 適齢期 (Tuổi tối đa phù hợp để tham quan địa điểm)
    ticketPrice: '', // Giá vé チケット価格 (Giá vé cho khách tham quan)
    visitorsAdult: '', // Số lượng khách người lớn 訪問者数 
    visitorsChild: '', // Số lượng khách trẻ em 訪問者数 
    dailyVisitors: '', // Số khách tham quan mỗi ngày 訪問者数 
    image: null,
  });

  const [city, setCity] = useState(null); // Khởi tạo city với null
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: URL.createObjectURL(file), // Hiển thị hình ảnh ngay sau khi chọn
    }));
  };

  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: null, // Xóa hình ảnh khi ấn X
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    // Logic to submit the form
    const body = {
      name: formData.name,
      description: formData.description,
      address: town + "," + ward + "," + city,
      type:'',
      open_time: '',
      close_time: '',
      age_start: formData.ageGroupStart,
      age_end: formData.ageGroupEnd,
      image: formData.image,
      number_tourist: 
    }
  };

  return (
    <div className="admin-create-place">
      <div className="header">
        <div className="header-text">地場所を作成する</div>
      </div>

      <div className="form-container">
        <div className="left-side">

          {/* Label 1: Tên địa điểm */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector1.png')}
                alt="Icon"
                className="form-icon"
              />
              名前：
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Label 2: Các ô selector */}
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
              <select
                name="region"
                value={city ? city.id : ''}
                onChange={handleCityChange}
                className="select-field"
              >
                <option value="" disabled>市</option>
                {cityList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                name="district"
                value={ward ? ward.id : ''}
                onChange={handleWardChange}
                className="select-field"
              >
                <option value="" disabled>地区</option>
                {wardList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                name="place"
                value={town ? town.id : ''}
                onChange={handleChange}
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

          {/* Label 3: 営業時間 */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector3.png')}
                alt="Icon"
                className="form-icon"
              />
              営業時間：
            </label>
            <input
              type="text"
              name="businessHours"
              value={formData.businessHours}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Label 4: 閉店時間 */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector4.png')}
                alt="Icon"
                className="form-icon"
              />
              閉店時間：
            </label>
            <input
              type="text"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Label 5: 適齢期 với 2 ô */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector5.png')}
                alt="Icon"
                className="form-icon"
              />
              適齢期：
            </label>
            <div className="age-group">
              <input
                type="number"
                name="ageGroupStart"
                value={formData.ageGroupStart}
                onChange={handleChange}
                className="input-field"
                placeholder="開始年齢"
              />
              <div className="age-text">から</div>
              <input
                type="number"
                name="ageGroupEnd"
                value={formData.ageGroupEnd}
                onChange={handleChange}
                className="input-field"
                placeholder="終了年齢"
              />
              <div className="age-text">まで</div>
            </div>
          </div>

          {/* Label 6: チケット価格 */}
          <div className="form-group">
  <label className="form-label">
    <img
      src={require('../../../assets/images/Vector6.png')}
      alt="Icon"
      className="form-icon"
    />
    チケット価格：
  </label>
  <input
    type="number"
    name="ticketPrice"
    value={formData.ticketPrice}
    onChange={handleChange}
    className="input-field"
  />
</div>

          {/* Label 7: 訪問者数 */}
          <div className="form-group-2">
            <label className="form-label">
              <img
                src={require('../../../assets/images/Vector7.png')}
                alt="Icon"
                className="form-icon"
              />
              訪問者数：
            </label>
            <div className="visit-group">
              <div className="visit-text">アダルト（ドン）</div>
              <input
                type="number"
                name="visitorsAdult"
                value={formData.visitorsAdult}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="visit-group">
              <div className="visit-text">子供（ドン）</div>
              <input
                type="number"
                name="visitorsChild"
                value={formData.visitorsChild}
                onChange={handleChange}
                className="input-field"
              />
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
              訪問者数
            </label>
            <div className="visit-group">
            <div className="visit-text">人/日</div>
              <input
                type="number"
                name="dailyVisitors"
                value={formData.dailyVisitors}
                onChange={handleChange}
                className="input-field daily-input"
              />
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
                onChange={handleFileChange}
                className="image-input"
              />
              {formData.image && (
                <div className="image-preview">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="preview-image"
                  />
                  <button onClick={handleRemoveImage} className="remove-image">
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
              onChange={handleChange}
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
    作る
  </button>
  <button className="btn-cancel">
    <img
      src={require('../../../assets/images/Vector12.png')}
      alt="Cancel"
      className="form-icon"
    />
    キャンセル
  </button>
</div>
    </div>
  );
};

export default AdminCreatePlace;
