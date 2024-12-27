import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"; // File CSS chung
import Avatar from "../../assets/images/avatar.png"; // Avatar image
import { LogoutOutlined , UserOutlined} from "@ant-design/icons"; // Icon

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

  const handleLogout = () => {
    // Xóa token và dữ liệu người dùng khỏi sessionStorage
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("auth");

    // Chuyển hướng về trang đăng nhập
    navigate("/landing");
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
          <div className="dropdown-item" onClick={() => handleNavigation("/user/user-profile")}>
            <span className="icon"><UserOutlined /></span> プロフィール
          </div>
          
          <div className="dropdown-item" onClick={() => handleLogout()}>
            <span className="icon"><LogoutOutlined /></span> ログアウト
          </div>
        </div>
      )}
    </div>
  );
}
