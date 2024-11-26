import "./index.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Form } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../assets/images/background.png";
import registerQuote from "../../../assets/images/register_quote.png";
import ryoshi from "../../../assets/images/ryoshi.png";
import registerImage from "../../../assets/images/image2.png";
import Button from "../../../components/button";
import Input from "../../../components/input";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    email: "",
    password1: "",
    password2: ""
  });

  const [mailError, setMailError] = useState('');
  const [pass1Error, setPass1Error] = useState('');
  const [pass2Error, setPass2Error] = useState('');

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

  const handlePass1Change = (e) => {
    const password = e.target.value;
    setValues({ ...values, password1: password }); // Cập nhật trường password1

    // Kiểm tra mật khẩu theo yêu cầu
    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
    if (!passwordRequirements.test(password)) {
        setPass1Error('パスワードは、少なくとも1つの大文字、1つの数字、1つの特殊文字を含み、6〜20文字でなければなりません！');
    } else {
        setPass1Error(''); // Xóa thông báo lỗi nếu mật khẩu hợp lệ
    }
  };

  const handlePass2Change = (e) => {
    const password2 = e.target.value;
    setValues({ ...values, password2 });

    // Kiểm tra xem password1 và password2 có giống nhau không
    if (password2 !== values.password1) {
      setPass2Error('再入力したパスワードが間違っています'); // Thiết lập thông báo lỗi
    } else {
      setPass2Error(''); // Xóa thông báo lỗi nếu giống nhau
    }
  };

  const handleFinish = (value) => {
    toast.success("Đăng ký thành công!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate("/login");
    }, 5000);
    console.log("Received values of form: ", value);
  };
  return (
    <div
      className="register-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="register-wrap">
        <div className="register-wrap-img">
          <img src={registerImage} className="login-image1" />
          <img src={ryoshi} className="login-image2" />
        </div>
        <div className="login-images-bottom">
          <img
            src={registerQuote}
            alt="Register Bottom Image"
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
              value={values.password1}
              onChange={handlePass1Change}
            />
            <div className="explain-error">
              {pass1Error || <span>&nbsp;</span>} 
            </div>
          </div>

          <div>
          <Input
              type="password"
              className=""
              placeholder="パスワードを確認する"
              icon={<LockOutlined />} 
              value={values.password2}
              onChange={handlePass2Change}
              />
            <div className="explain-error">
              {pass2Error || <span>&nbsp;</span>} 
            </div>
          </div>

          <Button label="登録" className="login-btn-regis" onClick={handleFinish}>
          </Button>

        </form>
        <div class="flex-full-width">
          <div class="login-to-register-to-forgotpassword justi-center">
            <Link className="register-link underline" to="/login">
              アカウントがあった？
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

export default Register;