import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import logoWhite from "../../pages/Home/UFS DIGITAL NEW LOGO FINAL) WHITE.png";
import logoDark from "../../pages/Home/UFS DIGITAL NEW LOGO FINAL).png";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/entrepreneurs", label: "Entrepreneurs" },
];

const linksAfterServices = [
  { to: "/blog", label: "Blog" },
  { to: "/team", label: "Team" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
];

const serviceLinks = [
  { to: "/services?focus=banking#services-overview", label: "Banking Services" },
  { to: "/services?focus=insurance#services-overview", label: "Insurance Services" },
  { to: "/services?focus=financial#services-overview", label: "Financial Services" }
];

// All nav link paths for indicator (excludes "/" — home has no indicator needed)
const ALL_NAV_PATHS = [
  "/entrepreneurs",
  "/services",
  "/blog",
  "/team",
  "/careers",
  "/contact",
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [indicator, setIndicator] = useState({ x: 0, width: 34, visible: false });
  const location = useLocation();
  const navListRef = useRef(null);
  const linkRefsMap = useRef({});
  const isHomeRoute = location.pathname === "/";
  const isOverlayRoute = isHomeRoute;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateIndicator = () => {
      if (window.innerWidth <= 1024) {
        setIndicator((prev) => ({ ...prev, visible: false }));
        return;
      }

      const activePath = ALL_NAV_PATHS.find((p) => location.pathname.startsWith(p));
      // Also check home exact match
      const activeKey = location.pathname === "/" ? "/" : activePath;
      if (!activeKey) {
        setIndicator((prev) => ({ ...prev, visible: false }));
        return;
      }

      const el = linkRefsMap.current[activeKey];
      const ul = navListRef.current;
      if (!el || !ul) {
        setIndicator((prev) => ({ ...prev, visible: false }));
        return;
      }

      // Use getBoundingClientRect so position is always relative to the ul, regardless of DOM nesting
      const ulRect = ul.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const width = 34;
      const x = elRect.left - ulRect.left + (elRect.width - width) / 2;
      setIndicator({ x, width, visible: true });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [location.pathname, isMenuOpen]);

  useEffect(() => {
    if (!isOverlayRoute) {
      setIsAtTop(false);
      return undefined;
    }

    const updateTopState = () => {
      setIsAtTop((window.scrollY || 0) <= 4);
    };

    updateTopState();
    window.addEventListener("scroll", updateTopState, { passive: true });
    return () => window.removeEventListener("scroll", updateTopState);
  }, [isOverlayRoute]);

  const headerClassName = [
    "site-header",
    isOverlayRoute ? "site-header--customers" : "",
    isOverlayRoute && isAtTop && !isMenuOpen ? "site-header--at-top" : ""
  ].filter(Boolean).join(" ");

  return (
    <header className={headerClassName}>
      <div className="content-wrap nav-content">
        <Link to="/" className="brand" aria-label="UFS Digital home">
          <img 
            src={isOverlayRoute && isAtTop && !isMenuOpen ? logoWhite : logoDark} 
            alt="UFS Digital" 
            className="brand-logo" 
          />
        </Link>

        <button
          type="button"
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={isMenuOpen ? "nav-panel open" : "nav-panel"}>
          <nav aria-label="Main navigation">
            <ul className="nav-list" ref={navListRef}>
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    ref={(el) => { linkRefsMap.current[link.to] = el; }}
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item nav-item--dropdown">
                <NavLink
                  to="/services"
                  ref={(el) => { linkRefsMap.current["/services"] = el; }}
                  className={() => {
                    const isServices = location.pathname.startsWith("/services");
                    return isServices ? "nav-link active nav-link--dropdown" : "nav-link nav-link--dropdown";
                  }}
                >
                  Services <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.65rem', opacity: 0.7 }} />
                </NavLink>
                <div className="nav-dropdown" aria-label="Services submenu">
                  {serviceLinks.map((item) => (
                    <Link key={item.to} to={item.to} className="nav-dropdown__link">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </li>
              {linksAfterServices.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    ref={(el) => { linkRefsMap.current[link.to] = el; }}
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <span
                className={indicator.visible ? "nav-indicator visible" : "nav-indicator"}
                style={{
                  width: `${indicator.width}px`,
                  transform: `translateX(${indicator.x}px)`
                }}
                aria-hidden="true"
              />
            </ul>
          </nav>
          <Link to="/become-agent" className="btn btn-custom3 mobile-cta">
            Become a BC Agent
          </Link>
        </div>

        <div className="nav-cta-group">
          <Link to="/become-agent" className="btn btn-custom3 desktop-cta">
            Become a BC Agent
          </Link>
        </div>
      </div>

      {isMenuOpen ? (
        <button
          type="button"
          className="mobile-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsMenuOpen(false)}
        />
      ) : null}
    </header>
  );
}

export default Navbar;
