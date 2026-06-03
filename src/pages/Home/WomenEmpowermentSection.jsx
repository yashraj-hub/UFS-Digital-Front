import { useState, useEffect } from "react";
import "./WomenEmpowermentSection.css";

const SLIDER_IMAGES = [
  "https://images.pexels.com/photos/16599525/pexels-photo-16599525.jpeg",
  "https://images.pexels.com/photos/22820075/pexels-photo-22820075.jpeg",
  "https://images.pexels.com/photos/31212954/pexels-photo-31212954.jpeg",
  "https://images.pexels.com/photos/20527519/pexels-photo-20527519.jpeg"
];

function WomenEmpowermentSection() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="women-emp-section" aria-label="Women Empowerment">
      <div className="women-emp-container">
        {/* Left Side: Image Slider */}
        <div className="women-emp-image-wrapper">
          {SLIDER_IMAGES.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Empowering women entrepreneur ${index + 1}`}
              className={`women-emp-image slide-img ${index === currentImgIndex ? "active" : ""}`}
            />
          ))}
          <div className="women-emp-image-overlay" aria-hidden="true" />
        </div>

        {/* Right Side: Content */}
        <div className="women-emp-content-wrapper">
          <div className="women-emp-content">
            <p className="women-emp-eyebrow">Woman Empowerment</p>
            <h2 className="women-emp-title">
              How BC SAKHIs Empower Women Entrepreneurs
            </h2>

            <div className="women-emp-quote-box">
              <i className="fa-solid fa-quote-left women-emp-quote-icon" aria-hidden="true" />
              <p className="women-emp-desc">
                BC SAKHIs play a pivotal role in offering various financial services like opening bank accounts, processing loans, facilitating insurance, and promoting digital transactions. They act as the first point of contact between the community and formal banking institutions.
              </p>
            </div>

            <ul className="women-emp-features">
              <li>
                <div className="we-feature-icon">
                  <i className="fa-solid fa-building-columns" />
                </div>
                <div>
                  <span className="we-feature-text">Providing Access to Financial Services.</span>
                </div>
              </li>
              <li>
                <div className="we-feature-icon">
                  <i className="fa-solid fa-book-open-reader" />
                </div>
                <div>
                  <span className="we-feature-text">Improving Financial Literacy.</span>
                </div>
              </li>
              <li>
                <div className="we-feature-icon">
                  <i className="fa-solid fa-arrow-trend-up" />
                </div>
                <div>
                  <span className="we-feature-text">Fostering Entrepreneurship.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WomenEmpowermentSection;
