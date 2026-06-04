import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { adminApi } from "../services/adminApi";
import "./AdminActivityPage.css";

const ACTION_LABELS = {
  create: { label: "Created", cls: "activity-badge--create" },
  update: { label: "Updated", cls: "activity-badge--update" },
  delete: { label: "Deleted", cls: "activity-badge--delete" },
  login: { label: "Login", cls: "activity-badge--login" },
  change_password: { label: "Password", cls: "activity-badge--password" },
};

const RESOURCE_LABELS = {
  blogs: "Blog",
  "blog-categories": "Blog Category",
  "team-members": "Team Member",
  partners: "Partner",
  "contact-submissions": "Contact",
  "bc-agent-applications": "BC Agent",
  jobs: "Job",
  "job-applications": "Job Application",
  "admin-users": "Admin User",
  roles: "Role",
  auth: "Auth",
};

const LIMIT = 30;

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function AdminActivityPage() {
  const { session } = useOutletContext();
  const isPrivileged = ["super_admin", "admin"].includes(session?.admin?.role);

  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    action: "", resource: "", user_id: "", date_from: "", date_to: "",
  });

  // track if filters changed (not just page) to re-fetch count
  const prevFilters = useRef(filters);

  useEffect(() => {
    if (isPrivileged && session?.admin?.id) {
      setFilters((prev) => ({ ...prev, user_id: String(session.admin.id) }));
    }
  }, [isPrivileged, session?.admin?.id]);

  useEffect(() => {
    if (isPrivileged) adminApi.listUsers().then(setUsers).catch(() => {});
  }, [isPrivileged]);

  const buildParams = useCallback((extraParams = {}) => {
    const p = { limit: LIMIT, ...extraParams };
    if (filters.action)    p.action    = filters.action;
    if (filters.resource)  p.resource  = filters.resource;
    if (filters.user_id)   p.user_id   = filters.user_id;
    if (filters.date_from) p.date_from = filters.date_from;
    if (filters.date_to)   p.date_to   = filters.date_to;
    return p;
  }, [filters]);

  // fetch logs + optionally count
  const fetchLogs = useCallback(async (currentPage, fetchCount) => {
    setLoading(true);
    setError("");
    try {
      const offset = (currentPage - 1) * LIMIT;
      const logsPromise = adminApi.getActivityLogs(buildParams({ page: currentPage, offset }));
      const countPromise = fetchCount
        ? adminApi.getActivityLogs(buildParams({ count_only: "1" }))
        : Promise.resolve(null);

      const [logsRes, countRes] = await Promise.all([logsPromise, countPromise]);
      setLogs(logsRes.logs ?? []);
      if (countRes !== null) setTotal(countRes.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    const filtersChanged = JSON.stringify(prevFilters.current) !== JSON.stringify(filters);
    prevFilters.current = filters;
    if (filtersChanged) {
      setPage(1);
      fetchLogs(1, true);  // re-fetch count only when filters change
    } else {
      fetchLogs(page, false); // page change — no count re-fetch
    }
  }, [filters, page, fetchLogs]);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearDates() {
    setFilters((prev) => ({ ...prev, date_from: "", date_to: "" }));
  }

  const pages = Math.ceil(total / LIMIT);

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <p className="admin-kicker">Admin Panel</p>
          <h2 style={{ color: "#fff" }}>Activity History</h2>
        </div>
      </div>

      <div className="activity-toolbar">
        <span className="admin-result-count">{total} activities</span>
        <div className="activity-filters">

          {isPrivileged && users.length > 0 && (
            <select
              className="activity-filter-select"
              value={filters.user_id}
              onChange={(e) => setFilter("user_id", e.target.value)}
            >
              <option value="">All Users</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role_name})</option>
              ))}
            </select>
          )}

          <select
            className="activity-filter-select"
            value={filters.action}
            onChange={(e) => setFilter("action", e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
            <option value="login">Login</option>
            <option value="change_password">Password Changed</option>
          </select>

          <select
            className="activity-filter-select"
            value={filters.resource}
            onChange={(e) => setFilter("resource", e.target.value)}
          >
            <option value="">All Resources</option>
            {Object.entries(RESOURCE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <div className="activity-daterange">
            <input
              type="date"
              className="activity-date-input"
              value={filters.date_from}
              max={filters.date_to || todayStr()}
              onChange={(e) => setFilter("date_from", e.target.value)}
              title="From date"
            />
            <span className="activity-daterange__sep">–</span>
            <input
              type="date"
              className="activity-date-input"
              value={filters.date_to}
              min={filters.date_from}
              max={todayStr()}
              onChange={(e) => setFilter("date_to", e.target.value)}
              title="To date"
            />
            {(filters.date_from || filters.date_to) && (
              <button className="activity-date-clear" onClick={clearDates} title="Clear dates">
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-panel">
        <div className="admin-table-wrap">
          <table className="admin-table activity-table">
            <thead>
              <tr>
                <th>#</th>
                {isPrivileged && <th>User</th>}
                <th>Action</th>
                <th>Resource</th>
                <th>Description</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={isPrivileged ? 6 : 5} className="activity-state">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={isPrivileged ? 6 : 5} className="activity-state">No activity found.</td></tr>
              ) : (
                logs.map((log, i) => {
                  const action = ACTION_LABELS[log.action] || { label: log.action, cls: "" };
                  return (
                    <tr key={log.id}>
                      <td className="admin-table__serial">{(page - 1) * LIMIT + i + 1}</td>
                      {isPrivileged && (
                        <td>
                          <div className="activity-user">
                            <span className="activity-user__name">{log.user_name}</span>
                            <span className="activity-user__role">{log.user_role}</span>
                          </div>
                        </td>
                      )}
                      <td><span className={`activity-badge ${action.cls}`}>{action.label}</span></td>
                      <td>{RESOURCE_LABELS[log.resource] || log.resource}</td>
                      <td className="activity-desc">{log.description}</td>
                      <td className="activity-date">{formatDate(log.created_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="activity-pagination">
            <button className="activity-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <i className="fa-solid fa-chevron-left" />
            </button>
            <span>Page {page} of {pages}</span>
            <button className="activity-page-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminActivityPage;
