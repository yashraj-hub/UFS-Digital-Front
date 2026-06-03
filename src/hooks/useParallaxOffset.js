import { useEffect, useState } from "react";

/**
 * Scroll-based offset for parallax backgrounds (px). Respects prefers-reduced-motion.
 * @param {number} speed — multiplier applied to window.scrollY (0.3–0.45 is typical)
 */
export function useParallaxOffset(speed = 0.35) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setOffset(0);
      return undefined;
    }

    let frameId = 0;
    const updateOffset = () => {
      frameId = 0;
      const scrollY = Math.max(window.scrollY || 0, 0);
      setOffset(Math.round(scrollY * speed));
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(updateOffset);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return offset;
}
