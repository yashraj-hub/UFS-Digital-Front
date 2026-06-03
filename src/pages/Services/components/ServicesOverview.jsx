import { useEffect, useId, useMemo, useState } from "react";
import "./ServicesOverview.css";

const SERVICES = [
  {
    id: "banking",
    label: "Banking Services",
    eyebrow: "Service Focus",
    title: "Secure, accessible & technology-driven banking solutions",
    lead:
      "UFS provides modern banking solutions designed to improve accessibility, operational efficiency and customer convenience across urban and rural markets.",
    summary:
      "Our banking ecosystem combines digital enablement with assisted service delivery, helping institutions offer reliable, compliant and user-friendly financial access.",
    accent: "#f0b15d",
    accentSoft: "rgba(240, 177, 93, 0.16)",
    glow: "rgba(240, 177, 93, 0.08)",
    sectionBgStart: "#2c6c87",
    sectionBgMid: "#357f9d",
    sectionBgEnd: "#234b61",
    sectionGlow: "rgba(122, 196, 220, 0.24)",
    sectionWarm: "rgba(240, 177, 93, 0.16)",
    cards: [
      {
        number: "01",
        title: "Digital banking enablement",
        text: "Build secure transaction journeys and connected service touchpoints.",
        image:
          "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80&auto=format&fit=crop",
      },
      {
        number: "02",
        title: "AEPS & micro ATM support",
        text: "Enable biometric cash access for rural and semi-urban users.",
        image:
          "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80&auto=format&fit=crop",
      },
      {
        number: "03",
        title: " Onboarding support",
        text: "Support withdrawals, fund transfers, bill payments and account opening assistance.",
        image:
          "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1200&q=80&auto=format&fit=crop",
      },
    ],
    benefits: [
      "Reliable Infrastructure",
      "Financial Inclusion Focus",
      "Secure Digital Transactions",
      "Faster Service Delivery",
    ],
    process: [
      { number: "01", title: "Requirement Assessment", iconKey: "assessment" },
      { number: "02", title: "Solution Integration", iconKey: "integration" },
      { number: "03", title: "Service Deployment", iconKey: "deployment" },
      { number: "04", title: "Ongoing Support", iconKey: "support" },
    ],
    panelTitle: "Trusted banking support for every community",
    panelCopy:
      "We focus on simplifying everyday financial activities including account access, digital transactions, payment services and assisted banking support through secure, scalable service architecture.",
    panelImage:
      "https://images.unsplash.com/photo-1556741533-f6acd647d2fb?w=1600&q=80&auto=format&fit=crop",
    panelPoints: [
      "Paperless and biometric-enabled workflows",
      "Rural and semi-urban banking accessibility",
      "Merchant and payment infrastructure support",
      "Customer-first service operations",
    ],
    impactTitle: "Banking services impact",
    impactText:
      "UFS banking services are designed to strengthen digital financial ecosystems by improving customer accessibility, reducing operational inefficiencies and enabling seamless transactions at scale.",
  },
  {
    id: "insurance",
    label: "Insurance Services",
    eyebrow: "Service Focus",
    title: "Smart insurance solutions designed for protection & trust",
    lead:
      "UFS delivers customer-focused insurance solutions that simplify access to protection services for individuals, families and businesses.",
    summary:
      "From policy discovery and onboarding to renewals and claim assistance, our insurance ecosystem makes every step more transparent, accessible and digitally efficient.",
    accent: "#7cc7ff",
    accentSoft: "rgba(124, 199, 255, 0.16)",
    glow: "rgba(124, 199, 255, 0.08)",
    sectionBgStart: "#1f6a4f",
    sectionBgMid: "#2f8b62",
    sectionBgEnd: "#194639",
    sectionGlow: "rgba(123, 214, 164, 0.26)",
    sectionWarm: "rgba(167, 244, 196, 0.12)",
    cards: [
      {
        number: "01",
        title: "Health & life protection",
        text: "Support access to essential personal and family coverage plans.",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop",
      },
      {
        number: "02",
        title: "General & motor insurance",
        text: "Guide customers through everyday insurance choices and renewals.",
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80&auto=format&fit=crop",
      },
      {
        number: "03",
        title: "Claim assistance & access",
        text: "Provide transparent guidance during claims while expanding access to underserved regions.",
        image:
          "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=1200&q=80&auto=format&fit=crop",
      },
    ],
    benefits: [
      "Simplified Customer Experience",
      "Digital-First Approach",
      "Trusted Service Ecosystem",
      "Scalable Service Delivery",
    ],
    process: [
      { number: "01", title: "Customer Requirement Analysis", iconKey: "assessment" },
      { number: "02", title: "Policy Guidance & Enablement", iconKey: "integration" },
      { number: "03", title: "Digital Processing", iconKey: "deployment" },
      { number: "04", title: "Ongoing Support & Assistance", iconKey: "support" },
    ],
    panelTitle: "Protection journeys that feel clearer and more human",
    panelCopy:
      "We work towards enabling better insurance awareness and seamless service experiences through technology-enabled platforms and simplified customer journeys.",
    panelImage:
      "https://images.unsplash.com/photo-1537502243685-8cf6e05b3d83?w=1600&q=80&auto=format&fit=crop",
    panelPoints: [
      "Guided onboarding and policy discovery",
      "Support for renewals and claim workflows",
      "Coverage options for individuals and businesses",
      "Customer education through assisted service models",
    ],
    impactTitle: "Insurance services impact",
    impactText:
      "UFS insurance solutions help improve insurance accessibility, enhance customer awareness and create efficient service experiences through reliable digital infrastructure.",
  },
  {
    id: "enterprise",
    label: "Enterprise Financial Solutions",
    eyebrow: "Service Focus",
    title: "Scalable financial infrastructure for modern businesses",
    lead:
      "UFS provides enterprise-focused financial solutions that help organizations modernize operations, improve efficiency and build scalable financial ecosystems.",
    summary:
      "By integrating advanced digital workflows, automation capabilities and scalable service infrastructure, UFS helps enterprises streamline financial operations while improving customer engagement.",
    accent: "#9db2d8",
    accentSoft: "rgba(157, 178, 216, 0.16)",
    glow: "rgba(157, 178, 216, 0.08)",
    sectionBgStart: "#9a412c",
    sectionBgMid: "#c85b2f",
    sectionBgEnd: "#6e261d",
    sectionGlow: "rgba(255, 150, 90, 0.25)",
    sectionWarm: "rgba(255, 196, 115, 0.14)",
    cards: [
      {
        number: "01",
        title: "Financial technology integration",
        text: "Connect tools, systems and digital touchpoints into one flow.",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop",
      },
      {
        number: "02",
        title: "Enterprise payment systems",
        text: "Build reliable payment environments that scale with operations.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
      },
      {
        number: "03",
        title: "Automation & API support",
        text: "Reduce manual complexity while creating data-driven financial ecosystems with secure integrations.",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop",
      },
    ],
    benefits: [
      "Scalable Architecture",
      "Technology-Driven Efficiency",
      "Secure Financial Systems",
      "Business-Centric Approach",
    ],
    process: [
      { number: "01", title: "Business Analysis", iconKey: "assessment" },
      { number: "02", title: "Strategy & Planning", iconKey: "integration" },
      { number: "03", title: "System Integration", iconKey: "deployment" },
      { number: "04", title: "Optimization & Support", iconKey: "support" },
    ],
    panelTitle: "Digital finance solutions for growing organisations",
    panelCopy:
      "Enterprise solutions are designed around operational goals, customer experience and performance optimization, making them a strong fit for businesses seeking secure digital transformation.",
    panelImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1600&q=80&auto=format&fit=crop",
    panelPoints: [
      "Digital service infrastructure and automation",
      "Merchant enablement and payment workflows",
      "Scalable onboarding and support systems",
      "Data-informed reporting and integration layers",
    ],
    impactTitle: "Enterprise services impact",
    impactText:
      "UFS enterprise solutions help organizations accelerate digital transformation, improve financial operations and create future-ready business ecosystems.",
  },
];

