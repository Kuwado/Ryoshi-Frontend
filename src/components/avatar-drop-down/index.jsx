import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"; // File CSS chung
import Avatar from "../../assets/images/avatar.png"; // Avatar image

export default function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  const handleNavigation = (path) => {
    setIsOpen(false); // Đóng dropdown khi click
    navigate(path);
  };

  return (
    <div className="avatar-dropdown">
      {/* Avatar */}
      <img
        src={Avatar}
        alt="User Avatar"
        className="avatar"
        onClick={toggleDropdown}
      />
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => handleNavigation("user/profile")}>
            <span className="icon">👤</span> プロフィール
          </div>
          <div className="dropdown-item" onClick={() => handleNavigation("user/visited-places")}>
            <span className="icon">📍</span> 行った観光地
          </div>
          <div className="dropdown-item" onClick={() => handleNavigation("user/logout")}>
            <span className="icon">↩️</span> ログアウト
          </div>
        </div>
      )}
    </div>
  );
}
