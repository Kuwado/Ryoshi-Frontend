import React, { useState, useEffect } from "react";
import { Table, Button, Select, Space, message, Modal } from "antd";
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import "./adminPlaceList.css";

const { Option } = Select;
const { confirm } = Modal;

const AdminPlaceList = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [filters, setFilters] = useState({
    age: "",
    style: "",
    region: "",
  });
  const [selectedButton, setSelectedButton] = useState("all");

  // Fetch data from API
  const fetchPlaces = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8000/api/v1/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const { location } = response.data;
        setPlaces(location); // Lưu danh sách địa điểm vào state
        setFilteredPlaces(location); // Mặc định hiển thị tất cả địa điểm
      } else {
        console.error("Error fetching locations:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching places:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Hàm thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  
    let filtered = [...places];
  
    if (button === "general") {
      // Lọc theo độ tuổi
      if (filters.age) {
        const [start, end] = filters.age.split("-").map(Number);
        filtered = filtered.filter(
          (place) => place.age_start <= start && place.age_end >= end
        );
      }
  
      // Lọc theo loại hình du lịch
      if (filters.style && filters.style !== "すべて") {
        filtered = filtered.filter((place) => place.type === filters.style);
      }      
  
      // Lọc theo vùng miền dựa trên địa chỉ
      if (filters.region && filters.region !== "すべて") {
        filtered = filtered.filter((place) => {
          // Lấy tỉnh từ address
          const addressParts = place.address.split(",").map(part => part.trim());
          const province = addressParts[addressParts.length - 1].toLowerCase(); // Tỉnh là phần cuối sau dấu phẩy

          // Kiểm tra khu vực
          if (filters.region === "北部の観光地") {
            // Danh sách các tỉnh miền Bắc
            const northernProvinces = [
              "hà nội", "bắc ninh", "bắc giang", "hà nam", "hải dương",
              "hải phòng", "hòa bình", "lai châu", "lào cai", "nam định",
              "ninh bình", "phú thọ", "quảng ninh", "sơn la", "thái bình",
              "thái nguyên", "tuyên quang", "vĩnh phúc", "yên bái"
            ];
            return northernProvinces.includes(province);
          } else if (filters.region === "中部の旅行") {
            // Danh sách các tỉnh miền Trung
            const centralProvinces = [
              "đà nẵng", "huế", "khánh hòa", "bình định", "quảng nam",
              "quảng ngãi", "quảng trị", "thừa thiên huế", "ninh thuận",
              "phú yên", "bình thuận", "đắk lắk", "đắk nông", "gia lai",
              "kon tum", "lâm đồng", "quảng bình", "hà tĩnh", "nghệ an"
            ];
            return centralProvinces.includes(province);
          } else if (filters.region === "南部の観光地") {
            // Danh sách các tỉnh miền Nam
            const southernProvinces = [
              "hồ chí minh", "bà rịa-vũng tàu", "bình dương", "bình phước",
              "cần thơ", "đồng nai", "đồng tháp", "hậu giang", "kiên giang",
              "long an", "sóc trăng", "tây ninh", "tiền giang", "vĩnh long",
              "an giang", "bạc liêu", "bến tre", "cà mau", "trà vinh"
            ];
            return southernProvinces.includes(province);
          }

          return false;
        });
      }

    }
  
    setFilteredPlaces(filtered); 
  };  

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa địa điểm này?',
      content: 'Sau khi xóa, bạn sẽ không thể khôi phục lại địa điểm này.',
      onOk: async () => {
        try {
          const token = sessionStorage.getItem("authToken");

          // Gửi yêu cầu DELETE để xóa địa điểm
          const response = await axios.delete(`http://localhost:8000/api/v1/locations/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            message.success("Xóa địa điểm thành công!");
            
            // Cập nhật lại danh sách địa điểm sau khi xóa
            const updatedPlaces = places.filter(place => place.location_id !== id);
            setPlaces(updatedPlaces);
            setFilteredPlaces(updatedPlaces); // Cập nhật filteredPlaces
          } else {
            message.error("Không thể xóa địa điểm.");
          }
        } catch (error) {
          console.error("Error deleting place:", error);
          message.error("Đã xảy ra lỗi khi xóa địa điểm.");
        }
      },
      onCancel() {
        console.log('Xóa bị hủy bỏ');
      }
    });
  };

  const columns = [
    {
      title: "番号",
      key: "number",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự (index + 1)
    },
    {
      title: "写真",
      dataIndex: "images",
      key: "images",
      render: (text) => {
        if (text) {
          const imageNames = text.split(","); // Tách các tên tệp ảnh
          return (
            <div style={{ display: "flex", gap: "10px" }}>
              {imageNames.map((imageName, index) => {
                const imageUrl = `http://localhost:8000/uploads/${imageName}`;
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`place-image-${index}`}
                    style={{ width: "100px", height: "auto", objectFit: "cover" }}
                  />
                );
              })}
            </div>
          );
        }
        return null; // Nếu không có hình ảnh, trả về null
      },
    },
    {
      title: "場所の名前",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "実際の位置",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "観光者数",
      dataIndex: "number_tourist",
      key: "number_tourist",
    },
    {
      title: "詳細",
      key: "details",
      render: (_, record) => (
        <Button type="link" onClick={() => alert(`Detail of ${record.name}`)}>
          <EyeOutlined style={{ fontSize: '18px', color: '#222222' }} />
        </Button>
      ),
    },
    {
      title: "削除",
      key: "delete",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleDelete(record.location_id)}
        >
          <DeleteOutlined style={{ fontSize: '18px', color: '#FAFAFA' }} />
        </Button>
      ),
    },
  ];

  const rowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  };

  return (
    <div className="admin-place-list">
      <header className="admin-header">
        <h2>観光地のリスト</h2>
        <div className="header-filters-actions">
          <div className="header-filters">
            <Space size="middle">
              <Select
                placeholder="子供の年齢"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("age", value)}
              >
                <Option value="">すべて</Option>
                <Option value="0-1">0-1歳</Option>
                <Option value="1-3">1-3歳</Option>
                <Option value="3-6">3-6歳</Option>
                <Option value="6-10">6-10歳</Option>
                <Option value="10-11">10+歳</Option>
              </Select>

              <Select
                placeholder="旅行のスタイル"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("style", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="エコツーリズム">エコツーリズム</Option>
                <Option value="文化旅行">文化旅行</Option>
                <Option value="リゾート">リゾート</Option>
                <Option value="レクリエーション">レクリエーション</Option>
                <Option value="スポーツ">スポーツ</Option>
                <Option value="探検">探検</Option>
                <Option value="冒険">冒険</Option>
                <Option value="コンビネーション">コンビネーション</Option>
                <Option value="家族旅行">家族旅行</Option>
                <Option value="団体旅行">団体旅行</Option>
                <Option value="個人旅行">個人旅行</Option>
                <Option value="ビーチ">ビーチ</Option>
                <Option value="山">山</Option>
                <Option value="都市">都市</Option>
                <Option value="田舎">田舎</Option>
                <Option value="あなたにぴったり">あなたにぴったり</Option>
              </Select>

              <Select
                placeholder="地域"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange("region", value)}
              >
                <Option value="すべて">すべて</Option>
                <Option value="北部の観光地">北部の観光地</Option>
                <Option value="中部の旅行">中部の旅行</Option>
                <Option value="南部の観光地">南部の観光地</Option>
              </Select>

            </Space>
          </div>
          <div className="header-actions">
            <div className="pill-buttons">
              <button
                className={`pill-button ${selectedButton === "all" ? "active" : ""}`}
                onClick={() => handleButtonClick("all")}
              >
                すべて
              </button>
              <button
                className={`pill-button ${selectedButton === "general" ? "active" : ""}`}
                onClick={() => handleButtonClick("general")}
              >
                一般的
              </button>
            </div>
          </div>
        </div>
      </header>

      <Table
        columns={columns}
        dataSource={filteredPlaces}
        rowKey="location_id"
        pagination={{ pageSize: 5 }}
        rowClassName={rowClassName} 
      />
    </div>
  );
};

export default AdminPlaceList;
