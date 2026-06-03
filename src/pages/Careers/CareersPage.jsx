import Seo from "../../components/Seo/Seo";
import PageHero from "../../components/PageHero/PageHero";
import PageIntro from "../../components/PageIntro/PageIntro";
import { pageSeo } from "../../seo/siteMeta";
import "./CareersPage.css";

function CareersPage() {
  return (
    <div className="careers-page">
      <Seo {...pageSeo.careers} />
      <PageHero imageUrl="https://images.pexels.com/photos/20988575/pexels-photo-20988575.jpeg" />
      <PageIntro
        eyebrow="Careers"
        headingAs="h1"
        heading="Work with UFS Digital"
        paragraphs={[
          "At UFS Digital, we believe great ideas come from talented people. We are always looking for passionate professionals who are eager to innovate, grow, and make an impact.",
          "UFS Digital offers opportunities to learn, contribute, and thrive in a fast-paced digital environment.",
        ]}
      />
      <section className="careers-page__notice content-wrap">
        <div className="careers-page__notice-inner">
          <p>
            There are no job
            openings at the moment.
          </p>
        </div>
      </section>
    </div>
  );
}

export default CareersPage;
