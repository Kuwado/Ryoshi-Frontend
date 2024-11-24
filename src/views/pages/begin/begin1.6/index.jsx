import "./index.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Begin1_6() {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate("/next-step");
  };

  return (
    <div className="begin1-6-container">
      <div className="begin1-6-header">
        <h1 className="left-title">あなたの位置を選択してください</h1>
        <h1 className="right-title">
          関心のあるお子様の年齢を選択してください
        </h1>
      </div>

      <div className="begin1-6-content">
        <div className="begin1-6-form-section">
          <form>
            <div className="begin1-6-form-item">
              <input type="text" placeholder="県/市" className="input-field" />
            </div>
            <div className="begin1-6-form-item">
              <input type="text" placeholder="区/郡" className="input-field" />
            </div>
            <div className="begin1-6-form-item">
              <input type="text" placeholder="町/村" className="input-field" />
            </div>
            <div className="begin1-6-form-item">
              <input
                type="text"
                placeholder="具体的な住所を入力してください"
                className="input-field"
              />
            </div>
          </form>
        </div>

        <div className="begin1-6-options-section">
          <div className="age-options-grid">
            <div className="age-option">0-1歳</div>
            <div className="age-option">1-3歳</div>
            <div className="age-option">3-6歳</div>
            <div className="age-option">6-12歳</div>
            <div className="age-option">12-15歳</div>
            <div className="age-option">15+歳</div>
          </div>
          <button
            type="button"
            className="begin1-6-submit-button"
            onClick={handleNextClick}
          >
            次のステップ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Begin1_6;
