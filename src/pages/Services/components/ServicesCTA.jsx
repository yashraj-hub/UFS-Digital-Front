import { Link } from "react-router-dom";
import "./ServicesCTA.css";

function ServicesCTA() {
  return (
    <section className="services-cta-section">
      <div className="services-cta-banner">
        <div className="services-cta-content">
          <h2>
            Empower Your Business with <span>Smart Financial Services</span>
          </h2>
        </div>
        <div className="services-cta-actions">
          <Link to="/services?focus=banking#services-overview" className="services-cta-btn services-cta-btn--primary">
            Explore Services
          </Link>
          <Link to="/contact" className="services-cta-btn services-cta-btn--secondary">
            Contact Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ServicesCTA;
