import axios from "axios";
export const CustomersInformation = async (token,id) => {
    try {
        console.log(id);
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
        console.log(id);
        console.log(data);
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