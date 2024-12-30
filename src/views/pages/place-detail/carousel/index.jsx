import React, { useEffect, useRef, useState } from "react";
import "./index.css";

const Carousel = ({ slideData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Cho TH Responsive
  const [width, setWidth] = useState(133);
  const [extraWidth, setExtraWidth] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      setWidth(imageRef.current.offsetWidth + 10);
    }
  }, [slideData, windowWidth]);

  // Caapj nhật slide bé
  useEffect(() => {
    if (currentSlide > 2 && currentSlide < slideData.length - 3) {
      setExtraWidth((currentSlide - 2) * width);
    } else if (currentSlide <= 2) {
      setExtraWidth(0);
    } else if (currentSlide >= slideData.length - 3) {
      setExtraWidth((slideData.length - 5) * width);
    }
  }, [currentSlide]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container">
      <div className="slide">
        <div
          className="slide-inner"
          style={{
            transform: `translateX(calc(-${currentSlide * 50}vw + ${
              currentSlide * 40
            }px))`,
          }}
        >
          {slideData.map((slide) => (
            <div
              key={slide.id}
              className={`slide-item ${
                slide.id === slideData[currentSlide].id ? "active" : ""
              }`}
            >
              <img className="slide-img" src={slide.src} alt={slide.alt} />
            </div>
          ))}
        </div>
        <a className="prev-btn-container" onClick={goToPrevSlide} role="button">
          <div className="prev-btn" aria-hidden="true">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="50"
                height="50"
                rx="25"
                fill="#0094DA"
                fill-opacity="1"
              />
              <path
                d="M11.7383 27.265C10.7539 26.2888 10.7539 24.7034 11.7383 23.7272L26.8587 8.73218C27.8431 7.75594 29.4418 7.75594 30.4262 8.73218C31.4106 9.70841 31.4106 11.2938 30.4262 12.2701L17.0856 25.5L30.4183 38.7299C31.4027 39.7062 31.4027 41.2916 30.4183 42.2678C29.4339 43.2441 27.8353 43.2441 26.8508 42.2678L11.7304 27.2728L11.7383 27.265Z"
                fill="#FAFAFA"
                fill-opacity="1"
              />
            </svg>
          </div>
          <span className="sr-only">Previous</span>
        </a>
        <a className="next-btn-container" onClick={goToNextSlide} role="button">
          <div className="next-btn" aria-hidden="true">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="50"
                height="50"
                rx="25"
                fill="#0094DA"
                fill-opacity="1"
              />
              <path
                d="M37.4262 23.735C38.4107 24.7112 38.4107 26.2966 37.4262 27.2728L22.3058 42.2678C21.3214 43.2441 19.7228 43.2441 18.7384 42.2678C17.754 41.2916 17.754 39.7062 18.7384 38.7299L32.079 25.5L18.7462 12.2701C17.7618 11.2938 17.7618 9.70841 18.7462 8.73218C19.7306 7.75594 21.3293 7.75594 22.3137 8.73218L37.4341 23.7272L37.4262 23.735Z"
                fill="#FAFAFA"
                fill-opacity="1"
              />
            </svg>
          </div>
          <span className="sr-only">Next</span>
        </a>
      </div>
      <div className="indicators-container">
        <ol
          className="extra-slider"
          style={{
            transform: `translateX(-${extraWidth}px)`,
          }}
        >
          {slideData.map((slide, index) => (
            <li
              key={index}
              ref={index === 0 ? imageRef : null}
              className={index === currentSlide ? "active" : ""}
              onClick={() => goToSlide(index)}
            >
              <img
                src={slide.src}
                alt={slide.alt || `Slide ${index + 1}`}
                className={`thumbnail ${
                  index === currentSlide ? "active-thumbnail" : ""
                }`}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Carousel;
