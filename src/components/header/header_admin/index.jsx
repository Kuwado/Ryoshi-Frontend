import React, {useState} from "react";
import Logo from "../../../assets/images/image.png";
import "./index.css";
import AvatarDropdown from "../../avatar-drop-down";
import NavLinkAdmin from "../../navLinkAdmin";

export default function AdminHeader() {
    return (
        <div id="header" className="header">
            <div className="container-fluid d-flex align-items-center">
                {/* <!-- Logo --> */}
                <img src={Logo} alt="Logo" className="logo blend-effect" />

                {/* <!-- Menu --> */}
                <div className="ad-menu d-flex align-items-center">
                    <NavLinkAdmin />
                </div>

                {/* <!-- Search --> */}
                <div className="ad-search-container">
                    <input type="text" className="search-bar form-control" placeholder="旅行で検索する" /> 
                    <span className="icon-search">🔍</span>
                </div>     

                {/* <!-- User Section --> */}
                <div className="ad-user-section d-flex align-items-center">
                    <AvatarDropdown />
                </div>
            </div>
        </div>
    );
}