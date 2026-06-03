import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../../components/Seo/Seo";
import "./ServicesPage.css";
import PageIntro from "../../components/PageIntro/PageIntro";
import ServicesHero from "./components/ServicesHero";
import ServicesOverview from "./components/ServicesOverview";
import ServiceShowcase from "./components/ServiceShowcase";
import ServicesCTA from "./components/ServicesCTA";
import { pageSeo } from "../../seo/siteMeta";

const ServicesPage = () => {
  const location = useLocation();

  const activeServiceId = useMemo(() => {
    const focus = new URLSearchParams(location.search).get("focus");
    switch (focus) {
      case "banking":
        return "banking";
      case "insurance":
        return "insurance";
      case "financial":
      case "enterprise":
        return "enterprise";
      default:
        return "banking";
    }
  }, [location.search]);

  useEffect(() => {
    const focus = new URLSearchParams(location.search).get("focus");
    if (!focus) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById("services-overview");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.search]);

  return (
    <div className="services-page">
      <Seo {...pageSeo.services} />
      <ServicesHero />
      <PageIntro
        eyebrow="Opportunity"
        headingAs="h1"
        heading="A unified ecosystem of financial & enterprise services"
        paragraphs={[
          "Our service ecosystem is designed to connect communities with reliable banking, insurance and financial assistance through technology-driven experiences. Built to create accessible, trusted and future-ready financial ecosystems.",
          "Each solution is crafted to improve accessibility, simplify operations and strengthen trust at every level of customer engagement."
        ]}
      />
      <ServicesOverview activeServiceId={activeServiceId} />
      <ServiceShowcase />
      <ServicesCTA />
    </div>
  );
};

export default ServicesPage;
