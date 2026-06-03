import { useEffect, useRef, useState } from "react";
import BrushSeparator from "../BrushSeparator/BrushSeparator";
import "./CustomerHero.css";

const HERO_VIDEO_SRC = new URL("./hero.mp4", import.meta.url).href;
const HERO_STATS = [
  {
    key: "years",
    value: 6,
    progress: 68,
    accent: "#f97316",
    label: "Years of Experience"
  },
  {
    key: "states",
    value: 19,
    progress: 74,
    accent: "#22c55e",
    label: "Presence in States / UTs"
  },
  {
    key: "branches",
    value: 3360,
    progress: 84,
    accent: "#06b6d4",
    format: (value) => `${(value / 1000).toFixed(1)}k`,
    label: "Our CSP Branches"
  },
  {
    key: "customers",
    value: 250000,
    progress: 92,
    accent: "#eab308",
    format: (value) => `${Math.round(value / 1000)}k`,
    label: "Happy Customers"
  }
];

function CustomerHero() {
  const videoRef = useRef(null);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [entryStage, setEntryStage] = useState(0);
  const [counts, setCounts] = useState(() =>
    HERO_STATS.reduce((accumulator, item) => {
      accumulator[item.key] = 0;
      return accumulator;
    }, {})
  );

  useEffect(() => {
    setEntryStage(1);
    const stage2 = window.setTimeout(() => setEntryStage(2), 280);
    const stage3 = window.setTimeout(() => setEntryStage(3), 520);

    return () => {
      window.clearTimeout(stage2);
      window.clearTimeout(stage3);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    const playVideo = () => {
      video.play().catch(() => {});
    };

    const reveal = () => {
      setIsIntroDone(true);
    };

    video.src = HERO_VIDEO_SRC;
    playVideo();
    video.addEventListener("canplay", playVideo);
    video.addEventListener("loadeddata", reveal);

    const failSafeReveal = window.setTimeout(reveal, 1200);

    return () => {
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadeddata", reveal);
      window.clearTimeout(failSafeReveal);
    };
  }, []);

  useEffect(() => {
    const updateTop = () => {
      setIsAtTop((window.scrollY || 0) <= 8);
    };

    updateTop();
    window.addEventListener("scroll", updateTop, { passive: true });
    return () => window.removeEventListener("scroll", updateTop);
  }, []);

  useEffect(() => {
    const duration = 1300;
    const start = performance.now();
    let rafId = 0;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - (1 - progress) * (1 - progress);

      setCounts(
        HERO_STATS.reduce((accumulator, item) => {
          accumulator[item.key] = Math.round(item.value * easeOut);
          return accumulator;
        }, {})
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const headingVisible = entryStage >= 1;
  const paragraphVisible = entryStage >= 2;
  const ctaVisible = entryStage >= 2;
  const statsReady = entryStage >= 3;
  const getStatDisplayValue = (item) =>
    item.format ? item.format(counts[item.key] ?? 0) : (counts[item.key] ?? 0).toLocaleString("en-IN");

  return (
    <section
      className="customer-hero-simple"
      aria-label="Customers hero section"
    >
      <div
        className={
          isIntroDone ? "customer-page-intro is-done" : "customer-page-intro"
        }
      />

      <video
        ref={videoRef}
        className="customer-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="customer-hero-overlay" />

      <div className="customer-hero-content">
        <h1 className={headingVisible ? "customer-hero-heading fade-in" : "customer-hero-heading"}>
          Your Trusted Partner for
          <br /> Government & Banking Services
        </h1>
        <p className={paragraphVisible ? "customer-hero-copy fade-in" : "customer-hero-copy"}>
          Welcome to UFS Digital Limited, your reliable partner in navigating
          the world of government schemes, insurance, pensions, and banking
          services.
        </p>

        <div className={ctaVisible ? "customer-hero-cta-group fade-in" : "customer-hero-cta-group"}>
          <a
            href="#customer-insights"
            className="customer-hero-cta customer-hero-cta--primary"
          >
            Explore Solutions
          </a>
          <a
            href="#customer-benefits"
            className="customer-hero-cta customer-hero-cta--secondary"
          >
            Learn More
          </a>
        </div>
      </div>

      <div
        className={
          `customer-hero-stats ${isAtTop && statsReady ? "is-visible" : "is-hidden"}`.trim()
        }
      >
        {HERO_STATS.map((item) => (
          <article
            key={item.key}
            className="hero-stat-circle"
            style={{ "--target-progress": item.progress, "--accent": item.accent }}
          >
            <svg className="hero-stat-ring" viewBox="0 0 132 132" aria-hidden="true">
              <circle className="hero-stat-ring-track" cx="66" cy="66" r="57" />
              <circle className="hero-stat-ring-progress" cx="66" cy="66" r="57" />
            </svg>
            <div className="hero-stat-inner">
              <div className="hero-stat-value">{getStatDisplayValue(item)}</div>
              <div style={{ color: item.accent }} className="hero-stat-unit">{item.label}</div>
            </div>
          </article>
        ))}
      </div>

      <BrushSeparator
        color="#ffffff"
        className="customer-hero-divider"
        absolute
        height="170px"
        offsetY="52%"
        waveDistance="34px"
      />
    </section>
  );
}

export default CustomerHero;
