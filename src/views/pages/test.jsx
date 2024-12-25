import React, { useEffect, useRef, useState } from "react";

const TestMap = () => {
  const mapRef = useRef(null);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const [origin, setOrigin] = useState(""); // Điểm A
  const [destination, setDestination] = useState(""); // Điểm B

  useEffect(() => {
    // Đảm bảo Google Maps API đã load
    if (window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 10.762622, lng: 106.660172 }, // Tọa độ mặc định
        zoom: 13,
      });

      // Khởi tạo Directions Service và Renderer
      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        map: map,
        panel: document.getElementById("directions-panel"), // Panel hướng dẫn
      });
    } else {
      console.error("Google Maps API chưa được tải!");
    }
  }, []);

  // Hàm tìm đường từ A đến B
  const calculateRoute = () => {
    if (!origin || !destination) {
      alert("Vui lòng nhập điểm A và điểm B!");
      return;
    }

    const request = {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING, // Chế độ di chuyển
    };

    directionsService.current.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.current.setDirections(result);
      } else {
        alert("Không thể tìm thấy đường đi!");
      }
    });
  };

  return (
    <div>
      <h2>Hiển thị Bản đồ và Hướng dẫn Đường đi</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Nhập điểm A"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Nhập điểm B"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={calculateRoute}>Tìm Đường</button>
      </div>
      {/* Bản đồ */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid black",
          marginBottom: "10px",
        }}
      ></div>

      {/* Panel hiển thị hướng dẫn đường đi */}
      <div
        id="directions-panel"
        style={{
          width: "100%",
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          backgroundColor: "#f9f9f9",
        }}
      ></div>
    </div>
  );
};

export default TestMap;
