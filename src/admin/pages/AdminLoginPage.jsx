import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { adminApi, getAdminToken, setAdminToken } from "../services/adminApi";
import logoWhite from "../../pages/Home/UFS DIGITAL NEW LOGO FINAL) WHITE.png";
import "../admin.css";

const ADMIN_HERO_VIDEO = "https://www.pexels.com/download/video/9341428/";

function AdminLoginPage() {
  const [email, setEmail] = useState("admin@ufsdigital.one");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/admin";

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await adminApi.login({ email, password });
      setAdminToken(result.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__video-wrap" aria-hidden="true">
        <video
          className="admin-login__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={ADMIN_HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="admin-login__video-overlay" />
      </div>

      <section className="admin-login__panel" aria-label="Admin login">
        <div className="admin-login__brand admin-login__brand--logo-only">
          <img src={logoWhite} alt="UFS Digital" className="admin-login__logo" />
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit} autoComplete="off">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <div className="admin-login__field-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-login__toggle-password"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <button type="submit" className="admin-primary-btn" disabled={isSubmitting}>
            <i className="fa-solid fa-lock" aria-hidden="true" />
            <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;
