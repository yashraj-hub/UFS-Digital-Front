import { useEffect, useRef, useState } from "react";
import "./StatsSection.css";

const STATS = [
  {
    target: 6,
    suffix: "Years+",
    label: "Banking Experience",
    formatter: (value) => value.toString(),
  },
  {
    target: 23,
    suffix: "States",
    label: "Pan India Presence",
    formatter: (value) => value.toString(),
  },
  {
    target: 3360,
    suffix: "K",
    label: "CSP Branches",
    formatter: (value) => (value / 1000).toFixed(2),
  },
  {
    target: 250000,
    suffix: "K+",
    label: "Value Customers",
    formatter: (value) => Math.round(value / 1000).toString(),
  },
];

function StatsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(STATS.map(() => 0));

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
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || typeof window === "undefined") {
      return undefined;
    }

    const duration = 1400;
    const start = window.performance.now();
    let frameId = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;

      setCounts(STATS.map((item) => Math.round(item.target * eased)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [isVisible]);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-section__container">
        <div className="stats-section__card">
          {STATS.map((item, index) => (
            <article key={item.label} className="stats-section__stat">
              <p className="stats-section__value">
                <span className="stats-section__number">
                  {item.formatter(counts[index])}
                </span>
                <span className="stats-section__suffix">{item.suffix}</span>
              </p>
              <p className="stats-section__label">{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
