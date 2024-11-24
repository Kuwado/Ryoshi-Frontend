import "./index.css";
import React from "react";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";
function Begin1() {
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
              />
            </div>
            <div className="begin1-form-item">
              <input
                type="text"
                placeholder="電話番号"
                className="input-field"
              />
            </div>
            <div className="begin1-form-item">
              <select className="input-field">
                <option value="">性別</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">他の性別</option>
              </select>
            </div>
            <button type="submit" className="begin1-submit-button">
              次のステップ
            </button>
          </form>
        </div>

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

export default Begin1;
