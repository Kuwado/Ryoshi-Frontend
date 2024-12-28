import axios from "axios";

const base64ToBlob = (base64Data, contentType = '') => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteNumbers], { type: contentType });
};

export const CustomersInformation = async (token,id) => {
    try {
        const response = await axios.get(
            `http://localhost:8000/api/v1/users/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(response.status);
     
          if (response.status === 200) {
            return response.data;
          } else {
            console.error("Error fetching customer:", response.data.message);
          }
        } catch (error) {
          console.error(
            "Error fetching places:",
            error.response?.data || error.message
          );
}}
export const CustomersInformationUpdate = async (data, token, id) => {
    try {
        const response = await axios.put(
            `http://localhost:8000/api/v1/users/${id}`,
            data, // Dữ liệu cần update
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response.status);
        return response;
    } catch (error) {
        console.error(
            "Error updating customer information:",
            error.response?.data || error.message
        );
        throw error; // Để xử lý lỗi ở nơi gọi hàm nếu cần
    }
};

export const CustomersAvatar = async (token, id, selectedImage) => {
    try {
        // Tách phần 'data:image/png;base64,' ra để lấy dữ liệu Base64
        const base64String = selectedImage.split(',')[1]; // Lấy phần sau dấu phẩy
        const contentType = selectedImage.split(';')[0].split(':')[1]; // Lấy content type

        // Chuyển đổi Base64 sang Blob
        const blob = base64ToBlob(base64String, contentType);

        const formData = new FormData();
        formData.append("file", blob, 'avatar.png');

        const response = await axios.put(
            `http://localhost:8000/api/v1/users/ava/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response.status);
        return response;
    } catch (error) {
        console.error(
            "Error uploading avatar:",
            error.response?.data || error.message
        );
        throw error; // Để xử lý lỗi ở nơi gọi hàm nếu cần
    }
};