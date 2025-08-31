import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicOnly() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (user) {
    const redirectTo = (location.state as any)?.from?.pathname || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}


