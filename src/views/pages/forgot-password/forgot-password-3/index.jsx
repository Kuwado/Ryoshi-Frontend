import "./index.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../../assets/images/background.png";
import registerQuote from "../../../../assets/images/register_quote.png";
import ryoshi from "../../../../assets/images/ryoshi.png";
import forgotImage from "../../../../assets/images/image2.png";

function ForgotPasswordThree() {
  const navigate = useNavigate();
  const handleSubmit = (value) => {};
  return (
    <div
      className="forgot-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="forgot-wrap">
        <div className="forgot-wrap-img">
          <img src={forgotImage} className="forgot-image1" />
          <img src={ryoshi} className="forgot-image2" />
        </div>
        <div className="forgot-images-bottom">
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
            className="forgot-form"
            onFinish={handleSubmit}
          >
            <Form.Item
              className="forgot-form-item-mobile"
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
              <Input.Password
                placeholder="パスワード"
                prefix={<LockOutlined className="register-icon" />}
              />
            </Form.Item>

            <Form.Item
              className="forgot-form-item-mobile"
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
              <Input.Password
                placeholder="パスワードを確認"
                prefix={<LockOutlined className="register-icon" />}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="primary"
                className="forgot-btn-regis"
                htmlType="submit"
              >
                リセット
              </Button>
            </Form.Item>
          </Form>
        </>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPasswordThree;
