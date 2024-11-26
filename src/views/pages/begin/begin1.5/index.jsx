import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import UploadProfile from "../../../../components/uploadProfile";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";

function Begin1_5() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI1NDU3OTQsImV4cCI6MTczNTEzNzc5NH0.OAkbvzKUhceuKw_PbMPhTtDOVqSHJ2_6Y-wksCpydBg";
  const userId = 1;

  const handleNextClick = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      message.error("Please upload an image before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage);

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
      <h1 className="begin1-title">アバターを更新する</h1>

      <div className="begin1-content">
        <div className="begin1-form-section">
          <form>
            <UploadProfile onImageSelect={setSelectedImage} />
            <button
              type="submit"
              className="begin1-submit-button"
              onClick={handleNextClick}
            >
              スキップ
            </button>
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
