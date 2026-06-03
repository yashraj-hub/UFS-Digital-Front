import { useEffect, useRef, useState } from "react";
import "./HomePartnersSection.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function HomePartnersSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    if (!partners.length) {
      return undefined;
    }

    const section = sectionRef.current;
    if (!section || typeof window === "undefined") {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, [partners.length]);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/partners`)
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => {
        if (!response.ok) {
          throw new Error(payload.message || payload.error || "Unable to load partners");
        }

        if (isMounted) {
          setPartners((payload.data || []).filter((partner) => partner.logo_url));
        }
      })
      .catch(() => {
        if (isMounted) {
          setPartners([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!partners.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`home-partners-section${isVisible ? " is-visible" : ""}`}
      aria-labelledby="home-partners-title"
    >
      <div className="home-partners-inner">
        <p className="home-partners-eyebrow">Our Partners</p>
        <h2 id="home-partners-title" className="home-partners-title">
          Collaborating with leading institutions
        </h2>

        <div className="home-partners-marquee" aria-label="Our Partners">
          <div className="home-partners-track">
            {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
              <a
                key={`${partner.name}-${index}`}
                className="home-partner-logo"
                href={partner.website_url || undefined}
                target={partner.website_url ? "_blank" : undefined}
                rel={partner.website_url ? "noreferrer" : undefined}
                aria-label={partner.website_url ? `Visit ${partner.name}` : partner.name}
              >
                <img src={partner.logo_url} alt={partner.name} className="home-partner-logo-image" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePartnersSection;
