import React, { useState, useEffect } from "react";
import UploadProfile from "../../../components/uploadProfile";
import Button from "../../../components/button";
import {
  faThumbsUp,
  faHeart,
  faPersonHiking,
  faCircleCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button as AntdButton, Input } from "antd";
import axios from "axios";
import Collection from "../../../components/collection";
import "./index.css";
import { CustomersInformation, CustomersInformationUpdate } from "./userprofileapi";
import { format } from 'date-fns';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const UserProfile = () => {
  const [hobbies, setHobbies] = useState([]); // Danh sách sở thích
  const [collections, setCollections] = useState([]); // Dữ liệu từ API
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedChips, setSelectedChips] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    phone: "",
    email: "",
    location: "",
    interest: "",
    liked: [],
    gone: [],
    image:"",
  });
  const options = [
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
  const token = sessionStorage.getItem("authToken");
  const id = JSON.parse(sessionStorage.getItem("auth")).id;

  useEffect(() => {
    const userData = async () => {
      const user = await CustomersInformation(token, id);
      setFormData({
        name: user.user.name,
        birthday: format(new Date(user.user.dob), 'yyyy-MM-dd'),
        phone: user.user.phone,
        email: user.user.email,
        location: user.user.address,
        interest: user.user.interest,
        liked: user.user.liked_location,
        gone: user.user.gone_location,
        image: user.user.ava,
      }); // Lưu dữ liệu vào state
    };

    userData();
    console.log(formData.interest);
  }, []);

  const SaveButtons = async () => {
    const data = {
      name: formData.name,
      dob: formData.birthday,
      phone: formData.phone,
      email: formData.email,
      address: formData.location,
      interest: formData.interest,
    };
    const response = await CustomersInformationUpdate(data, token, id);
    console.log(response.data);

    if (response.status === 200) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
      console.error("Error fetching customer:", response.data.message);
    }
  }
  const handleToggleButtons = () => {
    setIsButtonVisible(!isButtonVisible);
    setIsEditing(!isEditing); // Bật/tắt chế độ chỉnh sửa
  };

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
        <h2>趣味</h2>

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
  return (
    <div className="user-profile">
      <h1 className="title-user-head">プロフィール</h1>
      <div className="user-profile-wrap">
        <div className="user-profile-image">
          <UploadProfile />
        </div>
        <div className="user-profile-info">
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/Vector.png")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">名前：</span>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.name}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/birthday.jpg")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">生年月日：</span>
            {isEditing ? (
              <Input
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.birthday}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/phone.jpg")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">電話番号：</span>
            {isEditing ? (
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.phone}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/mail.jpg")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">メール：</span>
            {isEditing ? (
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.email}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/Vector3.png")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">場所：</span>
            {isEditing ? (
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.location}</span>
            )}
          </div>
        </div>
        <div className="user-profile-button">
          <Button
            label="編集"
            className="user-button"
            type="user-submit"
            onClick={handleToggleButtons}
          ></Button>
        </div>
      </div>
      <div className="user-hobby">
        <label className="title-user">
          <FontAwesomeIcon icon={faThumbsUp} className="color-icon" />
          趣味
        </label>
        <div className="user-hobby-button">
          <div className="user-hobby-button-item">
          {/* Các nút mặc định */}
          <Button
           label={formData.interest?.split(",") || "Default Label"}
           className="user-button-hobby"
           type="user-submit-hobby"
          />
          <Button
           label={formData.interest?.split(",") || "Default Label"}
           className="user-button-hobby"
           type="user-submit-hobby"
          />
          {/* Danh sách sở thích */}
          {hobbies.map((hobby, index) => (
            <Button
              key={index}
              label={hobby}
              className="user-button-hobby"
              type="user-submit-hobby"
            ></Button>
          ))}
          </div>
          {/* Nút thêm sở thích */}
          <div className="selected-chips">
              {selectedChips.map((chip, index) => (
                <div key={index} className="chips-wrapper">
                  <Button
                   key={index}
                   label={chip}
                   className="user-button-hobby"
                   type="user-submit-hobby"
                  ></Button>
                </div>
              ))}
            </div>
          <Button
            label="+"
            className="user-button-addhobby"
            type="user-submit-addhobby"
            onClick={handleImageClick}
          ></Button>
           {/* Hiển thị các chip đã chọn */}
           <div className="selected-chips">

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
      </div>
      <div class="favoritelocation">
        <label className="favarite-title">
          <FontAwesomeIcon icon={faHeart} className="color-icon" />
          好きな場所
        </label>
        <Collection
          collectionData={formData.liked}
          itemsNumber={4}
          showIndicator={false}
          showPagination={false}
          rowNumber={1}
        ></Collection>
      </div>
      <div class="gonelocation">
        <label className="gone-title">
          <FontAwesomeIcon icon={faPersonHiking} className="color-icon" />
          訪れた場所
        </label>
        <Collection
          collectionData={formData.gone}
          itemsNumber={4}
          showIndicator={false}
          showPagination={false}
          rowNumber={1}
        ></Collection>
      </div>
      <div className="user-button">
        {!isButtonVisible && (
          <div style={{ display: "flex" }}>
            <div className="user-button-edit">
              <Button
                label={
                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} /> 保存
                  </div>
                }
                className="user-button-editsave1"
                type="user-submit"
                onClick={SaveButtons}
              ></Button>
            </div>
            <div className="user-button-edit">
              <Button
                label={
                  <div>
                    <FontAwesomeIcon icon={faX} /> キャンセル
                  </div>
                }
                className="user-button-editsave2"
                type="user-submit"
                onClick={handleToggleButtons}
              ></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
