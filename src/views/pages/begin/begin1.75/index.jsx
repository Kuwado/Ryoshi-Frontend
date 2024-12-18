import "./index.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";
import Button from "../../../../components/button";
import BeginNavLink from "../../../../components/beginNavLink/beginNavLink";

function Begin1_75() {
const navigate = useNavigate();
const [children_ages, setChildrenAges] = useState([]); // Trạng thái chứa giá trị của các chip đã chọn
const handleChipClick = (ageRange) => {
  setChildrenAges([ageRange]); // Đặt trạng thái thành mảng chỉ chứa chip được chọn
};

const ageRanges = [
  "0-1歳",
  "1-3歳",
  "3-6歳",
  "6-12歳",
  "12-15歳",
  "15+歳"
];

  const token = sessionStorage.getItem("authToken");
  const userId = JSON.parse(sessionStorage.getItem("auth")).id

  const handleNextClick = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Tạo body cho yêu cầu API
    const body = {
      children_ages: children_ages[0]
    }

    try {
      // Gửi yêu cầu POST đến API
      const response = await fetch('http://localhost:8000/api/v1/users/' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Thêm Bearer Token vào header
        },
        body: JSON.stringify(body),
      });

      // Kiểm tra phản hồi từ server
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Nếu gửi thành công, chuyển đến trang tiếp theo
      navigate("/user/begin2");
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
      // Xử lý lỗi nếu cần
    }
  };
  return (
    <div className="begin1-container">
      <div className="begin1-header">
        <h1 className="begin1-title">関心のあるお子様の年齢を選択してください</h1>
        <BeginNavLink />
      </div>
      <div className="begin1-6-content">
            <div className="flex-item-1">
            <div className="begin1-6-options-section">
                <div className="age-options-grid">
                {ageRanges.map((ageRange, index) => (
                    <div
                    key={index}
                    className={`chip-fixed-width chips-wrapper ${
                        children_ages.includes(ageRange) ? "selected" : ""
                    }`}
                    onClick={() => handleChipClick(ageRange)}
                    >
                    <input
                    type="checkbox"
                    id={ageRange}
                    className="d-none"
                    checked={children_ages.includes(ageRange)} // Đánh dấu checkbox nếu chip được chọn
                    readOnly
                    />
                    <label htmlFor={ageRange}>{ageRange}</label>
                    </div>
                ))}
                </div>

                <Button label="次のステップ" className="begin1-6-submit-button" onClick={handleNextClick}>
                </Button>
                <button className="begin1-skip-button" onClick={() => navigate("/user/begin2")}>スキップこのステップ</button>
            </div>
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

export default Begin1_75;
