import { useEffect, useRef, useState } from "react";
import "./StartJourneySection.css";

const journeySteps = [
  {
    icon: "fa-solid fa-file-pen",
    title: "Register Online",
  },
  {
    icon: "fa-solid fa-user-check",
    title: "Verification",
  },
  {
    icon: "fa-solid fa-screwdriver-wrench",
    title: "Training & Setup",
  },
  {
    icon: "fa-solid fa-chart-line",
    title: "Start Earning",
  },
];

const eligibilityPoints = [
  "Minimum 10th/12th pass qualification",
  "Basic smartphone and app usage knowledge",
  "Aadhaar card and PAN card availability",
  "Small investment capability for setup",
  "Strong willingness to serve the community",
];

function StartJourneySection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`entrepreneurs-section journey-scroll${isVisible ? " is-visible" : ""}`}
      id="journey"
    >
      <div className="content-wrap">
        <div className="journey-scroll__header journey-reveal" style={{ "--journey-delay": "0s" }}>
          <p className="entrepreneurs-section__eyebrow">How It Works</p>
          <h2>
            Start Your <span>Journey</span> in 4 Simple Steps
          </h2>
          <p>
            Move from registration to earning with a clear onboarding path,
            guided verification, practical training, and the right tools to
            serve customers confidently from your local service point.
          </p>
        </div>

        <div className="journey-timeline journey-reveal" style={{ "--journey-delay": "0.08s" }}>
          <div className="journey-timeline__track" aria-hidden="true">
            <span className="journey-timeline__track-fill" />
          </div>

          <div className="journey-timeline__steps">
            {journeySteps.map((step, index) => (
              <article
                key={step.title}
                className="journey-step"
                style={{ "--step-delay": `${0.18 + index * 0.08}s` }}
              >
                <span className="journey-step__marker">0{index + 1}</span>
                <h3>
                  <i className={step.icon} aria-hidden="true" />
                  <span>{step.title}</span>
                </h3>
              </article>
            ))}
          </div>
        </div>

        <div className="journey-eligibility journey-reveal" style={{ "--journey-delay": "0.52s" }}>
          <div>
            <p className="entrepreneurs-section__eyebrow">Eligibility</p>
            <h3>Who Can Apply?</h3>
          </div>
          <ul>
            {eligibilityPoints.map((point, index) => (
              <li key={point} style={{ "--item-index": index }}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default StartJourneySection;
