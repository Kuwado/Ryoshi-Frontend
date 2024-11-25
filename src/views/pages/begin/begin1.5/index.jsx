import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function Begin1_5() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [fileList, setFileList] = useState([]);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI1NDU3OTQsImV4cCI6MTczNTEzNzc5NH0.OAkbvzKUhceuKw_PbMPhTtDOVqSHJ2_6Y-wksCpydBg'; // Thay thế bằng token thực tế
  const userId = 1

  const handleNextClick = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Kiểm tra xem có hình ảnh nào được tải lên hay không
    if (!fileList.length) {
      message.error("Please upload an image before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj); // Giả sử bạn chỉ cần gửi một hình ảnh

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/ava/' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Thêm Bearer Token vào header
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      // Chuyển đến trang tiếp theo
      navigate("/user/begin1.6");
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi hình ảnh:', error);
      message.error("Upload failed. Please try again.");
    }
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        setFileList([info.file]); // Lưu danh sách file để gửi sau này
      });
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className="begin1-container">
      <h1 className="begin1-title">アバターを更新する</h1>

      <div className="begin1-content">
        <div className="begin1-form-section">
          <form>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
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
          <img src={Begin1_1} className="begin1-image" alt="Begin 1" />
          <img src={Begin1_2} className="begin1-image" alt="Begin 2" />
          <img src={Begin1_3} className="begin1-image" alt="Begin 3" />
          <img src={Begin1_4} className="begin1-image" alt="Begin 4" />
        </div>
      </div>
    </div>
  );
}

export default Begin1_5;
