import { useEffect, useRef } from "react";
import "./ServicesHero.css";

const HERO_IMAGE_URL =
  "https://images.pexels.com/photos/37311265/pexels-photo-37311265.jpeg";

function ServicesHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      hero.style.setProperty("--hero-parallax-y", "0px");
      return;
    }

    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const offset = Math.max(-160, Math.min(160, rect.top * -0.45));
      hero.style.setProperty("--hero-parallax-y", `${offset}px`);
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section className="services-hero" ref={heroRef} aria-label="Services hero">
      <div
        className="services-hero__visual"
        aria-hidden="true"
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
      />

      <div className="services-hero__overlay" aria-hidden="true" />

      <div className="content-wrap services-hero__grid" aria-hidden="true" />
    </section>
  );
}

export default ServicesHero;
