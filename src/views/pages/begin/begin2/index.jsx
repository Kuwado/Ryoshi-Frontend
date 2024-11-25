import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";

function Begin2() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemClick = (item) => {
    setSelectedItems(
      (prev) =>
        prev.includes(item)
          ? prev.filter((i) => i !== item) // Bỏ chọn nếu đã chọn
          : [...prev, item] // Chọn thêm mục mới
    );
  };

  const handleNextClick = () => {
    if (selectedItems.length < 5) {
      alert("最低5つの項目を選択してください");
    } else {
      navigate("/next-step");
    }
  };

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

  return (
    <div className="begin1-container">
      <h1 className="begin1-title">興味のある旅行のタイプを選択してください</h1>
      <h2 className="begin1-subtitle">最低5つの項目を選択してください</h2>

      <div className="begin1-content">
        {/* Phần form lựa chọn */}
        <div className="begin1-form-section">
          <div className="options-grid">
            {options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${
                  selectedItems.includes(option) ? "selected" : ""
                }`}
                onClick={() => handleItemClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
          <button className="begin1-submit-button" onClick={handleNextClick}>
            探検を始めよう！
          </button>
        </div>

        {/* Phần hình ảnh */}
        <div className="image-section">
          <img src={Begin1_1} className="begin1-image" />
          <img src={Begin1_2} className="begin1-image" />
          <img src={Begin1_3} className="begin1-image" />
          <img src={Begin1_4} className="begin1-image" />
        </div>
      </div>
    </div>
  );
}

export default Begin2;
