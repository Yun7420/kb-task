import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, authSelector } from "../stores";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(authSelector.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
