import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";
import Button from "../../../../components/button";

function Begin1() {
  const navigate = useNavigate();

  // State để lưu giá trị input
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  const token = sessionStorage.getItem("authToken");
  const userId = JSON.parse(sessionStorage.getItem("auth")).id

  const handleNextClick = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Tạo body cho yêu cầu API
    const body = {
      name: name,
      phone: phone,
      dob: birthDate,
      gender: gender,
    };

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
      navigate("/user/begin1.5");
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="begin1-container">
      <h1 className="begin1-title">個人情報を更新する</h1>

      <div className="begin1-content">
        <div className="begin1-form-section">
          <form>
            <div className="begin1-form-item">
              <input
                type="text"
                placeholder="フルネーム"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)} // Cập nhật giá trị name
              />
            </div>
            <div className="begin1-form-item">
              <input
                type="text"
                placeholder="生年月日"
                className="input-field"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)} // Cập nhật giá trị birthDate
              />
            </div>
            <div className="begin1-form-item">
              <input
                type="text"
                placeholder="電話番号"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} // Cập nhật giá trị phone
              />
            </div>
            <div className="begin1-form-item">
              <select
                className="input-field"
                value={gender}
                onChange={(e) => setGender(e.target.value)} // Cập nhật giá trị gender
              >
                <option value="">性別</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">他の性別</option>
              </select>
            </div>
            <Button label="次のステップ" className="begin1-submit-button" onClick={handleNextClick}>
            </Button>
            <button className="begin1-skip-button" onClick={() => navigate("/user/begin1.5")}>スキップこのステップ</button>
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

export default Begin1;