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
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });

  const handleFinish = async ()=> {
    try {
      console.log(values.email);
      const response = await axios.post("http://localhost:8000/api/v1/register", {
        email: values.email,
        password: values.password,
      });

      // Xử lý khi đăng nhập thành công
      if (response.status === 200) {
        toast.success("ログイン成功！");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error) {
      // Xử lý lỗi từ server
      console.log(error.response.data.error);
      toast.error(error.response.data.error)
    }
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
                {
                  required: true,
                  message: "メールを入力してください！",
                },
              ]}
            >
              <Input
              type="text"
              className=""
              placeholder="メール"
              icon={<MailOutlined />}
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
              />
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
                {
                  required: true,
                  message: "パスワードを入力してください！",
                }
              ]}
              required
              hasFeedback
            >
              <Input
              type="password"
              className=""
              placeholder="パスワード"
              icon={<LockOutlined />} 
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })}
              />
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
                {
                  required: true,
                  message: "パスワードを再入力してください！",
                }
              ]}
            >
              <Input
              type="password"
              className=""
              placeholder="パスワードを確認する"
              icon={<LockOutlined />} 
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })}
                />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button label="登録" className="register-btn-regis" type="submit">

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
