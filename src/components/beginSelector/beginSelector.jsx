import React, { useState } from "react";
import "./beginSelector.css";

const BeginSelector = () => {
  const [city, setCity] = useState("");
  const [ward, setWard] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");

  const handleNextClick = (e) => {
    e.preventDefault(); 
    console.log({
      city,
      ward,
      town,
      address,
    });
  };

  return (
    <div className="begin1-container">
      <div className="begin1-6-content">
        <div className="flex-item-1">
          <h1 className="begin1-title">あなたの位置を選択してください</h1>
          <div className="begin1-6-form-section">
            <form>
              {/* City Dropdown */}
              <div className="begin1-form-item">
                <select
                  className="input-field"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">県/市</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
              {/* Ward Dropdown */}
              <div className="begin1-form-item">
                <select
                  className="input-field"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                >
                  <option value="">区/郡</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
              {/* Town Dropdown */}
              <div className="begin1-form-item">
                <select
                  className="input-field"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                >
                  <option value="">町/村</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
              {/* Address Input */}
              <div className="begin1-6-form-item">
                <input
                  type="text"
                  placeholder="具体的な住所を入力してください"
                  className="input-field"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {/* Next Step Button */}
              <button
                type="submit"
                className="begin1-submit-button"
                onClick={handleNextClick}
              >
                次のステップ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginSelector;
