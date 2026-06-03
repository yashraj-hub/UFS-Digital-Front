import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "../services/adminApi";

function ProtectedAdminRoute() {
  const location = useLocation();

  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
