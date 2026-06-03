import { Link } from "react-router-dom";
import "./Footer.css";
import ufsLogoWhite from "../../pages/Home/UFS DIGITAL NEW LOGO FINAL) WHITE.png";

const serviceLinks = [
  { to: "/services?focus=banking#services-overview", label: "Banking Services", icon: "fa-building-columns" },
  { to: "/services?focus=insurance#services-overview", label: "Insurance Services", icon: "fa-shield-halved" },
  { to: "/services?focus=financial#services-overview", label: "Financial Services", icon: "fa-chart-line" }
];

const pageLinks = [
  { to: "/", label: "Home" },
  { to: "/entrepreneurs", label: "Entrepreneurs" },
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact Us" }
];

const socialLinks = [
  {
    href: "https://in.linkedin.com/company/ufs-digital-ltd-ufs",
    label: "LinkedIn",
    icon: "fa-brands fa-linkedin-in"
  },
  {
    href: "mailto:connect@ufsdigital.one",
    label: "Email",
    icon: "fa-solid fa-envelope"
  },
  {
    to: "/become-agent",
    label: "Become a BC Agent",
    icon: "fa-solid fa-arrow-right"
  }
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__glow site-footer__glow--one" aria-hidden="true" />
      <div className="site-footer__glow site-footer__glow--two" aria-hidden="true" />

      <div className="content-wrap footer-shell">
        <div className="footer-main">
          <section className="footer-brand" aria-label="UFS Digital brand">
            <Link to="/" className="footer-brand__logo-link" aria-label="UFS Digital home">
              <img src={ufsLogoWhite} alt="UFS Digital" className="footer-logo" />
            </Link>

            <p className="footer-desc">
              We empower rural and urban communities with dependable banking, insurance,
              and financial services delivered through a trusted BC agent network.
            </p>

            <div className="footer-socials" aria-label="Social and quick links">
              {socialLinks.map((item) => {
                if (item.to) {
                  return (
                    <Link key={item.label} to={item.to} className="footer-social" aria-label={item.label}>
                      <i className={item.icon} aria-hidden="true" />
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="footer-social"
                    aria-label={item.label}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <i className={item.icon} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </section>

          <nav className="footer-links-block" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>
                    <i className={`fa-solid ${link.icon}`} aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-links-block" aria-label="Pages">
            <h3>Pages</h3>
            <ul>
              {pageLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="footer-contact" aria-label="Contact information">
            <h3>Contact</h3>
            <div className="footer-contact__cards">
              <div className="footer-contact__item">
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                <p>7th floor, Summit Building, Vibhuti Khand, Gomti Nagar, Lucknow-226010, U.P.</p>
              </div>

              <a href="mailto:connect@ufsdigital.one" className="footer-contact__item">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <p>connect@ufsdigital.one</p>
              </a>

              <a href="tel:+919876543210" className="footer-contact__item">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <p>+91 98765 43210</p>
              </a>
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} <span className="copyright-brand">UFS - DIGITAL LIMITED</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
