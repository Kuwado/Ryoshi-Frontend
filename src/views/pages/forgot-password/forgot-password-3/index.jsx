import "./index.css";
import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../../assets/images/background.png";
import ryoshi from "../../../../assets/images/ryoshi.png";
import forgotImage from "../../../../assets/images/image2.png";
import { useParams } from "react-router-dom";
import Button from "../../../../components/button";
import Input from "../../../../components/input";

function ForgotPasswordThree() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState({
    password: "",
  });
  const location = useLocation();
  const handleSubmit = async () => {
    console.log(location.state.email);
    console.log(value.password);
    
    try {
      const response = await axios.put(
        "http://localhost:8000/api/v1/users/forgotPassword",
        {
          email: location.state.email,
          password: value.password, 
        }
      );
      if (response.status === 200) {
        toast.success("パスワードが正常にリセットされました。");
        navigate("/login"); // Chuyển về trang đăng nhập
      }
    } catch (error) {
      console.log(error);
      
      toast.error(error.response.data.error);
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
              <Input
              type="password"
              className=""
              placeholder="パスワード"
              icon={<LockOutlined />} 
              value={value.password}
              onChange={(e) => setValue({ ...value, password: e.target.value })}
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
              <Input
              type="password"
              className=""
              placeholder="パスワードを確認する"
              icon={<LockOutlined />} 
              value=""
              onChange=""
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button label="送る" className="forgot-btn-regis" type="submit">
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
