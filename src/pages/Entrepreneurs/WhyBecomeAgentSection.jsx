import { useEffect, useRef, useState } from "react";
import "./WhyBecomeAgentSection.css";

const whyJoinCards = [
  {
    icon: "fa-solid fa-chart-line",
    title: "Steady & Scalable Income Stream",
    text: "Earn commissions on account opening, deposits, withdrawals, fund transfers, loan support, insurance, pensions, and other assisted services.",
  },
  {
    icon: "fa-solid fa-store",
    title: "Low-Cost Business Opportunity",
    text: "Start from an existing shop, kiosk, or local service point with a low-investment model and flexible daily operations.",
  },
  {
    icon: "fa-solid fa-handshake-angle",
    title: "Community Trust & Recognition",
    text: "Become the trusted local banking contact for your area and help people avoid long travel for everyday financial work.",
  },
  {
    icon: "fa-solid fa-mobile-screen-button",
    title: "Personal & Professional Growth",
    text: "Build practical skills in customer service, basic finance, Micro ATM, AEPS, biometric devices, and assisted banking apps.",
  },
  {
    icon: "fa-solid fa-people-group",
    title: "Financial Services & Inclusion Impact",
    text: "Support underbanked families, women, farmers, and workers by bringing banking, insurance, pension, and benefit access closer.",
  },
  {
    icon: "fa-solid fa-seedling",
    title: "Regional & Community Growth Potential",
    text: "Expand from daily transactions into a dependable local service network as more people in your region start using your touchpoint.",
  },
];

const CARDS_PER_SLIDE = 3;
const whyJoinSlides = [];
for (let i = 0; i < whyJoinCards.length; i += CARDS_PER_SLIDE) {
  whyJoinSlides.push(whyJoinCards.slice(i, i + CARDS_PER_SLIDE));
}

function WhyBecomeAgentSection() {
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
    if (isTabletMode) return undefined;

    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setActiveSlide(
        Math.min(
          whyJoinSlides.length - 1,
          Math.round(progress * (whyJoinSlides.length - 1)),
        ),
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTabletMode]);

  useEffect(() => {
    if (!isTabletMode) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % whyJoinSlides.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [isTabletMode]);

  const updateSlide = (direction) => {
    setActiveSlide((current) => {
      const nextIndex = direction === "next" ? current + 1 : current - 1;
      if (nextIndex < 0) return whyJoinSlides.length - 1;
      if (nextIndex >= whyJoinSlides.length) return 0;
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
      className="entrepreneurs-section entrepreneurs-why-scroll"
      id="why-join"
      style={{
        height: isTabletMode ? "auto" : `${whyJoinSlides.length * 100}vh`,
      }}
    >
      <div className="entrepreneurs-why-scroll__sticky">
        <div className="content-wrap">
          <div className="entrepreneurs-why-scroll__header">
            <p className="entrepreneurs-section__eyebrow">Why Join</p>
            <h2>
              Why Become a <span>BC Agent?</span>
            </h2>
            <p>
              Becoming a Business Correspondent Agent, often known as a CSP
              operator, gives you a practical way to build income, local trust,
              digital skills, and social impact by bringing formal banking
              closer to rural and underbanked communities. With minimal
              investment and flexible working hours, you can start your own
              service point and grow a sustainable income stream while serving
              your community.
            </p>
            <div className="entrepreneurs-why-scroll__dots" aria-hidden="true">
              {whyJoinSlides.map((_, index) => (
                <span
                  key={index}
                  className={
                    activeSlide === index
                      ? "entrepreneurs-why-scroll__dot is-active"
                      : "entrepreneurs-why-scroll__dot"
                  }
                />
              ))}
            </div>
          </div>

          <div
            className="entrepreneurs-why-scroll__slides"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
          >
            {whyJoinSlides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`entrepreneurs-why-scroll__slide${
                  activeSlide === slideIndex ? " is-active" : ""
                }${activeSlide > slideIndex ? " is-past" : ""}`}
              >
                {slide.map((card, index) => (
                  <article
                    key={card.title}
                    className="entrepreneurs-benefit"
                    style={{ "--benefit-delay": `${index * 0.08}s` }}
                  >
                    <h3>
                      <i className={card.icon} aria-hidden="true" />
                      <span>{card.title}</span>
                    </h3>
                    <p>{card.text}</p>
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

export default WhyBecomeAgentSection;
