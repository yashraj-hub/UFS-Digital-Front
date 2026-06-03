import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Layout() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
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
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 260);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
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
