import { useEffect, useRef, useState } from "react";
import "./HeroStats.css";

const STATS = [
  {
    target: 7,
    suffix: "Years+",
    label: "Banking Experience",
    formatter: (v) => v.toString(),
  },
  {
    target: 23,
    suffix: "States",
    label: "Pan India Presence",
    formatter: (v) => v.toString(),
  },
  {
    target: 3360,
    suffix: "K",
    label: "CSP Branches",
    formatter: (v) => (v / 1000).toFixed(2),
  },
  {
    target: 250000,
    suffix: "K+",
    label: "Value Customers",
    formatter: (v) => Math.round(v / 1000).toString(),
  },
];

function HeroStats() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1400;
    const start = window.performance.now();
    let frameId;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCounts(STATS.map((item) => Math.round(item.target * eased)));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible]);

  return (
    <div className="home-hero-stats" ref={ref}>
      <div
        className="home-hero-stats__panel"
        role="region"
        aria-label="UFS Digital at a glance"
      >
        {STATS.map((item, i) => (
          <div key={item.label} className="home-hero-stats__item">
            <p className="home-hero-stats__value">
              <span className="home-hero-stats__number">{item.formatter(counts[i])}</span>
              <span className="home-hero-stats__suffix">{item.suffix}</span>
            </p>
            <p className="home-hero-stats__label">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroStats;
