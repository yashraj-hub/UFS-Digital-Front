import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken, adminApi } from "../services/adminApi";
import { getPermissionMap } from "../permissions";
import ufsLogoWhite from "./favicon.png";
import "../admin.css";

const navItems = [
  {
    to: "/admin",
    label: "Overview",
    icon: "fa-chart-line",
    area: "dashboard",
    end: true,
  },
  { to: "/admin/blogs", label: "Blogs", icon: "fa-newspaper", area: "blogs", altAreas: ["blog-categories"] },
  { to: "/admin/team", label: "Team", icon: "fa-users", area: "team-members" },
  {
    to: "/admin/partners",
    label: "Partners",
    icon: "fa-handshake",
    area: "partners",
  },
  {
    to: "/admin/contact",
    label: "Contact",
    icon: "fa-inbox",
    area: "contact-submissions",
  },
  {
    to: "/admin/bc-agents",
    label: "BC Agents",
    icon: "fa-id-card",
    area: "bc-agent-applications",
  },
  {
    to: "/admin/users",
    label: "Users & Roles",
    icon: "fa-user-shield",
    area: "admin-users",
    altAreas: ["roles"],
  },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    adminApi
      .me()
      .then((data) => {
        if (isMounted) {
          setSession(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }

        if (err.status === 401) {
          clearAdminToken();
          navigate("/admin/login", { replace: true });
          return;
        }

        setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const permissionMap = useMemo(
    () => getPermissionMap(session?.permissions || []),
    [session],
  );

  const can = (area, action = "view") => {
    if (session?.admin?.role === "super_admin") {
      return true;
    }

    return Boolean(permissionMap[area]?.[`can_${action}`]);
  };

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  const handleProfileToggle = () => {
    setIsProfileOpen((current) => !current);
    setProfileMessage("");
    setProfileError("");
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
    setProfileMessage("");
    setProfileError("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    if (!profileMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsProfileOpen(false);
      setProfileMessage("");
      setProfileError("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [profileMessage]);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    if (!oldPassword || !newPassword) {
      setProfileError("Current password and new password are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }

    setProfileLoading(true);

    try {
      await adminApi.changePassword(oldPassword, newPassword, confirmPassword);
      setProfileMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setProfileError(err.message || "Unable to update password.");
    } finally {
      setProfileLoading(false);
    }
  };

  const visibleNavItems = navItems.filter(
    (item) =>
      can(item.area, "view") ||
      item.altAreas?.some((area) => can(area, "view")),
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div
          style={{ cursor: "pointer"}}
          onClick={handleProfileToggle}
          className="admin-brand"
        >
          <button
            type="button"
            className="admin-brand__logo-btn"
            aria-label="Open profile"
          >
            <img src={ufsLogoWhite} alt="UFS logo" />
          </button>
          <span>
            <strong>UFS Admin</strong>
            <small>
              {session
                ? session.admin?.name || session.name || "Admin User"
                : "Content desk"}
            </small>
          </span>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "admin-nav__link admin-nav__link--active"
                  : "admin-nav__link"
              }
            >
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-actions">
          <a
            href="/"
            className="admin-site-link admin-site-link--sidebar admin-site-link--icon"
            target="_blank"
            rel="noreferrer"
            aria-label="View Site"
            style={{ border:'none' }}
          >
            <i
              className="fa-solid fa-arrow-up-right-from-square"
              aria-hidden="true"
            />
          </a>

          <button
            type="button"
            className="admin-logout admin-logout--sidebar"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {isProfileOpen ? (
          <div
            className="admin-profile-dialog-overlay"
            onClick={handleProfileClose}
          >
            <div
              className="admin-profile-dialog"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-profile-dialog__header">
                <strong>User profile</strong>
                <button
                  type="button"
                  className="admin-profile-dialog__close"
                  onClick={handleProfileClose}
                  aria-label="Close profile window"
                >
                  ×
                </button>
              </div>

              <div className="admin-profile-dialog__section">
                <div className="admin-profile-dialog__label">Name</div>
                <div className="admin-profile-dialog__value">
                  {session?.admin?.name || session?.name || "Admin User"}
                </div>
              </div>
              <div className="admin-profile-dialog__section">
                <div className="admin-profile-dialog__label">Email</div>
                <div className="admin-profile-dialog__value">
                  {session?.admin?.email ||
                    session?.email ||
                    "No email available"}
                </div>
              </div>

              <form
                className="admin-profile-dialog__form"
                onSubmit={handleChangePassword}
              >
                <div className="admin-profile-dialog__form-group">
                  <label
                    className="admin-profile-dialog__label"
                    htmlFor="current-password"
                  >
                    Current password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={oldPassword}
                    className="admin-profile-dialog__input"
                    onChange={(event) => setOldPassword(event.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="admin-profile-dialog__form-group">
                  <label
                    className="admin-profile-dialog__label"
                    htmlFor="new-password"
                  >
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    className="admin-profile-dialog__input"
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="admin-profile-dialog__form-group">
                  <label
                    className="admin-profile-dialog__label"
                    htmlFor="confirm-password"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    className="admin-profile-dialog__input"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                {profileError ? (
                  <p className="admin-profile-dialog__message admin-profile-dialog__message--error">
                    {profileError}
                  </p>
                ) : null}
                {profileMessage ? (
                  <p className="admin-profile-dialog__message admin-profile-dialog__message--success">
                    {profileMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="admin-profile-dialog__button"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Change password"}
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <main className="admin-content">
          {error ? <p className="admin-error">{error}</p> : null}
          {!session && !error ? (
            <p className="admin-empty-state">Loading admin session...</p>
          ) : (
            <Outlet context={{ session, can }} />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
