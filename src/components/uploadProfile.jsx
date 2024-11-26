import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import img from "../assets/images/Vector.png";
import { Button } from "primereact/button";

function UploadProfile() {
  const [image, setimage] = useState("");
  const [imagecrop, setimagecrop] = useState(false);
  const [src, setsrc] = useState(false);
  const [profile, setprofile] = useState([]);
  const [pview, setpview] = useState(false);

  const profileFinal = profile.map((item) => item.pview);

  const onClose = () => {
    setpview(null);
  };

  const onCrop = (view) => {
    setpview(view);
  };

  const saveCropImage = () => {
    setprofile([...profile, { pview }]);
    setimagecrop(false);
  };

  return (
    <div>
      <div className="profile_img text-center p-4">
        <div className="flex flex-column justify-content-center align-items-center">
          <img
            style={{
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "none",
            }}
            onClick={() => setimagecrop(true)}
            src={profileFinal.length ? profileFinal : img}
            alt=""
          />
          <Dialog
            visible={imagecrop}
            header={() => (
              <p htmlFor="" className="text-2x1 font-semibold textColor">
                Update Avatar
              </p>
            )}
            onHide={() => setimagecrop(false)}
          >
            <div className="confirmation-content flex flex-column align-items-center">
              <Avatar
                width={500}
                height={400}
                onCrop={onCrop}
                onClose={onClose}
                src={src}
                shadingColor={"#474649"}
                backgroundColor={"#474649"}
              />
            </div>
            <div className="flex flex-column align-items-center mt-5 w-12">
              <div className="flex justify-content-around w-12 mt-4">
                <Button
                  onClick={saveCropImage}
                  label="save"
                  icon="pi pi-check"
                />
              </div>
            </div>
          </Dialog>
          <InputText
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files[0];
              if (file && file.type.substring(0, 5) === "image") {
                setimage(file);
              } else {
                setimage(null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadProfile;
