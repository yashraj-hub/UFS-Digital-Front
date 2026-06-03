import { useEffect } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo/Seo";
import PageHero from "../../components/PageHero/PageHero";
import PageIntro from "../../components/PageIntro/PageIntro";
import AgentServicesSection from "./AgentServicesSection";
import EarningsGrowthSection from "./EarningsGrowthSection";
import StartJourneySection from "./StartJourneySection";
import TestimonialsSection from "./TestimonialsSection";
import WhyBecomeAgentSection from "./WhyBecomeAgentSection";
import { pageSeo } from "../../seo/siteMeta";
import "./EntrepreneursPage.css";

const HERO_IMAGE_URL = "https://images.pexels.com/photos/19969240/pexels-photo-19969240.jpeg";

function EntrepreneursPage() {
  useEffect(() => {
    const page = document.querySelector(".entrepreneurs-page");
    if (!page) return;

    const revealTargets = page.querySelectorAll(
      [
        ".entrepreneurs-section__intro",
        ".entrepreneurs-intro-copy p",
        ".entrepreneurs-benefit",
        ".agent-services__header",
        ".agent-services__card",
        ".journey-scroll__header",
        ".journey-step",
        ".journey-eligibility",
        ".earnings-growth-image-panel",
        ".earnings-growth-content > *",
        ".testimonials-section__intro",
        ".testimonials-section__quote",
        ".entrepreneurs-cta > *",
      ].join(", "),
    );

    revealTargets.forEach((target, index) => {
      target.classList.add("entrepreneurs-scroll-reveal");
      target.style.setProperty("--reveal-index", index % 6);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="entrepreneurs-page">
      <Seo {...pageSeo.entrepreneurs} />
      <PageHero imageUrl={HERO_IMAGE_URL} />

      <PageIntro
        stacked
        eyebrow="Opportunity"
        headingAs="h1"
        heading="Build a trusted business that creates local financial access"
        paragraphs={[
          "Banking Correspondents are becoming the bridge between formal financial services and underserved communities. As an entrepreneur, you can provide everyday banking assistance while building a strong, respected income source.",
          "From cash withdrawal and account support to insurance and loan assistance, this model helps you create impact and economic independence at the same time."
        ]}
      />

      <WhyBecomeAgentSection />

      <AgentServicesSection />

      <StartJourneySection />

      <EarningsGrowthSection />

      <TestimonialsSection />

      <section className="entrepreneurs-section entrepreneurs-section--cta" id="cta">
        <div className="content-wrap">
          <div className="entrepreneurs-cta">
            <div>
              <h2>
                Start Your <span>Entrepreneur</span> Journey Today
              </h2>
            </div>

            <div className="entrepreneurs-cta__actions">
              <Link className="home-btn home-btn--primary" to="/become-agent">
                Apply Now
              </Link>
              <Link className="home-btn home-btn--secondary" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EntrepreneursPage;
