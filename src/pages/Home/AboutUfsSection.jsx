import { useEffect, useRef, useState } from "react";
import "./AboutUfsSection.css";

const VISUAL_STRIPS = [
  {
    icon: "fa-wallet",
    title: "Banking Made Easy",
    description: "Simple assisted banking at nearby CSP touchpoints."
  },
  {
    icon: "fa-user-tie",
    title: "Expert Assistance",
    description: "Trained BC agents guide every step with clarity."
  },
  {
    icon: "fa-handshake",
    title: "Connected Community",
    description: "One trusted access point for financial services."
  }
];

function AboutUfsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`about-ufs-section${isVisible ? " is-visible" : ""}`}
      aria-labelledby="about-ufs-title"
    >
      <div className="content-wrap about-ufs-shell">
        <div
          className="about-ufs-copy about-ufs-animate"
          style={{ "--about-order": 1 }}
        >
          <p className="about-ufs-eyebrow">About UFS Digital</p>
          <h2 id="about-ufs-title" className="about-ufs-title">
            Making Digital Services Clear, Fast, and Reliable
          </h2>
          <p className="about-ufs-lead">
            UFS Digital Limited is a citizen-first financial services platform
            helping people across India access banking and government services
            through guided support, digital workflows, and a strong on-ground
            network.
          </p>
          <p className="about-ufs-body">
            We bridge traditional systems with modern convenience so account
            opening, digital payments, credit, loans, insurance, pensions, and
            scheme applications become faster, clearer, and more reliable for
            every community.
          </p>
        </div>

        <div
          className="about-ufs-features about-ufs-animate"
          style={{ "--about-order": 2 }}
          aria-label="UFS service pillars"
        >
          <div className="about-ufs-visual-stage" aria-hidden="true">
            <span className="about-ufs-dot about-ufs-dot--violet" />
            <span className="about-ufs-dot about-ufs-dot--teal" />
            <span className="about-ufs-dot about-ufs-dot--orange" />
            <span className="about-ufs-dot about-ufs-dot--indigo" />
            <span className="about-ufs-dot about-ufs-dot--lime" />
            <span className="about-ufs-dot about-ufs-dot--pink" />
            <span className="about-ufs-dot about-ufs-dot--sky" />
            <span className="about-ufs-dot about-ufs-dot--peach" />
            <span className="about-ufs-dot about-ufs-dot--mint" />
            <span className="about-ufs-dot about-ufs-dot--slate" />

            <div className="about-ufs-strip-stack">
              {VISUAL_STRIPS.map((item, index) => (
                <article
                  key={item.title}
                  className={`about-ufs-strip about-ufs-strip--${index + 1}`}
                >
                  <div className="about-ufs-strip__icon">
                    <i className={`fa-solid ${item.icon}`} />
                  </div>
                  <div className="about-ufs-strip__copy">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUfsSection;
