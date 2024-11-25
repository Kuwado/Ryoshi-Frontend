import React, {useState} from "react";
import NavLink from "./navLink";
import Logo from "../assets/images/image.png";
import Avatar from "../assets/images/avatar.png";
import "./header.css";

export default function Header() {
    return (
        <div id="header" className="header">
            <div className="container-fluid d-flex align-items-center justify-content-between">
                {/* <!-- Logo --> */}
                <img src={Logo} alt="Logo" className="logo blend-effect" />

                {/* <!-- Menu --> */}
                <div className="menu d-flex align-items-center">
                    <NavLink />
                </div>

                {/* <!-- Search --> */}
                <div className="search-container">
                    <input type="text" className="search-bar form-control" placeholder="旅行で検索する" /> 
                    <span className="icon-search">🔍</span>
                </div>     

                {/* <!-- User Section --> */}
                <div className="user-section d-flex align-items-center">
                    <div className="icon-heart">
                        <span className="heart-icon">♥</span>
                        <span className="heart-bubble">3</span>
                    </div>
                    <img src={Avatar} alt="User Avatar" className="avatar" />
                </div>
            </div>
        </div>
    );
}