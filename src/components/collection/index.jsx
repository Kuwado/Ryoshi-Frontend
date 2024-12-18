import React, { useState, useEffect } from "react";
import "./index.css";
import CollectionItem from "../collection-item";

//collectionData (array): mảng chứa dữ liệu của 1 item cần có 3 trường id, name, place
//itemsNumber (int): số item tối đa hiển thị trong 1 hàng
//rowNumber (int): số hàng
//showIndicator (boolean): hiển thị đánh số trang

const Collection = ({
  collectionData,
  itemsNumber,
  rowNumber,
  showIndicator,
  showPagination,
  showLeftRight
}) => {
  const token = sessionStorage.getItem("authToken");
  const userId = JSON.parse(sessionStorage.getItem("auth")).id
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(itemsNumber * rowNumber); // Giá trị mặc định
  const [slicedData, setSlicedData] = useState([]);
  const [totalSlides, setTotalSlides] = useState(0);

  // Hàm để điều chỉnh số lượng item theo kích thước màn hình
  const updateItemsPerSlide = () => {
    const width = window.innerWidth;

    if (width < 644) {
      setItemsPerSlide(1 * rowNumber);
    } else if (width < 930) {
      setItemsPerSlide(2 * rowNumber);
    } else if (width < 1220) {
      setItemsPerSlide(3 * rowNumber);
    } else if (width < 1512) {
      setItemsPerSlide(4 * rowNumber);
    } else {
      setItemsPerSlide(itemsNumber * rowNumber);
    }
  };

  const fetchUserInfo = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        // Return the user data for further processing
        return data.user;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error; // Re-throw the error for further handling
    }
};

const processCollections = (collections, userInfo) => {
  // Lấy liked_id từ liked_location
  const likedIds = userInfo.liked_location.map(location => ({
      location_id: location.location_id,
      liked_id: location.Liked.id
  }));
  
  // Lấy gone_id từ gone_location (nếu cần)
  const goneIds = userInfo.gone_location.map(location => ({
      location_id: location.location_id,
      gone_id: location.Gone.id // Giả sử gone có cấu trúc tương tự
  }));

  return collections.map(collection => {
      // Tìm likedId trong likedIds
      const likedId = likedIds.find(like => like.location_id === collection.location_id)?.liked_id || -1;

      // Tìm goneId trong goneIds
      const goneId = goneIds.find(gone => gone.location_id === collection.location_id)?.gone_id || -1;

      return {
          ...collection,
          likedId: likedId,
          goneId: goneId
      };
  });
};

const sliceArray = (array, chunkSize) => {
  const result = [];
  const maxSlide = Math.ceil(array.length / chunkSize);
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);

    if (result.length == maxSlide && rowNumber > 1) {
      // Thêm fillers vào chunk nếu cần
      if (chunk.length < chunkSize / 2) {
        const fillCount = Math.ceil(chunkSize / 2) - chunk.length;
        const fillers = new Array(fillCount).fill({ id: -1 });
        chunk.push(...fillers);
      } else if (chunk.length < chunkSize) {
        const fillCount = chunkSize - chunk.length;
        const fillers = new Array(fillCount).fill({ id: -1 });
        chunk.push(...fillers);
      }
    }
  }
  return result;
};

// Tách locations thành các mảng nhỏ


