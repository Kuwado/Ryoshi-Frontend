import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Begin1_6() {
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

  // State để lưu giá trị input
  const [city, setCity] = useState('');
  const [ward, setWard] = useState('');
  const [town, setTown] = useState('');
  const [address, setAddress] = useState('');

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI1NDU3OTQsImV4cCI6MTczNTEzNzc5NH0.OAkbvzKUhceuKw_PbMPhTtDOVqSHJ2_6Y-wksCpydBg'; // Thay thế bằng token thực tế
  const userId = 1

  const handleNextClick = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Tạo body cho yêu cầu API
    const body = {
      address: address + ", " + town + ", " + ward + ", " + city, 
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
      <div className="begin1-6-content">
        <div className="flex-item-1">
          <h1 className="begin1-title">あなたの位置を選択してください</h1>
          <div className="begin1-6-form-section">
            <form>
              <div className="begin1-6-form-item">
                <input type="text" placeholder="県/市" className="input-field" 
                value={city}
                  onChange={(e) => setCity(e.target.value)} // Cập nhật giá trị city
                />
              </div>
              <div className="begin1-6-form-item">
                <input type="text" placeholder="区/郡" className="input-field" 
                value={ward}
                  onChange={(e) => setWard(e.target.value)} // Cập nhật giá trị ward
                />
              </div>
              <div className="begin1-6-form-item">
                <input type="text" placeholder="町/村" className="input-field" 
                value={town}
                  onChange={(e) => setTown(e.target.value)} // Cập nhật giá trị town
                />
              </div>
              <div className="begin1-6-form-item">
                <input
                  type="text"
                  placeholder="具体的な住所を入力してください"
                  className="input-field"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)} // Cập nhật giá trị address
                />
              </div>
            </form>
          </div>
        </div>
        <div className="flex-item-1">
          <h1 className="begin1-title">関心のあるお子様の年齢を選択してください</h1>
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
            <div class="button-wrapper begin1-6-submit-button" onClick={handleNextClick}>
              <input type="checkbox" id="button" class="d-none"/>
              <label for="button" class="btn d-flex align-items-center justify-content-center">次のステップ</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Begin1_6;
