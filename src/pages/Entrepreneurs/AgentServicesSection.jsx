import { useEffect, useRef, useState } from "react";
import "./AgentServicesSection.css";

const agentServices = [
  {
    title: "Banking Services",
    description:
      "Open accounts, support cash deposits and withdrawals, handle balance inquiry, and process AEPS transactions.",
    image:
      "https://images.pexels.com/photos/10958528/pexels-photo-10958528.jpeg",
    tag: "Banking",
  },
  {
    title: "Digital Payments",
    description:
      "Help customers use UPI, bill payments, mobile recharge, money transfer, and everyday assisted digital payments.",
    image:
      "https://images.pexels.com/photos/6207703/pexels-photo-6207703.jpeg",
    tag: "Payments",
  },
  {
    title: "Micro ATM & AEPS",
    description:
      "Use biometric devices and Micro ATM tools to make cash access easier for rural and underbanked communities.",
    image:
      "https://images.pexels.com/photos/18555516/pexels-photo-18555516.jpeg",
    tag: "Access",
  },
  {
    title: "Financial Services",
    description:
      "Assist with PAN card services, loan support, credit card processing, EMI help, and basic financial guidance.",
    image:
      "https://images.pexels.com/photos/16902140/pexels-photo-16902140.jpeg",
    tag: "Finance",
  },
  {
    title: "Insurance Services",
    description:
      "Support customers with life, health, and vehicle insurance plans, renewals, and claim assistance.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1000&q=80",
    tag: "Insurance",
  },
  {
    title: "Government Benefit",
    description:
      "Guide people through pension, DBT, scheme-linked services, and government-to-citizen support workflows.",
    image:
      "https://images.pexels.com/photos/36817668/pexels-photo-36817668.jpeg",
    tag: "G2C",
  },
];

const CARDS_PER_SLIDE = 3;
const slides = [];
for (let i = 0; i < agentServices.length; i += CARDS_PER_SLIDE) {
  slides.push(agentServices.slice(i, i + CARDS_PER_SLIDE));
}

function AgentServicesSection() {
  const sectionRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTabletMode, setIsTabletMode] = useState(false);
  const gestureRef = useRef({
    startX: 0,
    startY: 0,
    isDragging: false,
  });

  useEffect(() => {
    const updateMode = () => {
      const width = window.innerWidth;
      const tabletMode = width >= 768 && width <= 1100;
      setIsTabletMode(tabletMode);
    };

    updateMode();
    window.addEventListener("resize", updateMode);
    return () => window.removeEventListener("resize", updateMode);
  }, []);

  useEffect(() => {
    if (isTabletMode) {
      setActiveSlide(0);
    }
  }, [isTabletMode]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (isTabletMode) {
      return undefined;
    }

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setActiveSlide(
        Math.min(slides.length - 1, Math.round(progress * (slides.length - 1))),
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTabletMode]);

  useEffect(() => {
    if (!isTabletMode) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [isTabletMode]);

  const updateSlide = (direction) => {
    setActiveSlide((current) => {
      const nextIndex =
        direction === "next"
          ? current + 1
          : current - 1;

      if (nextIndex < 0) return slides.length - 1;
      if (nextIndex >= slides.length) return 0;
      return nextIndex;
    });
  };

  const handlePointerDown = (event) => {
    if (!isTabletMode) return;
    gestureRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      isDragging: true,
    };
  };

  const handlePointerUp = (event) => {
    if (!isTabletMode || !gestureRef.current.isDragging) return;

    const deltaX = event.clientX - gestureRef.current.startX;
    const deltaY = event.clientY - gestureRef.current.startY;
    const horizontalSwipe = Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1;

    gestureRef.current.isDragging = false;

    if (horizontalSwipe) {
      updateSlide(deltaX < 0 ? "next" : "prev");
    }
  };

  const handlePointerCancel = () => {
    gestureRef.current.isDragging = false;
  };

  return (
    <section
      ref={sectionRef}
      className="agent-services"
      style={{
        height: isTabletMode ? "auto" : `${slides.length * 100}vh`,
      }}
    >
      <div className="agent-services__sticky">
        <div className="content-wrap">
          <div className="agent-services__header">
            <p className="agent-services__eyebrow">Services</p>
            <div className="agent-services__header-row">
              <div>
                <h2 className="agent-services__title">
                  Services You Will Provide
                </h2>
              </div>
              <div className="agent-services__dots" aria-hidden="true">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`agent-services__dot${activeSlide === index ? " is-active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className="agent-services__slides-wrap"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
          >
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`agent-services__slide${
                  activeSlide === slideIndex ? " is-active" : ""
                }${activeSlide > slideIndex ? " is-past" : ""}`}
              >
                {slide.map((service) => (
                  <article
                    key={service.title}
                    className="agent-services__card"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="agent-services__card-overlay" />
                    <div className="agent-services__card-content">
                      <span className="agent-services__card-tag">
                        {service.tag}
                      </span>
                      <h3 className="agent-services__card-title">
                        {service.title}
                      </h3>
                      <p className="agent-services__card-desc">
                        {service.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgentServicesSection;
