import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { adminApi } from "../services/adminApi";

const overviewCards = [
  { label: "Blogs", area: "blogs", href: "/admin/blogs", icon: "fa-newspaper", load: () => adminApi.list("blogs") },
  { label: "Team Members", area: "team-members", href: "/admin/team", icon: "fa-users", load: () => adminApi.list("team-members") },
  { label: "Partners", area: "partners", href: "/admin/partners", icon: "fa-handshake", load: () => adminApi.list("partners") },
  { label: "Contact Messages", area: "contact-submissions", href: "/admin/contact", icon: "fa-inbox", load: () => adminApi.list("contact-submissions") },
  { label: "BC Agent Leads", area: "bc-agent-applications", href: "/admin/bc-agents", icon: "fa-id-card", load: () => adminApi.list("bc-agent-applications") },
  { label: "Admin Users", area: "admin-users", href: "/admin/users", icon: "fa-user-shield", load: () => adminApi.listUsers() },
  { label: "Roles", area: "roles", href: "/admin/users", icon: "fa-key", load: () => adminApi.listRoles() },
];

function AdminOverviewPage() {
  const { can } = useOutletContext();
  const [counts, setCounts] = useState({});
  const [error, setError] = useState("");
  const visibleCards = overviewCards.filter((card) => can(card.area, "view"));

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      visibleCards.map((card) =>
        card.load().then((rows) => [card.area, rows.length])
      )
    )
      .then((entries) => {
        if (isMounted) {
          setCounts(Object.fromEntries(entries));
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [visibleCards.map((card) => card.area).join("|")]);

  if (!can("dashboard", "view")) {
    return <p className="admin-error">You do not have permission to view the admin overview.</p>;
  }

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <p className="admin-kicker">Overview</p>
          <h2 style={{color:'#fff'}}>Content Operations</h2>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-stats-grid">
        {visibleCards.map((card) => (
          <Link key={card.area} to={card.href} className="admin-stat-card">
            <i className={`fa-solid ${card.icon}`} aria-hidden="true" />
            <span>{card.label}</span>
            <strong>{counts[card.area] ?? "-"}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default AdminOverviewPage;
