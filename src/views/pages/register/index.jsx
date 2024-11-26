import "./index.css";
import React from "react";
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
          <img src={registerImage} className="register-image1" />
          <img src={ryoshi} className="register-image2" />
        </div>
        <div className="register-images-bottom">
          <img
            src={registerQuote}
            alt="Register Bottom Image"
            className="register-image"
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
            }}
            className="register-form"
            onFinish={handleFinish}
          >
            <Form.Item
              className="register-form-item-mobile"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "無効なメールです!",
                },
              ]}
            >
              <Input
              type="text"
              className=""
              placeholder="メール"
              icon={<MailOutlined />}/>
            </Form.Item>

            <Form.Item
              className="register-form-item-mobile"
              name="password"
              rules={[
                {
                  message: "パスワードを入力してください。",
                },
                {
                  pattern:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
                  message:
                    "パスワードは、少なくとも1つの大文字、1つの数字、1つの特殊文字を含み、6〜20文字でなければなりません！",
                },
              ]}
              hasFeedback
            >
              <Input
              type="password"
              className=""
              placeholder="パスワード"
              icon={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              className="register-form-item-mobile"
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  message: "パスワードを再入力してください",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("再入力したパスワードが間違っています")
                    );
                  },
                }),
              ]}
            >
              <Input
              type="password"
              className=""
              placeholder="パスワードを確認する"
              icon={<LockOutlined />} />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button label="登録" className="register-btn-regis" onClick={handleFinish}>

              </Button>
            </Form.Item>
          </Form>
        </>
        <div className="register-to-login">
          <Link className="register-link" to="/login">
            アカウントがあった？
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

export default Register;
