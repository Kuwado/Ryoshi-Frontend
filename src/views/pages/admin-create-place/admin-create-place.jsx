import React, { useState } from 'react';
import './admin-create-place.css';

const AdminCreatePlace = () => {
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    region: '',
    district: '',
    description: '',
    businessHours: '',
    closingTime: '',
    ageGroupStart: '',
    ageGroupEnd: '',
    ticketPrice: '',
    visitorsAdult: '',
    visitorsChild: '',
    dailyVisitors: '',
    image: null,
  });

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

  const handleSubmit = () => {
    console.log(formData);
    // Logic to submit the form
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
                value={formData.region}
                onChange={handleChange}
                className="select-field"
              >
                <option value="" disabled>市</option>
                <option value="option1">option1</option>
                <option value="option2">option2</option>
                <option value="option3">option3</option>
              </select>

              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="select-field"
              >
                <option value="" disabled>地区</option>
                <option value="option1">option1</option>
                <option value="option2">option2</option>
                <option value="option3">option3</option>
              </select>

              <select
                name="place"
                value={formData.place}
                onChange={handleChange}
                className="select-field"
              >
                <option value="" disabled>区</option>
                <option value="option1">option1</option>
                <option value="option2">option2</option>
                <option value="option3">option3</option>
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
