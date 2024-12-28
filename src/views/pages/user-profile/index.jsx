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
import Collection from "../../../components/collection";
import "./index.css";
import { CustomersInformation, CustomersInformationUpdate, CustomersAvatar } from "./userprofileapi";
import { format } from 'date-fns';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hobbies, setHobbies] = useState([]); // Danh sách sở thích
  const [selectedImage, setSelectedImage] = useState(null); // Dữ liệu từ API
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedChips, setSelectedChips] = useState([]);
  const [showAddButton, setShowAddButton] = useState(false);
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
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await CustomersInformation(token, id);
        
        setFormData({
          image: user.user.ava,
          name: user.user.name,
          birthday: format(new Date(user.user.dob), 'yyyy-MM-dd'),
          phone: user.user.phone,
          email: user.user.email,
          location: user.user.address,
          interest: user.user.interest,
          liked: user.user.liked_location,
          gone: user.user.gone_location,
        });

        const interests = user.user.interest?.split(',').map((interest) => interest.trim());
        setHobbies(interests);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("ユーザーデータの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, id]);

  const handleChangedImage = async () => {
    try {
      const response = await CustomersAvatar(token, id, selectedImage);

      if (response.status === 200) {
        console.log("アバターを更新しました");
      } else {
        console.log("アバターの更新に失敗しました");
      }
    } catch (error) {
      console.error("Error updating user avatar:", error);
      console.log("アバターの更新に失敗しました");
    }
  };

  const handleChangeInfo = async () => {
    const data = {
      name: formData.name,
      dob: formData.birthday,
      phone: formData.phone,
      email: formData.email,
      address: formData.location,
      interest: formData.interest,
    };

    try {
      const response = await CustomersInformationUpdate(data, token, id);

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsButtonVisible(!isButtonVisible);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("更新に失敗しました");
    }
  };

  const SaveButtons = async () => {
    if (selectedImage) {
      await handleChangedImage();
    }

    await handleChangeInfo();

    handleToggleButtons();
  };

  const handleToggleButtons = () => {
    setShowAddButton(prev => !prev); // Chuyển đổi trạng thái hiển thị của nút +
    setIsButtonVisible(!isButtonVisible);
    setIsEditing(!isEditing);
  };

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
          <h2>趣味</h2>
          <div className="chips-wrapper-container">
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
    setIsPopupOpen(true);
  };

  const handleApply = (selectedItems) => {
    setSelectedChips(selectedItems);
    setFormData((prevData) => {
      const currentInterest = prevData.interest ? prevData.interest.split(",") : [];
      const updatedInterest = Array.from(new Set([...currentInterest, ...selectedItems])).join(",");
      return {
        ...prevData,
        interest: updatedInterest,
      };
    });
    setIsPopupOpen(false);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const likeDetail = () => {
    navigate('/user/travel-list/all', { state: { likeState: {key: "like", value: "好き"} } });
  };

  const goneDetail = () => {
    navigate('/user/travel-list/all', { state: { goneState:  {key: "visited", value: "行ってきました"} } });
  };

  if (loading) {
    return <div>読み込み中...</div>; // または適切なローディングインジケーター
  }

  return (
    <div className="user-profile">
      <h1 className="title-user-head">プロフィール</h1>
      <div className="user-profile-wrap">
        <div className="user-profile-image">
          <UploadProfile 
            onImageSelect={setSelectedImage} 
            defaultImage={formData.image ? `http://localhost:8000/uploads/${formData.image}` : null}
          />
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
          />
        </div>
      </div>
      <div className="user-hobby">
        <div className="user-profile-title">
          <FontAwesomeIcon icon={faThumbsUp} className="color-icon" style={{fontSize: "25px"}} />
          <label className="label-title">
            趣味
          </label>
        </div>
        <div className="user-hobby-button">
          <div className="user-hobby-button-item">
            {hobbies?.map((hobby, index) => (
              <Button
                key={index}
                label={hobby}
                className="user-button-hobby"
                type="user-submit-hobby"
              />
            ))}
          </div>
          <div className="selected-chips">
            {selectedChips.map((chip, index) => (
              <div key={index} className="chips-wrapper">
                <Button
                  key={index}
                  label={chip}
                  className="user-button-hobby"
                  type="user-submit-hobby"
                />
              </div>
            ))}
          </div>
          <Button
            label="+"
            className="user-button-addhobby"
            type="user-submit-addhobby"
            onClick={handleImageClick}
          />
          <div className="selected-chips">
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
      <div className="favoritelocation">
        <div className="space-between">
          <div className="user-profile-title">
            <FontAwesomeIcon icon={faHeart} className="color-icon" style={{fontSize: "25px"}} />
            <label className="label-title">
              好きな場所
            </label>
          </div>
          <div className="detail" onClick={likeDetail}>詳細を見る</div>
        </div>
        <Collection
          collectionData={formData.liked}
          itemsNumber={4}
          showIndicator={false}
          showPagination={false}
          rowNumber={1}
        />
      </div>
      <div className="gonelocation">
        <div className="space-between">
          <div className="user-profile-title">
            <FontAwesomeIcon icon={faPersonHiking} className="color-icon" style={{fontSize: "32px"}} />
            <label className="label-title">
              訪れた場所
            </label>
          </div>
          <div className="detail" onClick={goneDetail}>詳細を見る</div>
        </div>
        <Collection
          collectionData={formData.gone}
          itemsNumber={4}
          showIndicator={false}
          showPagination={false}
          rowNumber={1}
        />
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
              />
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
              />
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;