import React, {useState, useEffect} from "react";
import NavLink from "../../navLink";
import Logo from "../../../assets/images/image.png";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import AvatarDropdown from "../../avatar-drop-down";

export default function UserHeader() {
    const token = sessionStorage.getItem("authToken");
    const navigate = useNavigate();
    const location = useLocation();
    const [locationsName, setLocationsName] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredLocations, setFilteredLocations] = useState([]);

    // Lấy ra danh sách tên địa điểm
    const fetchLocationsName = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/locations", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch locations");
            }

            const data = await response.json();
            // Chuyển đổi sang mảng chỉ chứa tên
            return data.location;
        } catch (error) {
            console.error("Error fetching locations:", error);
            throw error; // Re-throw the error for further handling
        }
    };

    const initiateFetch = async () => {
        try {
            const locations = await fetchLocationsName(); // Chờ cho dữ liệu được lấy
            setLocationsName(locations); // Cập nhật danh sách địa điểm
        } catch (error) {
            console.error("Error during fetching process:", error);
        }
    };

    useEffect(() => {
        // Initiate the process
        initiateFetch();
    }, []); // Empty dependency array to run only on mount

    const handleChange = (event) => {
        const userInput = event.target.value;
        setSearch(userInput);
    
        // Lọc các địa điểm dựa trên đầu vào của người dùng
        const filtered = locationsName.filter(location =>
            location.name.toLowerCase().includes(userInput.toLowerCase())
        );
        console.log(filtered)
        setFilteredLocations(filtered);
    };
    
    const handleSelect = (location) => {
        setSearch(location);
        setFilteredLocations([]); // Xóa gợi ý sau khi chọn
        navigate('/user/search-result', { state: { filteredLocations } }); // Truyền dữ liệu qua state
    };

    return (
        <div id="header" className="header">
            <div className="container-fluid d-flex align-items-center justify-content-between">
                {/* <!-- Logo --> */}
                <img src={Logo} alt="Logo" className="logo blend-effect" />

                {/* <!-- Menu --> */}
                <div className="menu d-flex align-items-center">
                    <NavLink />
                </div>

                {/* <!-- Search --> */}
                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar form-control"
                        value={search}
                        onChange={handleChange}
                        placeholder="旅行で検索する"
                    />
                    {filteredLocations.length > 0 && (
                        <ul className="search-content">
                            <li className="search-title">観光地</li>
                        {filteredLocations.map((location, index) => (
                            <li
                            key={index}
                            onClick={() => handleSelect(location.name)}
                            className="search-li"
                            >
                                <img className="search-img" src={location.images}/>
                                {location.name}
                            </li>
                        ))}
                        </ul>
                    )}
                    <span className="icon-search">🔍</span>
                </div>     

                {/* <!-- User Section --> */}
                <div className="user-section d-flex align-items-center">
                    <AvatarDropdown />
                </div>
            </div>
        </div>
    );
}