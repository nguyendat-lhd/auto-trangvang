import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth() {
	const { user, loading } = useAuth();
	const location = useLocation();

	// Debug: observe auth state during navigation
	if (typeof window !== "undefined") {
		// eslint-disable-next-line no-console
		console.debug("[RequireAuth] state", { loading, hasUser: !!user, path: location.pathname });
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-gray-600 dark:text-gray-300">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/signin" replace state={{ from: location }} />;
	}

	return <Outlet />;
}


