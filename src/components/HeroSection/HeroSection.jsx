import { useEffect, useMemo, useState } from "react";
import "./HeroSection.css";
import defaultHeroBg from "./Untitled design.png";
import BrushSeparator from "../BrushSeparator/BrushSeparator";
import { useParallaxOffset } from "../../hooks/useParallaxOffset";

const STAT_ANIMATION_DURATION_MS = 1400;

const parseStats = (stats) =>
  stats.map((item) => {
    const rawValue = String(item.value || "").trim();
    const match = rawValue.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);

    if (!match) {
      return { ...item, numericValue: null, suffix: "", displayValue: rawValue };
    }

    return {
      ...item,
      numericValue: Number(match[1]),
      suffix: match[2] ? ` ${match[2].trim()}` : "",
      displayValue: rawValue
    };
  });

const useAnimatedStats = (items) => {
  const colors = useMemo(() => items.map((item) => item.color || "#e43c08"), [items]);
  const [values, setValues] = useState(items.map((item) => item.displayValue));

  useEffect(() => {
    setValues(items.map((item) => item.displayValue));
    const hasAnimatedNumber = items.some((item) => item.numericValue !== null);
    if (!hasAnimatedNumber) {
      return undefined;
    }

    let animationFrameId;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / STAT_ANIMATION_DURATION_MS, 1);

      setValues(
        items.map((item) => {
          if (item.numericValue === null) {
            return item.displayValue;
          }
          const value = Math.round(item.numericValue * progress);
          return `${value}${item.suffix}`;
        })
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [items]);

  return { values, colors };
};

function HeroSection({ headingPrimary = "", headingSecondary = "", paragraph = "", stats = [], bgImage }) {
  const statItems = useMemo(() => stats.slice(0, 3), [stats]);
  const parsedStatItems = useMemo(() => parseStats(statItems), [statItems]);
  const { values: animatedValues, colors } = useAnimatedStats(parsedStatItems);
  const parallaxOffset = useParallaxOffset();
  const [entryStage, setEntryStage] = useState(0);
  const [bgLoaded, setBgLoaded] = useState(false);
  const backgroundImage = bgImage || defaultHeroBg;

  useEffect(() => {
    setEntryStage(1);
    const stage2 = setTimeout(() => setEntryStage(2), 500);
    const stage3 = setTimeout(() => setEntryStage(3), 900);

    return () => {
      clearTimeout(stage2);
      clearTimeout(stage3);
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    setBgLoaded(false);

    const image = new Image();
    image.loading = "eager";
    image.src = backgroundImage;
    image.onload = () => {
      if (isActive) {
        setBgLoaded(true);
      }
    };
    image.onerror = () => {
      if (isActive) {
        setBgLoaded(true);
      }
    };

    return () => {
      isActive = false;
    };
  }, [backgroundImage]);

  const headingVisible = entryStage >= 1;
  const paragraphVisible = entryStage >= 2;
  const statsVisible = entryStage >= 3;

  return (
    <section
      className={`hero-section${bgLoaded ? " hero-bg-visible" : ""}`}
      style={{
        "--hero-bg-image": `url("${backgroundImage}")`,
        "--hero-bg-y": `${parallaxOffset}px`
      }}
    >
      <BrushSeparator
        color="#ffffff"
        className="hero-divider-brush"
        absolute
        height="150px"
        offsetY="45%"
        waveDistance="30px"
      />
      <div className="hero-overlay">
        <div className="content-wrap hero-inner">
          <div className="hero-content">
            <h1 className={`ibridge-h1-duotone hero-heading ${headingVisible ? "fade-in" : ""}`}>
              <span className="line tone-dark">{headingPrimary}</span>
              <span className="line tone-light">{headingSecondary}</span>
            </h1>

            <p className={`ibridge-para hero-paragraph ${paragraphVisible ? "fade-in" : ""}`}>
              {paragraph}
            </p>

            <div className="hero-stats">
              {parsedStatItems.map((item, index) => (
                <article
                  key={`${item.value}-${index}`}
                  className={`hero-stat ${statsVisible ? "fade-in" : ""}`}
                >
                  <p className="hero-stat-value" style={{ color: colors[index] }}>
                    {animatedValues[index]}
                  </p>
                  <p className="hero-stat-label">{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}

export default HeroSection;
