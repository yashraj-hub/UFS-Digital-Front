import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/Home/HomePage";
import EntrepreneursPage from "./pages/Entrepreneurs/EntrepreneursPage";
import ServicesPage from "./pages/Services/ServicesPage";
import BlogPage from "./pages/Blog/BlogPage";
import BlogPostPage from "./pages/Blog/BlogPostPage";
import TeamPage from "./pages/Team/TeamPage";
import ContactPage from "./pages/Contact/ContactPage";
import BecomeAgentPage from "./pages/BecomeAgent/BecomeAgentPage";
import CareersPage from "./pages/Careers/CareersPage";
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminOverviewPage from "./admin/pages/AdminOverviewPage";
import AdminResourcePage from "./admin/pages/AdminResourcePage";
import AdminUsersPage from "./admin/pages/AdminUsersPage";
import AdminActivityPage from "./admin/pages/AdminActivityPage";

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="blogs" element={<AdminResourcePage resourceKey="blogs" />} />
          <Route path="team" element={<AdminResourcePage resourceKey="team-members" />} />
          <Route path="partners" element={<AdminResourcePage resourceKey="partners" />} />
          <Route path="contact" element={<AdminResourcePage resourceKey="contact-submissions" />} />
          <Route path="careers" element={<AdminResourcePage resourceKey="jobs" />} />
          <Route path="job-applications" element={<AdminResourcePage resourceKey="job-applications" />} />
          <Route path="bc-agents" element={<AdminResourcePage resourceKey="bc-agent-applications" />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="activity" element={<AdminActivityPage />} />
          <Route path="roles" element={<Navigate to="/admin/users" replace />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/entrepreneurs" element={<EntrepreneursPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/become-agent" element={<BecomeAgentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
