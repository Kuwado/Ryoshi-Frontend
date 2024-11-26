import "./index.css";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../assets/images/background.png";
import registerQuote from "../../../assets/images/register_quote.png";
import ryoshi from "../../../assets/images/ryoshi.png";
import loginImage from "../../../assets/images/image2.png";
import Button from "../../../components/button";
import Input from "../../../components/input";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });

  const [mailError, setMailError] = useState('');
  const [passError, setPassError] = useState('');

  const validateEmail = (email) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleMailChange = (e) => {
    const email = e.target.value;
    setValues({ ...values, email });

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
      setMailError('無効なメールです!'); // Thiết lập thông báo lỗi
    } else {
      setMailError(''); // Xóa thông báo lỗi nếu định dạng hợp lệ
    }
  };

  const handlePassChange = (e) => {
    const password = e.target.value;
    setValues({ ...values, password: password }); // Cập nhật trường password
  };

  const handleSubmit = async ()=> {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        email: values.email,
        password: values.password,
      });

      // Xử lý khi đăng nhập thành công
      if (response.status === 200) {
        toast.success("ログイン成功！");
        sessionStorage.setItem("authToken", response.data.token);

        //Xử lý token
        const parts = response.data.token.split('.'); // Tách token thành 3 phần
        const payload = parts[1];
        const decodedPayload = JSON.parse(atob(payload)); // Giải mã Base64
        
        sessionStorage.setItem("auth", JSON.stringify(decodedPayload));
        navigate("/user/begin1");
      }
    } catch (error) {
      // Xử lý lỗi từ server
      console.log(error.response.data.error);
      toast.error(error.response.data.error)
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="login-wrap">
        <div className="login-wrap-img">
          <img src={loginImage} className="login-image1" />
          <img src={ryoshi} className="login-image2" />
        </div>
        <div className="login-images-bottom">
          <img
            src={registerQuote}
            alt="Login Bottom Image"
            className="login-image"
          />
        </div>       
        <form className="login-form-item-mobile">
          <div>
            <Input
            type="text"
            className=""
            placeholder="メール"
            icon={<MailOutlined />}
            value={values.email}
            onChange={handleMailChange}
            />
            <div className="explain-error">
              {mailError || <span>&nbsp;</span>} 
            </div>
          </div>

          <div>
            <Input
            type="password"
            className=""
            placeholder="パスワード"
            icon={<LockOutlined />}
            value={values.password} 
            onChange={handlePassChange}
            />
            <div className="explain-error">
              {passError || <span>&nbsp;</span>} 
            </div>
          </div>

          <Button label="ログイン" className="login-btn-regis" onClick={handleSubmit}>
          </Button>
        </form>
        <div className="flex-full-width">
          <div className="login-to-register-to-forgotpassword">
            <Link className="register-link underline" to="/register">
              アカウントがない？
            </Link>

            <Link className="forgot-link underline" to="/forgot-password-one">
              パスワードを忘れた？
            </Link>
          </div>
        </div>
        <div className="other-login-methods">
          <div className="other-login-text">他の方法</div>
          <div className="social-icons">
            <button className="social-button google">
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button className="social-button facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </button>
            <button className="social-button twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;