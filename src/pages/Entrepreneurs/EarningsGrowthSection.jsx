import { useEffect, useState } from "react";
import "./EarningsGrowthSection.css";

const EARNINGS_IMAGES = [
  "https://images.pexels.com/photos/6465163/pexels-photo-6465163.jpeg",
  "https://images.pexels.com/photos/33434785/pexels-photo-33434785.jpeg",
  "https://images.pexels.com/photos/18804575/pexels-photo-18804575.jpeg"
];

const growthHighlights = [
  {
    icon: "fa-solid fa-indian-rupee-sign",
    title: "Rs 10K-Rs 50K+ monthly earning potential"
  },
  {
    icon: "fa-solid fa-people-group",
    title: "Empowering thousands of local entrepreneurs"
  },
  {
    icon: "fa-solid fa-tower-broadcast",
    title: "Extending banking access to remote areas"
  },
  {
    icon: "fa-solid fa-mobile-screen-button",
    title: "Supporting the Digital India mission on the ground"
  }
];

function EarningsGrowthSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((current) => (current + 1) % EARNINGS_IMAGES.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="earnings-growth-section" aria-label="Earnings and growth">
      <div className="earnings-growth-container">
        <div className="earnings-growth-image-panel">
          {EARNINGS_IMAGES.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Local entrepreneur growth ${index + 1}`}
              className={`earnings-growth-image${currentImage === index ? " is-active" : ""}`}
            />
          ))}
          <div className="earnings-growth-image-overlay" aria-hidden="true" />
        </div>

        <div className="earnings-growth-content-panel">
          <div className="earnings-growth-content">
            <p className="earnings-growth-eyebrow">Earnings & Growth</p>
            <h2 className="earnings-growth-title">
              Your Earnings, Growth Impact Across India
            </h2>

            <div className="earnings-growth-quote">
              <i className="fa-solid fa-quote-left earnings-growth-quote-icon" aria-hidden="true" />
              <p>
                Build a recurring income engine with assisted banking and financial services.
                As your customer base grows, your local service point can create income,
                community trust, and reliable access for people across underserved regions.
              </p>
            </div>

            <ul className="earnings-growth-list">
              {growthHighlights.map((item) => (
                <li key={item.title}>
                  <span className="earnings-growth-list-icon">
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EarningsGrowthSection;
