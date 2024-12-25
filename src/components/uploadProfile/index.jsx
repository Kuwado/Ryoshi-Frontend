import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import { Dialog } from "primereact/dialog";
import img from "../../assets/images/Vector.png";
import { Button } from "primereact/button";
import "./index.css";

function UploadProfile({ onImageSelect }) {
  const [src, setsrc] = useState(null);
  const [imagecrop, setimagecrop] = useState(false);
  const [pview, setpview] = useState(null);

  const onCrop = (view) => {
    setpview(view);
    onImageSelect(view); // Gửi ảnh đã crop về component cha
  };

  const onClose = () => {
    setpview(null);
    onImageSelect(null); // Khi đóng, xóa ảnh đã chọn
  };

  return (
    <div className="profile_img text-center p-4">
      <div className="flex flex-column justify-content-center align-items-center">
        <img
          style={{
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "none",
            transform: "translateX(-30px)",
          }}
          onClick={() => setimagecrop(true)}
          src={pview || img}
          alt="Profile"
        />
        <Dialog
          visible={imagecrop}
          onHide={() => setimagecrop(false)}
          modal
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            maxWidth: "500px",
            width: "90%",
            padding: "0",
          }}
          contentStyle={{
            padding: "0",
          }}
          maskStyle={{
            background: "rgba(0, 0, 0, 0.6)", // Làm mờ phần nền
          }}
          header={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // Căn giữa nội dung header
                fontSize: "20px",
                fontWeight: "bold",
                padding: "15px",
                borderBottom: "1px solid #eaeaea",
                borderRadius: "20px 20px 0 0",
              }}
            >
              <span>アバターを更新する</span>
            </div>
          }
        >
          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Căn giữa theo chiều ngang
              justifyContent: "center", // Căn giữa theo chiều dọc
              padding: "20px",
            }}
          >
            <Avatar
              width={400}
              height={300}
              onCrop={onCrop}
              onClose={onClose}
              src={src}
              shadingColor={"#f1f1f1"}
              backgroundColor={"#ffffff"}
              style={{
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Căn giữa các nút
              padding: "15px",
              borderTop: "1px solid #eaeaea",
            }}
          >
            <Button
              onClick={() => setimagecrop(false)}
              label="保存"
              icon="pi pi-check"
              className="upload-submit-button p-button-rounded p-button-primary"
              style={{
                backgroundColor: "#0094da",
                borderColor: "#0094da",
                color: "#ffffff",
                padding: "10px 20px",
                fontSize: "16px",
              }}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default UploadProfile;
