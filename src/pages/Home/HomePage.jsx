import { useParallaxOffset } from "../../hooks/useParallaxOffset";
import Seo from "../../components/Seo/Seo";
import AboutUfsSection from "./AboutUfsSection";
import HeroStats from "./HeroStats";
import OurBusinessSection from "./OurBusinessSection";
import BFSIServicesSection from "./BFSIServicesSection";
import HomePartnersSection from "./HomePartnersSection";
import WomenEmpowermentSection from "./WomenEmpowermentSection";
import ImpactMapSection from "./ImpactMapSection";
import { pageSeo } from "../../seo/siteMeta";
import "./HomePage.css";

const HOME_HERO_PARALLAX_SPEED = 0.38;
const heroVideoSrc = "https://www.pexels.com/download/video/9341428/";

function HomePage() {
  const parallaxY = useParallaxOffset(HOME_HERO_PARALLAX_SPEED);

  return (
    <div className="home-page">
      <Seo {...pageSeo.home} />
      <section className="home-hero">
        <div className="home-hero__parallax" aria-hidden="true">
          <div
            className="home-hero__parallax-inner"
            style={{
              transform: `translate3d(-50%, calc(-50% + ${parallaxY}px), 0)`,
            }}
          >
            <video
              className="home-hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={heroVideoSrc} type="video/mp4" />
            </video>
            <div className="home-hero__video-overlay" />
          </div>
        </div>
        <div className="content-wrap home-hero__grid">
          <div className="home-hero__copy">
            <h1 className="home-hero__title">
              Your Trusted Partner for <br />
              Government & Banking Services
            </h1>
            {/* <p className="home-hero__text">
              Unlock the potential of essential services with our innovative solutions
              <br />Access through simple, fast, and reliable services. 
            </p> */}

            {/* <div className="home-hero__actions">
              <Link to="/customers" className="home-btn home-btn--primary">
                Explore Solutions
              </Link>
              <Link to="/customers" className="home-btn home-btn--secondary">
                Learn More
              </Link>
            </div> */}
          </div>
        </div>
        <HeroStats />
      </section>
      <AboutUfsSection />
      <OurBusinessSection />
      <BFSIServicesSection />
      <WomenEmpowermentSection />
      <ImpactMapSection />
      <HomePartnersSection />
    </div>
  );
}

export default HomePage;