function ServicesOverview({ activeServiceId = SERVICES[0].id }) {
  const [activeId, setActiveId] = useState(activeServiceId);
  const patternBaseId = useId().replace(/:/g, "");
  const gridPatternId = `${patternBaseId}-grid`;
  const glowId = `${patternBaseId}-glow`;

  useEffect(() => {
    setActiveId(activeServiceId);
  }, [activeServiceId]);

  const activeService = useMemo(
    () => SERVICES.find((service) => service.id === activeId) ?? SERVICES[0],
    [activeId],
  );

  return (
    <section
      className="services-overview-section"
      id="services-overview"
      style={{
        "--service-accent": activeService.accent,
        "--service-accent-soft": activeService.accentSoft,
        "--service-glow": activeService.glow,
        "--service-bg-start": activeService.sectionBgStart,
        "--service-bg-mid": activeService.sectionBgMid,
        "--service-bg-end": activeService.sectionBgEnd,
        "--service-bg-glow": activeService.sectionGlow,
        "--service-bg-warm": activeService.sectionWarm,
      }}
    >
      <svg
        className="services-overview__pattern"
        viewBox="0 0 1200 760"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id={gridPatternId} width="72" height="72" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="1.25" fill="rgba(255, 255, 255, 0.24)" />
            <circle cx="39" cy="39" r="0.95" fill="rgba(255, 255, 255, 0.14)" />
            <path
              d="M0 36H72M36 0V72"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id={glowId} cx="0" cy="0" r="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="72%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="760" fill={`url(#${gridPatternId})`} />
        <rect width="1200" height="760" fill={`url(#${glowId})`} />
        <path
          d="M850 120c84 24 150 74 198 148"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M870 178c56 10 104 42 146 96"
          fill="none"
          stroke="rgba(240, 177, 93, 0.18)"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>

      <div className="content-wrap services-overview__shell">
        <div className="services-overview__header">
          <p className="services-overview__eyebrow">Service Overview</p>
          <h2>Smart service verticals for growth</h2>
          <p className="services-overview__description">
            Our integrated service ecosystem is designed to bridge the gap
            between technology and financial inclusion. UFS empowers
            businesses, institutions and customers through reliable digital
            infrastructure, seamless service delivery and scalable financial
            solutions that support long-term growth.
          </p>
        </div>

        <div className="services-overview__tabs" role="tablist" aria-label="Service verticals">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                type="button"
                role="tab"
                aria-selected={service.id === activeId}
                style={{ "--tab-accent": service.accent }}
                className={
                  service.id === activeId
                    ? "services-overview__tab is-active"
                    : "services-overview__tab"
                }
                onClick={() => setActiveId(service.id)}
              >
                <span className="services-overview__tab-icon" aria-hidden="true" />
                <span className="services-overview__tab-label">{service.label}</span>
              </button>
            ))}
          </div>

        <div className="services-overview__stage" key={activeService.id}>
          <div className="services-overview__cards services-overview__cards--image-grid">
            {activeService.cards.map((card) => (
              <article
                key={card.title}
                className="services-overview__media-card"
                style={{ backgroundImage: `url(${card.image})` }}
              >
                <div className="services-overview__media-card-overlay" aria-hidden="true" />
                <div className="services-overview__media-card-content">
                  <span className="services-overview__media-card-number">{card.number}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>

          <article className="services-overview__feature-card">
            <div className="services-overview__feature-card-content">
              <p className="services-overview__panel-eyebrow">{activeService.eyebrow}</p>
              <h3>{activeService.panelTitle}</h3>
              <p className="services-overview__panel-copy">{activeService.panelCopy}</p>

              <div className="services-overview__panel-points">
                {activeService.panelPoints.map((point) => (
                  <div key={point} className="services-overview__panel-point">
                    <span aria-hidden="true" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="services-overview__process">
          <div className="services-overview__process-copy">
            <p className="services-overview__process-eyebrow">Service Process</p>
            <h3>How we move from planning to reliable delivery</h3>
            <p>
              Every vertical follows a clear onboarding path, secure deployment
              and ongoing support model so the service experience stays
              efficient and dependable.
            </p>
          </div>

          <div className="services-overview__process-steps" aria-label={`${activeService.label} process steps`}>
            {activeService.process.map((step) => (
              <article key={step.title} className="services-overview__process-step">
                <div className="services-overview__process-step-number">{step.number}</div>
                <div className="services-overview__process-step-body">
                  <ProcessIcon iconKey={step.iconKey} />
                  <p>{step.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function ProcessIcon({ iconKey }) {
  const sharedProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (iconKey) {
    case "assessment":
      return (
        <svg {...sharedProps}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v5h5" />
          <path d="M9 12h6" />
          <path d="M9 15h4.5" />
        </svg>
      );
    case "integration":
      return (
        <svg {...sharedProps}>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
          <path d="M8 8l4-4 4 4" />
          <path d="M8 16l4 4 4-4" />
        </svg>
      );
    case "deployment":
      return (
        <svg {...sharedProps}>
          <path d="M4 12h6l2-3 3 6 2-3h3" />
          <path d="M6 6h12" />
          <path d="M6 18h12" />
        </svg>
      );
    case "support":
      return (
        <svg {...sharedProps}>
          <path d="M12 3a4 4 0 0 1 4 4v2" />
          <path d="M12 21a4 4 0 0 1-4-4v-2" />
          <path d="M8 7h8" />
          <path d="M8 17h8" />
          <path d="M7 12h10" />
        </svg>
      );
    default:
      return null;
  }
}

export default ServicesOverview;
