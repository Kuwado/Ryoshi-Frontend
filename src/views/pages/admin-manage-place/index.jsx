import React, { useState, useEffect } from 'react';
import "./index.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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

const ChipSelector = ({ selectedItems, options, onApply, onClose }) => {
  const [localSelectedItems, setLocalSelectedItems] = useState([...selectedItems]);

  const handleItemClick = (item) => {
    setLocalSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selectedItem) => selectedItem !== item)
        : [...prevSelected, item]
    );
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>旅行のスタイル</h2>

        <div className="chips-wrapper-container">
          {[0, 3, 7, 10].map((start, rowIndex) => (
            <div className="chips-row" key={rowIndex}>
              {options.slice(start, start + (rowIndex % 2 === 0 ? 3 : 4)).map((option, index) => (
                <div className="chips-wrapper" key={start + index}>
                  <input
                    type="checkbox"
                    id={`chip-${start + index}`}
                    checked={localSelectedItems.includes(option)}
                    onChange={() => handleItemClick(option)}
                  />
                  <label htmlFor={`chip-${start + index}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button className="confirm-button" onClick={() => onApply(localSelectedItems)}>
          確認
        </button>
      </div>
    </div>
  );
};

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
    type: '', // Chuỗi lưu các chip đã chọn (ví dụ: "エコツーリズム,文化旅行")
  });
const options = [
  "エコツーリズム", "文化旅行", "リゾート", "レクリエーション", "スポーツ",
  "探検", "冒険", "コンビネーション", "家族旅行", "団体旅行", "個人旅行", "ビーチ",
  "山", "都市", "田舎",
];

const [isPopupOpen, setIsPopupOpen] = useState(false);
const [selectedChips, setSelectedChips] = useState([]);
const [avatarPreview, setAvatarPreview] = useState(null); // Lưu URL của preview avatar

useEffect(() => {
  if (formData.type) {
    setSelectedChips(formData.type.split(","));
  }
}, [formData.type]);

const handleTypeEditClick = () => {
  setIsPopupOpen(true);
};

const handleApplyChips = (selectedItems) => {
  setSelectedChips(selectedItems);
  setFormData((prevData) => ({
    ...prevData,
    type: selectedItems.join(','), // Gộp thành chuỗi khi gửi lên backend
  }));
  setIsPopupOpen(false);
};

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

  const [cityList, setCityList] = useState([]);

useEffect(() => {
  const fetchPlaceDetail = async () => {
    try {
      const location = await getPlaceDetail(locationId, token);
      if (location) {
        // Xử lý avatar
        const avatarUrl = location.avatar
          ? `http://localhost:8000/uploads/${location.avatar}` // URL đầy đủ từ backend
          : null;

        // Xử lý images (chuyển chuỗi thành mảng URL)
        const imageUrls = location.images
          ? location.images.split(',').map((image) => `http://localhost:8000/uploads/${image}`)
          : [];

        setAvatarPreview(avatarUrl);
        setImages(imageUrls); // Lưu danh sách ảnh từ backend vào state

        // Xử lý địa chỉ và các thông tin khác
        const addressArr = location.address.split(',').map((item) => item.trim());

        setFormData({
          name: location.name,
          region: addressArr[addressArr.length - 1],
          district: addressArr[addressArr.length - 2],
          place: addressArr[addressArr.length - 3],
          placeDetail: addressArr[0],
          openTime: location.open_time,
          closingTime: location.close_time,
          ageGroupStart: location.age_start,
          ageGroupEnd: location.age_end,
          visitorsAdult: location.adult_price,
          visitorsChild: location.child_price,
          dailyVisitors: location.number_tourist,
          description: location.description,
          type: location.type || '', // Chuỗi type từ backend
        });

        setSelectedChips(location.type ? location.type.split(',') : []); // Phân tách type thành mảng
      }
    } catch (error) {
      console.error('Error fetching place detail:', error);
    }
  };

  if (locationId && token) fetchPlaceDetail();
}, [locationId, token, cityList]);

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


  // Avatar Management
const [avatar, setAvatar] = useState(null); // Avatar mới
const [avatarUrl, setAvatarUrl] = useState(null); // URL avatar cũ

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAvatar(file);
    setAvatarUrl(null); // Xóa URL cũ khi có ảnh mới
    setAvatarPreview(URL.createObjectURL(file)); // Hiển thị preview
  }
};

const handleRemoveAvatar = () => {
  setAvatar(null);
  setAvatarUrl(null); // Xóa cả avatar mới và cũ
  setAvatarPreview(null);
};

// Images Management
const [images, setImages] = useState([]); // Danh sách URL ảnh cũ
const [newImages, setNewImages] = useState([]); // File ảnh mới

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  const previews = files.map((file) => URL.createObjectURL(file));

  setNewImages((prev) => [...prev, ...files]);
  setImages((prev) => [...prev, ...previews]);
};

const handleRemoveImage = (index) => {
  console.log(index, images)
  console.log(newImages)
  setImages((prev) => prev.filter((_, i) => i !== index));
  setNewImages((prev) => prev.filter((_, i) => i !== index - images.length)); // Loại bỏ ảnh mới
  console.log(newImages)
};

