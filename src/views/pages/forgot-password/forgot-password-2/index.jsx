import "./index.css";
import axios from "axios";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { KeyOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../../assets/images/background.png";
import ryoshi from "../../../../assets/images/ryoshi.png";
import forgotImage from "../../../../assets/images/image2.png";
import Button from "../../../../components/button";
import Input from "../../../../components/input";

function ForgotPasswordTwo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState({
    email: location.state.email,
    code: "",
  });
  const handleSubmit = async () => {
    console.log(location.state.email);
    console.log(value.code);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/verify-otp",
        { email: value.email, 
          otp_post: value.code
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/forgot-password-three", { state: { email: location.state.email } }); // Chuyển email đến bước tiếp theo
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error.response.data.error)
    }
  };
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
        <p className="forgot-message">システムは確認コードをメール abc*@gmail.com に送信しました。下記の欄に確認コードを入力してください。</p>
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
              name="code"
              rules={[
                {
                  required: true,
                  message: "無効なコードです!",
                },
              ]}
            >
              <Input
              type="password"
              className=""
              placeholder="確認コード"
              icon={<KeyOutlined />} 
              value={value.code}
              onChange={(e) => setValue({ ...value, code: e.target.value })}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button label="リセット" className="forgot-btn-regis" type="submit">

              </Button>
            </Form.Item>
          </Form>
        </>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPasswordTwo;
