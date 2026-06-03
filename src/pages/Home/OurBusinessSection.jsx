import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./OurBusinessSection.css";

const services = [
  {
    title: "BFSI Financial Services",
    description: "Access banking, digital payments, insurance, and financial support through our trusted BFSI network.",
    link: "/services",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tag: "Financial",
  },
  {
    title: "Motor Insurance",
    description: "Reliable coverage, competitive premiums & hassle-free claims for every vehicle owner.",
    link: "/services",
    image: "https://i.pinimg.com/1200x/74/1e/63/741e63103318065cbcbaf718765f5e57.jpg",
    tag: "Insurance",
  },
  {
    title: "PAN Card Service",
    description: "Quick, easy PAN card applications — delivered securely to your doorstep.",
    link: "/services",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    tag: "Government",
  },
  {
    title: "Wave OTT",
    description: "Stream movies, shows, and live TV anytime through our affordable digital platform.",
    link: "/services",
    image: "https://i.pinimg.com/736x/c5/e0/ef/c5e0efe64cc1a2328fa422900b44c4fd.jpg",
    tag: "Entertainment",
  },
  {
    title: "Kisan4U Service",
    description: "Connecting farmers and buyers — empowering agriculture marketing across India.",
    link: "/services",
    image: "https://i.pinimg.com/1200x/05/ec/3c/05ec3c4947bb06570e251ef73fe2c202.jpg",
    tag: "Agriculture",
  },
  {
    title: "UP MSME Mart",
    description: "Quality products and exclusive deals for small businesses and everyday consumers.",
    link: "/services",
    image: "https://i.pinimg.com/736x/bc/c0/82/bcc082b0601963e4d4c23fe7de5e7b78.jpg",
    tag: "Commerce",
  },
];

const CARDS_PER_SLIDE = 3;
const slides = [];
for (let i = 0; i < services.length; i += CARDS_PER_SLIDE) {
  slides.push(services.slice(i, i + CARDS_PER_SLIDE));
}

function OurBusinessSection() {
  const sectionRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = (slides.length - 1) * window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setActiveSlide(Math.min(slides.length - 1, Math.round(progress * (slides.length - 1))));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="our-business"
      style={{ height: `${slides.length * 100}vh` }}
    >
      <div className="our-business__sticky">
        <div className="content-wrap">
          <div className="our-business__header">
            <p className="our-business__eyebrow">Our Business</p>
            <div className="our-business__header-row">
              <h2 className="our-business__title">Comprehensive Financial Solutions</h2>
              <div className="our-business__dots">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={`our-business__dot${activeSlide === i ? " is-active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="our-business__slides-wrap">
            {slides.map((slide, slideIdx) => (
              <div
                key={slideIdx}
                className={`our-business__slide${activeSlide === slideIdx ? " is-active" : ""}${activeSlide > slideIdx ? " is-past" : ""}`}
              >
                {slide.map((service, cardIdx) => (
                  <Link
                    key={cardIdx}
                    to={service.link}
                    className="our-business__card"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="our-business__card-overlay" />
                    <div className="our-business__card-content">
                      <span className="our-business__card-tag">{service.tag}</span>
                      <h3 className="our-business__card-title">{service.title}</h3>
                      <p className="our-business__card-desc">{service.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurBusinessSection;