// Submit Logic
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append('name', formData.name);
  data.append('address', `${formData.placeDetail}, ${formData.place}, ${formData.district}, ${formData.region}`);
  data.append('open_time', formData.openTime);
  data.append('close_time', formData.closingTime);
  data.append('type', formData.type);
  data.append('age_start', formData.ageGroupStart);
  data.append('age_end', formData.ageGroupEnd);
  data.append('adult_price', formData.visitorsAdult);
  data.append('child_price', formData.visitorsChild);
  data.append('number_tourist', formData.dailyVisitors);
  data.append('description', formData.description);
  
  console.log(images)

  const imageNames = images.map(url => {
    const parts = url.split('/');
    return parts[parts.length - 1]; // Lấy phần cuối cùng là tên file
  });

  // Avatar Handling
  if (avatar) {
    data.append('avatar', avatar);
  } else if (avatarUrl) {
    data.append('avatar', avatarUrl); // Giữ lại avatar cũ
  }

  // Images Handling
  newImages.forEach((file) => {
    data.append('images', file); // Gửi ảnh mới
  });
  data.append('images', JSON.stringify(imageNames)); // Gửi URL ảnh cũ

  try {
    const response = await axios.put(`http://localhost:8000/api/v1/locations/${locationId}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      toast.success('更新が成功しました！');
      navigate('/admin/admin-place-list');
    }
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    toast.error('エラーが発生しました！');
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
                className="input-field-form"
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
      src={require("../../../assets/images/Vector2.png")}
      alt="Icon"
      className="form-icon"
    />
    場所：
  </label>
  <div className="selectors-container">
    {/* Input cho Thành phố */}
    <input
      type="text"
      name="city"
      value={formData.region}
      onChange={(e) => setFormData({ ...formData, region: e.target.value })} // Cập nhật giá trị cho region
      className="select-field"
      placeholder="市"
    />

    {/* Input cho Quận/Huyện */}
    <input
      type="text"
      name="ward"
      value={formData.district}
      onChange={(e) => setFormData({ ...formData, district: e.target.value })} // Cập nhật giá trị cho district
      className="select-field"
      placeholder="地区"
    />

    {/* Input cho Phường/Xã */}
    <input
      type="text"
      name="town"
      value={formData.place}
      onChange={(e) => setFormData({ ...formData, place: e.target.value })} // Cập nhật giá trị cho place
      className="select-field"
      placeholder="区"
    />
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
                className="input-field-form"
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
                className="input-field-form"
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
                className="input-field-form"
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
                  className="input-field-form"
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
                  className="input-field-form"
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
            className="input-field-form"
            placeholder=""
          />
          <button
            onClick={() => handleEditClick('visitorsAdult')}
            className="edit-btn1"
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
            className="input-field-form"
            placeholder=""
          />
          <button
            onClick={() => handleEditClick('visitorsChild')}
            className="edit-btn1"
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
            className="input-field-form"
            placeholder=""
          />
          <button
            onClick={() => handleEditClick('dailyVisitors')}
            className="edit-btn1"
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
          {/* Type Section */}
          <div className="form-group">
  <label className="form-label">
    <img
      src={require('../../../assets/images/Vector14.png')}
      alt="Icon"
      className="form-icon"
    />
    旅行のスタイル：
  </label>
  <div className="image-placeholder" onClick={() => setIsPopupOpen(true)}>
    <img
      src={require('../../../assets/images/Vector15.png')}
      alt="Click to select"
      className="select-image"
    />
  </div>

  {/* Hiển thị các chip đã chọn */}
  <div className="selected-chips">
    {selectedChips.map((chip, index) => (
      <div key={index} className="chips-wrapper">
        <label>{chip}</label>
      </div>
    ))}
  </div>

  {/* Popup ChipSelector */}
  {isPopupOpen && (
    <ChipSelector
      selectedItems={selectedChips}
      options={options}
      onApply={handleApplyChips}
      onClose={() => setIsPopupOpen(false)}
    />
  )}
</div>


        </div>

        {/* Right Side */}
        <div className="right-side">
{/* Avatar Upload Section */}
<div className="form-group">
  <label htmlFor="avatar-upload" className="form-label-1 upload-label">
    <img
      src={require('../../../assets/images/Vector9.png')}
      alt="Icon"
      className="form-icon"
    />
    アバター画像をアップロード：
  </label>
  <div className="image-upload">
    <input
      type="file"
      name="avatar"
      id="avatar-upload"
      onChange={handleAvatarChange}
      className="image-input"
      style={{ display: 'none' }}
    />
    {avatarPreview ? (
      <div className="image-preview">
        <img
          src={avatarPreview}
          alt="Avatar Preview"
          className="preview-image"
        />
        <button onClick={handleRemoveAvatar} className="remove-image">
          <img
            src={require('../../../assets/images/Vector13.png')}
            alt="Remove"
            className="remove-icon"
          />
        </button>
      </div>
    ) : (
      <div className="image-placeholder">
        <label htmlFor="avatar-upload" className="select-image">
        </label>
      </div>
    )}
  </div>
</div>

{/* Images Upload Section */}
<div className="form-group">
  <label htmlFor="images-upload" className="form-label-1 image-upload-label">
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
      name="images"
      id="images-upload"
      onChange={handleImageChange}
      className="image-input"
      multiple
      style={{ display: 'none' }}
    />
    <label htmlFor="images-upload" className="select-image">
    </label>
    <div className="image-preview-container">
      {images.map((image, index) => (
        <div key={index} className="image-preview">
          <img
            src={image}
            alt={`Preview ${index}`}
            className="preview-image"
          />
          <button onClick={() => handleRemoveImage(index)} className="remove-image">
            <img
              src={require('../../../assets/images/Vector13.png')}
              alt="Remove"
              className="remove-icon"
            />
          </button>
        </div>
      ))}
    </div>
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
