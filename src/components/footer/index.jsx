import React from "react";
import "./index.css";
import Logo from "../../assets/images/image.png";
import Ryoshi from "../../assets/images/ryoshi.png";
import {
    faFacebook,
    faGoogle
} from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FooterText from "../../assets/images/footerText.png";


export default function Footer() {
    return(
        <div id="footer" className="footer">
            <div class="footer-content">
                <div>
                    {/* <!-- Logo and Heading --> */}
                    <div className="footer-logo-section">
                        <img src={Logo} alt="Logo" className="footer-logo" />
                        <img src={Ryoshi} alt="Ryoko Logo" className="footer-ryoko-logo" />
                    </div>
            
                    {/* <!-- Text Sections --> */}
                    <div className="footer-text-section">
                        <p className="footer-heading">ベトナムでの旅行に役立つウェブサイト</p>
                        <p className="footer-description">
                            私たちは、魅力的な観光地、エンターテイメント活動、そして子供に優しい宿泊施設に関する情報を提供しています。
                            安全で楽しい方法で一緒に世界を探検しましょう！
                        </p>
                    </div>
                </div>

                {/* <!-- Contact Section --> */}
                <div className="footer-contact">
                    <div className="contact-item">
                        <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                        <span className="contact-text">+84 372 689 718</span>
                    </div>
                    <div className="contact-item">
                        <FontAwesomeIcon icon={faGoogle} className="contact-icon" />
                        <span className="contact-text">tabiko@gmail.com</span>
                    </div>
                    <div className="contact-item">
                        <FontAwesomeIcon icon={faFacebook} className="contact-icon" />
                        <span className="contact-text">https://www.facebook.com/tabikohohoho</span>
                    </div>
                </div>

                <div className="footer-text">
                    <img src={FooterText} alt="FooterText"/>
                </div>
            </div>
        
            {/* <!-- Bottom Section --> */}
            <div className="footer-bottom">
                <p className="footer-powered">
                    パワード　バイ　
                    <span className="highlight-orange">ホタル</span>　
                    と　
                    <span className="highlight-orange">ミルクティー</span>
                </p>
            </div>
        </div>
    );
}
