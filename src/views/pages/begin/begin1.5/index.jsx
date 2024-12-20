import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import UploadProfile from "../../../../components/uploadProfile";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";
import Button from "../../../../components/button";
import BeginNavLink from "../../../../components/beginNavLink/beginNavLink";

function Begin1_5() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const token = sessionStorage.getItem("authToken");
  const userId = JSON.parse(sessionStorage.getItem("auth")).id

  const base64ToBlob = (base64Data, contentType = '') => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteNumbers], { type: contentType });
  };

  const handleNextClick = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      navigate("/user/begin1.6");
      return;
    }

    // Tách phần 'data:image/png;base64,' ra để lấy dữ liệu Base64
    const base64String = selectedImage.split(',')[1]; // Lấy phần sau dấu phẩy
    const contentType = selectedImage.split(';')[0].split(':')[1]; // Lấy content type

    // Chuyển đổi Base64 sang Blob
    const blob = base64ToBlob(base64String, contentType);

    const formData = new FormData();
    formData.append("file", blob, 'avatar.png');

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/ava/" + userId,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      navigate("/user/begin1.6");
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="begin1-container">
      <div className="begin1-header">
        <h1 className="begin1-title">アバターを更新する</h1>
        <BeginNavLink />
      </div>

      <div className="begin1-content">
        <div className="begin1-form-section">
          <form>
            <UploadProfile onImageSelect={setSelectedImage} />
            <Button label="次のステップ" className="begin1-submit-button" onClick={handleNextClick}>
            </Button>
            <button className="begin1-5-skip-button" onClick={() => navigate("/user/begin1.6")}>スキップこのステップ</button>
          </form>
        </div>

        <div className="image-section">
          <img src={Begin1_1} className="begin1-image item-1" />
          <img src={Begin1_2} className="begin1-image item-2" />
          <img src={Begin1_3} className="begin1-image item-3" />
          <img src={Begin1_4} className="begin1-image item-4" />
        </div>
      </div>
    </div>
  );
}

export default Begin1_5;
