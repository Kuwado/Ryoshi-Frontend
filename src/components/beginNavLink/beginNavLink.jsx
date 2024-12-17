import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./beginNavLink.css";
import Shape from "../../assets/images/Shape.png"; // Đường dẫn hình "Shape.png"

const BeginNavLink = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const navigate = useNavigate();

  // Các items cho beginNavLink
  const navItems = [
    { label: "個人情報", path: "/user/begin1" },
    { label: "アバター", path: "/user/begin1.5" },
    { label: "位置", path: "/user/begin1.6" },
    { label: "年齢", path: "/user/begin1.75" },
    { label: "旅行のタイプ", path: "/user/begin2" },
  ];

  return (
    <div className="beginNavLink-container">
      {navItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <span
            className={`beginNavLink-item ${
              location.pathname === item.path
                ? "active"
                : location.pathname.startsWith(item.path)
                ? "visited"
                : "pending"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </span>

          {/* Thêm Shape nếu không phải item cuối cùng */}
          {index < navItems.length - 1 && (
            <img src={Shape} alt="Shape" className="beginNavLink-shape" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BeginNavLink;
