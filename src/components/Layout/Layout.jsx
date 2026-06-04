import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Layout() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const cursorRef = useRef(null);

  const isFlushRoute =
    location.pathname === "/" ||
    location.pathname === "/entrepreneurs" ||
    location.pathname === "/services" ||
    location.pathname === "/blog" ||
    location.pathname.startsWith("/blog/") ||
    location.pathname === "/team" ||
    location.pathname === "/careers" ||
    location.pathname === "/contact" ||
    location.pathname === "/become-agent";

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top  = e.clientY + "px";
    };
    const onDown  = () => cursor.classList.add("is-clicking");
    const onUp    = () => cursor.classList.remove("is-clicking");

    const addHover = (el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
    };

    const attachAll = () => {
      document.querySelectorAll("a, button, [role='button']").forEach(addHover);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    attachAll();

    const observer = new MutationObserver(attachAll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      observer.disconnect();
    };
  }, []);

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="app-shell">
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      <Navbar />
      <main className={isFlushRoute ? "page-container page-container--flush" : "page-container"}>
        <Outlet />
      </main>
      <Footer />

      {showScrollTop ? (
        <button
          type="button"
          className="scroll-top-btn"
          aria-label="Scroll to top"
          onClick={handleScrollTop}
        >
          <i className="fa-solid fa-arrow-up" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default Layout;