const initiateFetch = async () => {
    try {
        const userInfo = await fetchUserInfo(); // Fetch user info
        const processedLocations = processCollections(collectionData, userInfo);
        setSlicedData(sliceArray(processedLocations, itemsPerSlide))
        setTotalSlides(Math.ceil(processedLocations.length / itemsPerSlide));
    } catch (error) {
        console.error("Error during fetching process:", error);
    }
};

  useEffect(() => {
    updateItemsPerSlide(); // Gọi hàm khi component mount
    window.addEventListener("resize", updateItemsPerSlide); // Lắng nghe sự kiện resize
    return () => {
      window.removeEventListener("resize", updateItemsPerSlide); // Dọn dẹp listener khi unmount
    };
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    initiateFetch();
  }, [collectionData]); // Empty dependency array to run only on mount

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="collection-container">
      <div className="collection">
        <div
          className="collection-inner"
          style={{
            transform: `translateX(calc(${currentSlide * -100}vw + ${
              currentSlide * 60
            }px))`,
          }}
        >
          {slicedData.map((itemArr, index) => (
            <div
              className={`collection-item ${
                index === currentSlide ? "active" : ""
              }`}
              key={index}
              style={rowNumber > 1 ? { flexWrap: "wrap" } : {}}
            >
              {itemArr.map((item, itemIndex) =>
                item.id !== -1 ? (
                  <CollectionItem
                    key={item.name}
                    locationId={item.location_id}
                    name={item.name}
                    place={item.address}
                    initialLikedId={item.likedId}
                    initialGoneId={item.goneId}
                    imageName={item.images.split(",")[0]}
                  />
                ) : (
                  <div style={{ width: "250px" }}></div>
                )
              )}
            </div>
          ))}
        </div>
        {showLeftRight && (
        <>
          <button
            className="collecion-prev-btn-container"
            style={{ width: "5%", cursor: "pointer" }}
            onClick={goToPrevSlide}
            aria-label="Previous"
          >
            <div className="prev-btn" aria-hidden="true">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="40"
                  height="40"
                  rx="20"
                  fill="#0094DA"
                />
                <path
                  d="M10.5274 21.7607C9.82421 21.0634 9.82421 19.931 10.5274 19.2337L21.3277 8.52298C22.0308 7.82567 23.1727 7.82567 23.8759 8.52298C24.579 9.22029 24.579 10.3527 23.8759 11.05L14.3468 20.5L23.8702 29.95C24.5734 30.6473 24.5734 31.7797 23.8702 32.477C23.1671 33.1743 22.0252 33.1743 21.322 32.477L10.5217 21.7663L10.5274 21.7607Z"
                  fill="#FAFAFA"
                />
              </svg>
            </div>
          </button>

          <button
            className="collecion-next-btn-container"
            style={{ width: "5%", right: "1.5%", cursor: "pointer" }}
            onClick={goToNextSlide}
            aria-label="Next"
          >
            <div className="next-btn" aria-hidden="true">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="40"
                  height="40"
                  rx="20"
                  fill="#0094DA"
                />
                <path
                  d="M30.876 19.2393C31.5791 19.9366 31.5791 21.069 30.876 21.7663L20.0757 32.477C19.3725 33.1743 18.2306 33.1743 17.5275 32.477C16.8243 31.7797 16.8243 30.6473 17.5275 29.95L27.0565 20.5L17.5331 11.05C16.8299 10.3527 16.8299 9.22029 17.5331 8.52298C18.2362 7.82567 19.3781 7.82567 20.0813 8.52298L30.8816 19.2337L30.876 19.2393Z"
                  fill="#FAFAFA"
                />
              </svg>
            </div>
          </button>
        </>
      )}
      </div>
      {showIndicator && (
        <ol className="indicators">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <li
              key={index}
              className={index === currentSlide ? "active" : ""}
              onClick={() => goToSlide(index)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="18"
                  height="18"
                  rx="9"
                  fill={index === currentSlide ? "#0094DA" : "transparent"}
                  stroke="#0094DA"
                  strokeWidth="2"
                />
              </svg>
            </li>
          ))}
        </ol>
      )}
      {showPagination && (
    <div className="pagination-container">
        <button 
            className="pagination-btn" 
            onClick={goToPrevSlide} 
            disabled={currentSlide === 0}
        >
            &lt;
        </button>
        <ul className="pagination">
            {Array.from({ length: totalSlides }).map((_, index) => (
                <li
                    key={index}
                    className={index === currentSlide ? 'active' : ''}
                    onClick={() => goToSlide(index)}
                >
                    {index + 1}
                </li>
            ))}
        </ul>
        <button 
            className="pagination-btn" 
            onClick={goToNextSlide} 
            disabled={currentSlide === totalSlides - 1}
        >
            &gt;
        </button>
    </div>
)}

    </div>
  );
};

export default Collection;
