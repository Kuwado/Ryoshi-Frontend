import React, { useState, useEffect } from "react";
import { Table, Button, Select, Space, message, Modal } from "antd";
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
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
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [key]: value,
      };
      applyFilters(updatedFilters);  
      return updatedFilters;
    });
  };
  
  const applyFilters = (updatedFilters) => {
    let filtered = [...places];
  
    // Áp dụng lọc theo tuổi
    if (updatedFilters.age) {
      const [start, end] = updatedFilters.age.split("-").map(Number);
      filtered = filtered.filter(
        (place) => place.age_start <= start && place.age_end >= end
      );
    }
  
    // Áp dụng lọc theo loại hình du lịch
    if (updatedFilters.style && updatedFilters.style !== "すべて") {
      filtered = filtered.filter((place) => place.type === updatedFilters.style);
    }
  
    // Áp dụng lọc theo vùng miền
    if (updatedFilters.region && updatedFilters.region !== "すべて") {
      filtered = filtered.filter((place) => {
        const addressParts = place.address.split(",").map((part) => part.trim());
        const province = addressParts[addressParts.length - 1].toLowerCase();
  
        const regions = {
          "北部の観光地": [
            "Hà Nội", "Bắc Ninh", "Bắc Giang", "Hà Nam", "Hải Dương", 
            "Hải Phòng", "Hòa Bình", "Lai Châu", "Lào Cai", "Nam Định", 
            "Ninh Bình", "Phú Thọ", "Quảng Ninh", "Sơn La", "Thái Bình", 
            "Thái Nguyên", "Tuyên Quang", "Vĩnh Phúc", "Yên Bái"
          ],
          "中部の旅行": [
            "Đà Nẵng", "Huế", "Khánh Hòa", "Bình Định", "Quảng Nam", 
            "Quảng Ngãi", "Quảng Trị", "Thừa Thiên Huế", "Ninh Thuận", 
            "Phú Yên", "Bình Thuận", "Đắk Lắk", "Đắk Nông", "Gia Lai", 
            "Kon Tum", "Lâm Đồng", "Quảng Bình", "Hà Tĩnh", "Nghệ An"
          ],
          "南部の観光地": [
            "Hồ Chí Minh", "Bà Rịa-Vũng Tàu", "Bình Dương", "Bình Phước", 
            "Cần Thơ", "Đồng Nai", "Đồng Tháp", "Hậu Giang", "Kiên Giang", 
            "Long An", "Sóc Trăng", "Tây Ninh", "Tiền Giang", "Vĩnh Long", 
            "An Giang", "Bạc Liêu", "Bến Tre", "Cà Mau", "Trà Vinh"
          ],
        };
  
        return regions[updatedFilters.region]?.some(
          (provinceName) => provinceName.toLowerCase() === province
        );
      });
    }
  
    setFilteredPlaces(filtered); 
  };
  
  const applySort = (sortType) => {
    let sorted = [...filteredPlaces];
  
    if (sortType === "general") {
      sorted.sort((a, b) => b.number_tourist - a.number_tourist); // Sắp xếp giảm dần
    } 
  
    setFilteredPlaces(sorted);
  };
  
  const handleButtonClick = (button) => {
    setSelectedButton(button); 
    if (button === "all") {
      setFilters({
        age: "",
        style: "",
        region: "",
      });
      setFilteredPlaces(places);
    } else if (button === "general") {
      applySort("general");
    }
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
        <Button type="link" onClick={() => 
          navigate(`/admin/admin-edit-place/${record.location_id}`, { state: { location: record } })
        }>
          <img
          src={require('../../../assets/images/VectorShow.png')}
          style={{ width: '24px', height: '18px', objectFit: 'cover' }}
          />
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
          <img
          src={require('../../../assets/images/VectorDelete.png')}
          style={{ width: '20px', height: '24px', objectFit: 'cover' }}
          />
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
                value={filters.age === "" ? undefined : filters.age}
              >
                <Option value="100-0">すべて</Option>
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
                value={filters.style === "" ? undefined : filters.style}
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
                value={filters.region === "" ? undefined : filters.region}
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
