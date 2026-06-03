import { useEffect, useState } from "react";
import Seo from "../../components/Seo/Seo";
import PageHero from "../../components/PageHero/PageHero";
import PageIntro from "../../components/PageIntro/PageIntro";
import { pageSeo } from "../../seo/siteMeta";
import "./TeamPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const placeholderTeam = [
  {
    name: "Rajesh Kumar",
    role: "Chief Executive Officer",
    experience_years: 15,
    initials: "RK",
  },
  {
    name: "Priya Sharma",
    role: "Chief Technology Officer",
    experience_years: 12,
    initials: "PS",
  },
  {
    name: "Amit Verma",
    role: "Head of Operations",
    experience_years: 10,
    initials: "AV",
  },
  {
    name: "Sunita Patel",
    role: "Head of BC Network",
    experience_years: 11,
    initials: "SP",
  },
  {
    name: "Deepa Nair",
    role: "Head of Marketing",
    experience_years: 9,
    initials: "DN",
  },
];

function TeamPage() {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/team-members`)
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => {
        if (!response.ok) {
          throw new Error(payload.message || payload.error || "Unable to load team members");
        }

        if (isMounted) {
          setTeam(payload.data || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTeam(placeholderTeam);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const teamMembers = team.length
    ? team.map((member) => ({
        ...member,
        initials: member.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2),
      }))
    : placeholderTeam;

  return (
    <div className="team-page">
      <Seo {...pageSeo.team} />
      <PageHero imageUrl="https://images.pexels.com/photos/14352326/pexels-photo-14352326.jpeg" />
      <PageIntro
        eyebrow="Our Team"
        headingAs="h1"
        heading="The people driving financial inclusion across India"
        paragraphs={[
          "UFS Digital is built by a team of passionate professionals who believe that access to financial services is a right, not a privilege. Our people bring together expertise in banking, technology, operations and community outreach.",
          "Together, we work to ensure that every BC agent, every customer, and every partner receives the support and trust they deserve.",
        ]}
      />

      <div className="content-wrap team-grid-wrap">
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-card__hero">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="team-card__heroImage"
                  />
                ) : (
                  <div className="team-card__heroAvatar" aria-hidden="true">
                    <span>{member.initials}</span>
                  </div>
                )}
                {member.linkedin_url ? (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${member.name} LinkedIn`}
                    className="team-card__linkedin-btn"
                  >
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                ) : null}
                <div className="team-card__footer">
                  <div className="team-card__details">
                    <h3 className="team-card__name">{member.name}</h3>
                    <p className="team-card__role">{member.role}</p>
                  </div>
                  <div className="team-card__badge">
                    {typeof member.experience_years !== "undefined" && member.experience_years !== null ? (
                      <>
                        <div className="team-card__badge-icon">
                          <i className="fa-solid fa-award" />
                        </div>
                        <div className="team-card__badge-info">
                          <span className="team-card__badge-number">{member.experience_years}</span>
                          <span className="team-card__badge-text">YRS EXP</span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
