import React from "react";
import { useNavigate } from "react-router-dom";
import "../landing-page/landingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="landing-page">
      <div className="background">
        <div className="gradient-overlay"></div>
      </div>

      <div className="landing-content">
        <div className="landing-header">
          <img
            src={require("../../../assets/images/group.png")}
            alt="Group"
            className="group-image"
          />
          <div className="landing-flex-row">
            <button className="btn-login" onClick={handleLoginClick}>
              ログイン
            </button>
            <button className="btn-register" onClick={handleRegisterClick}>
              登録
            </button>
          </div>
        </div>
        <img
          src={require("../../../assets/images/landing1.png")}
          alt="Landing"
          className="landing-image"
        />

        <div className="description">
          私たちは、魅力的な観光地、エンターテイメント活動、そして子供に優しい宿泊施設に関する情報を提供しています。
          安全で楽しい方法で一緒に世界を探検しましょう！
        </div>

        <div className="footer-icons">
          <span className="follow-label">フォローしてね！</span>
          <img
            src={require("../../../assets/images/back.png")}
            alt="Back"
            className="icon-back"
          />
          <img
            src={require("../../../assets/images/facebook.png")}
            alt="Facebook"
            className="icon-facebook"
          />
          <img
            src={require("../../../assets/images/google.png")}
            alt="Google"
            className="icon-google"
          />
          <img
            src={require("../../../assets/images/twitter.png")}
            alt="Twitter"
            className="icon-twitter"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
