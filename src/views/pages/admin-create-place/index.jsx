import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { toast } from "react-toastify";

async function getCityList() {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch(
      "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1",
      {
        method: "GET",
      }
    );

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map((city) => ({
      name: city.name,
      id: city.code,
    }));
  } catch (error) {
    console.error("Có lỗi xảy ra khi gửi dữ liệu:", error);
    return null;
  }
}

async function getWardList(cityId) {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${cityId}&limit=-1`,
      {
        method: "GET",
      }
    );

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map((ward) => ({
      name: ward.name,
      id: ward.code,
    }));
  } catch (error) {
    console.error("Có lỗi xảy ra khi gửi dữ liệu:", error);
    return null;
  }
}

async function getTownList(wardId) {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch(
      `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${wardId}&limit=-1`,
      {
        method: "GET",
      }
    );

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.data.data.map((town) => ({
      name: town.name,
      id: town.code,
    }));
  } catch (error) {
    console.error("Có lỗi xảy ra khi gửi dữ liệu:", error);
    return null;
  }
}
const ChipSelector = ({ selectedItems, options, onApply, onClose }) => {
  const [localSelectedItems, setLocalSelectedItems] = useState([
    ...selectedItems,
  ]);

  const handleItemClick = (item) => {
    setLocalSelectedItems((prevSelected) => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter((selectedItem) => selectedItem !== item);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Tiêu đề */}
        <h2>旅行のスタイル</h2>

        {/* Wrapper cho tất cả các dòng chip */}
        <div className="chips-wrapper-container">
          {/* Dòng 1: 3 chip */}
          <div className="chips-row">
            {options.slice(0, 3).map((option, index) => (
              <div className="chips-wrapper" key={index}>
                <input
                  type="checkbox"
                  id={`chip-${index}`}
                  checked={localSelectedItems.includes(option)}
                  onChange={() => handleItemClick(option)}
                />
                <label htmlFor={`chip-${index}`}>{option}</label>
              </div>
            ))}
          </div>

          {/* Dòng 2: 4 chip */}
          <div className="chips-row">
            {options.slice(3, 7).map((option, index) => (
              <div className="chips-wrapper" key={index}>
                <input
                  type="checkbox"
                  id={`chip-${index + 3}`}
                  checked={localSelectedItems.includes(option)}
                  onChange={() => handleItemClick(option)}
                />
                <label htmlFor={`chip-${index + 3}`}>{option}</label>
              </div>
            ))}
          </div>

          {/* Dòng 3: 3 chip */}
          <div className="chips-row">
            {options.slice(7, 10).map((option, index) => (
              <div className="chips-wrapper" key={index}>
                <input
                  type="checkbox"
                  id={`chip-${index + 7}`}
                  checked={localSelectedItems.includes(option)}
                  onChange={() => handleItemClick(option)}
                />
                <label htmlFor={`chip-${index + 7}`}>{option}</label>
              </div>
            ))}
          </div>

          {/* Dòng 4: 4 chip */}
          <div className="chips-row">
            {options.slice(10, 14).map((option, index) => (
              <div className="chips-wrapper" key={index}>
                <input
                  type="checkbox"
                  id={`chip-${index + 10}`}
                  checked={localSelectedItems.includes(option)}
                  onChange={() => handleItemClick(option)}
                />
                <label htmlFor={`chip-${index + 10}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Nút 確認 */}
        <button
          className="confirm-button"
          onClick={() => onApply(localSelectedItems)}
        >
          確認
        </button>
      </div>
    </div>
  );
};
const AdminCreatePlace = () => {
  const [formData, setFormData] = useState({
    name: "", // Tên địa điểm
    region: "", // Thành phố 市
    district: "", // Khu vực
    place: "", // Quận 区
    placeDetail: "", // Chi tiết vị trí
    openTime: "", // Giờ làm việc 営業時間 (Thời gian mở cửa)
    closingTime: "", // Giờ đóng cửa 閉店時間 (Giờ đóng cửa địa điểm)
    ageGroupStart: "", // Tuổi bắt đầu 適齢期 (Tuổi tối thiểu phù hợp để tham quan địa điểm)
    ageGroupEnd: "", // Tuổi kết thúc 適齢期 (Tuổi tối đa phù hợp để tham quan địa điểm)
    visitorsAdult: "", // Giá vé khách người lớn 訪問者数
    visitorsChild: "", // Giá vé khách trẻ em 訪問者数
    dailyVisitors: "", // Số khách tham quan mỗi ngày 訪問者数
    description: "", // Mô tả
    images: [],
    avatar: null,
    type: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedChips, setSelectedChips] = useState([]);

  const options = [
    "エコツーリズム",
    "文化旅行",
    "リゾート",
    "レクリエーション",
    "スポーツ",
    "探検",
    "冒険",
    "コンビネーション",
    "家族旅行",
    "団体旅行",
    "個人旅行",
    "ビーチ",
    "山",
    "都市",
    "田舎",
  ];

  const handleImageClick = () => {
    setIsPopupOpen(true); // Mở pop-up
  };

  const handleApply = (selectedItems) => {
    setSelectedChips(selectedItems);
    setFormData((prevData) => ({
      ...prevData,
      type: selectedItems.join(","), // Lưu selectedChips vào formData.type
    }));
    setIsPopupOpen(false); // Đóng pop-up
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Đóng pop-up
  };
  const [city, setCity] = useState(null); // Khởi tạo city với null
  const [ward, setWard] = useState(null);
  const [town, setTown] = useState(null);

  const [cityList, setCityList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [townList, setTownList] = useState([]);
  const [cityId, setCityId] = useState("");

  const token = sessionStorage.getItem("authToken");
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Chuyển file được chọn thành mảng
    const newPreviews = files.map((file) => URL.createObjectURL(file)); // Tạo URL xem trước cho ảnh mới

    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files], // Thêm ảnh mới vào danh sách ảnh cũ
      imagesPreview: [...(prevData.imagesPreview || []), ...newPreviews], // Thêm preview mới
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index), // Xóa file thực tại index
      imagesPreview: prevData.imagesPreview.filter((_, i) => i !== index), // Xóa URL preview tại index
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        avatar: file, // Lưu file thực
        avatarPreview: URL.createObjectURL(file), // Tạo URL xem trước
      }));
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: null, // Xóa file thực
      avatarPreview: null, // Xóa preview
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "address",
      `${formData.placeDetail},${town?.name || ""},${ward?.name || ""},${
        city?.name || ""
      }`.trim()
    );
    formDataToSend.append("type", formData.type); // Thêm trường type từ selectedChips
    formDataToSend.append("open_time", formData.openTime);
    formDataToSend.append("close_time", formData.closingTime);
    formDataToSend.append("age_start", formData.ageGroupStart);
    formDataToSend.append("age_end", formData.ageGroupEnd);
    formDataToSend.append("number_tourist", formData.dailyVisitors);
    formDataToSend.append("adult_price", formData.visitorsAdult);
    formDataToSend.append("child_price", formData.visitorsChild);

    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await fetch("http://localhost:8000/api/v1/locations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message);
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi dữ liệu:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-create-place">
      <div className="ad-header">
        <div className="ad-header-text">地場所を作成する</div>
      </div>

      <div className="form-container">
        <div className="left-side">
          {/* Label 1: Tên địa điểm */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector1.png")}
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
              className="input-field-form"
            />
          </div>

          {/* Label 2: Các ô selector */}
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
              <select
                name="city"
                value={city ? city.id : ""}
                onChange={handleCityChange}
                className="select-field"
              >
                <option value="" disabled>
                  市
                </option>
                {cityList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                name="ward"
                value={ward ? ward.id : ""}
                onChange={handleWardChange}
                className="select-field"
              >
                <option value="" disabled>
                  地区
                </option>
                {wardList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                name="town"
                value={town ? town.id : ""}
                onChange={handleTownChange}
                className="select-field"
              >
                <option value="" disabled>
                  区
                </option>
                {townList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Label 3: 場所の詳細 */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector3.png")}
                alt="Icon"
                className="form-icon"
              />
              場所の詳細：
            </label>
            <input
              type="text"
              name="placeDetail"
              value={formData.placeDetail}
              onChange={handleChange}
              className="input-field-form"
            />
          </div>

          {/* Label 4: 営業時間 */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector4.png")}
                alt="Icon"
                className="form-icon"
              />
              営業時間：
            </label>
            <input
              type="text"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              className="input-field-form"
            />
          </div>

          {/* Label 5: 閉店時間 */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector5.png")}
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
              className="input-field-form"
            />
          </div>
          {/* Label 6: 適齢期 với 2 ô */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector6.png")}
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
                className="input-field-form"
                placeholder="開始年齢"
              />
              <div className="age-text">から</div>
              <input
                type="number"
                name="ageGroupEnd"
                value={formData.ageGroupEnd}
                onChange={handleChange}
                className="input-field-form"
                placeholder="終了年齢"
              />
              <div className="age-text">まで</div>
            </div>
          </div>

          {/* Label 7: チケット価格 */}
          <div className="form-group-2">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector7.png")}
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
                className="input-field-form"
              />
            </div>
            <div className="visit-group">
              <div className="visit-text">子供（ドン）</div>
              <input
                type="number"
                name="visitorsChild"
                value={formData.visitorsChild}
                onChange={handleChange}
                className="input-field-form"
              />
            </div>
          </div>

          {/* Label 8: 訪問者数 (人/日) */}
          <div className="form-group-2">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector8.png")}
                alt="Icon"
                className="form-icon"
              />
              訪問者数 :
            </label>
            <div className="visit-group">
              <div className="visit-text">人/日</div>
              <input
                type="number"
                name="dailyVisitors"
                value={formData.dailyVisitors}
                onChange={handleChange}
                className="input-field-form daily-input"
              />
            </div>
          </div>

          {/* type */}
          <div className="form-group">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector14.png")}
                alt="Icon"
                className="form-icon"
              />
              名前：
            </label>
            <div className="image-placeholder" onClick={handleImageClick}>
              <img
                src={require("../../../assets/images/Vector15.png")}
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

            {/* Mở pop-up chọn chip */}
            {isPopupOpen && (
              <ChipSelector
                selectedItems={selectedChips}
                options={options}
                onApply={handleApply}
                onClose={handleClosePopup}
              />
            )}
          </div>
        </div>

        <div className="right-side">
          {/* Label: アバター画像をアップロード */}
          <div className="form-group">
            <label
              htmlFor="avatar-upload"
              className="form-label-1 upload-label"
            >
              <img
                src={require("../../../assets/images/Vector9.png")}
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
                style={{ display: "none" }} // Ẩn input file
              />
              {formData.avatarPreview && (
                <div className="image-preview">
                  <img
                    src={formData.avatarPreview} // Dùng preview
                    alt="Avatar Preview"
                    className="preview-image"
                  />
                  <button onClick={handleRemoveAvatar} className="remove-image">
                    <img
                      src={require("../../../assets/images/Vector13.png")}
                      alt="Remove"
                      className="remove-icon"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Label 9: 画像をアップロード */}
          <div className="form-group">
            <label htmlFor="image-upload" className="form-label-1 upload-label">
              <img
                src={require("../../../assets/images/Vector9.png")}
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
                multiple // Cho phép chọn nhiều ảnh
                style={{ display: "none" }} // Ẩn input file đi
              />
              {formData.imagesPreview && formData.imagesPreview.length > 0 && (
                <div className="image-preview-container">
                  {formData.imagesPreview.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={preview} // Hiển thị preview
                        alt={`Preview ${index}`}
                        className="preview-image"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image"
                      >
                        <img
                          src={require("../../../assets/images/Vector13.png")}
                          alt="Remove"
                          className="remove-icon"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <img
                src={require("../../../assets/images/Vector10.png")}
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
            src={require("../../../assets/images/Vector11.png")}
            alt="Create"
            className="form-icon"
          />
          作る
        </button>
        <button className="btn-cancel">
          <img
            src={require("../../../assets/images/Vector12.png")}
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
