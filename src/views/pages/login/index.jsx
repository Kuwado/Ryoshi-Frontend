import "./index.css";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Form, Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../assets/images/background.png";
import registerQuote from "../../../assets/images/register_quote.png";
import ryoshi from "../../../assets/images/ryoshi.png";
import loginImage from "../../../assets/images/image2.png";

function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        email: values.email,
        password: values.password,
      });
      // console.log(response)

      // Xử lý khi đăng nhập thành công
      if (response.status === 200) {
        toast.success("ログイン成功！");
        sessionStorage.setItem("authToken", response.data.token);
        navigate("/testpage");
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

        <>
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              width: 600,
              marginLeft: 10,
            }}
            className="login-form"
            onFinish={handleSubmit}
          >
            <Form.Item
              className="login-form-item-mobile"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "無効なメールです!",
                },
              ]}
            >
              <Input
                placeholder="メール"
                prefix={<MailOutlined className="login-icon" />}
              />
            </Form.Item>

            <Form.Item
              className="login-form-item-mobile"
              name="password"
              rules={[
                {
                  message: "パスワードを入力してください。",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="パスワード"
                prefix={<LockOutlined className="login-icon" />}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="primary"
                className="login-btn-regis"
                htmlType="submit"
              >
                ログイン
              </Button>
            </Form.Item>
          </Form>
        </>
        <div className="login-to-register-to-forgotpassword">
          <Link className="register-link" to="/register">
            アカウントがない？
          </Link>

          <Link className="forgot-link" to="/forgot-password">
            パスワードを忘れた？
          </Link>
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
