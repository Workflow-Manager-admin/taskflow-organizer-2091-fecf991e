import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
/**
 * ProtectedRoute enforces that a user is authenticated for the route.
 * If not authenticated, redirects to login page, saving intended route for redirect after login.
 * Usage: <ProtectedRoute><DashboardPage /></ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * UnAuthRoute enforces that a user is NOT authenticated.
 * If already authenticated, redirects to dashboard (used for login/register screens).
 * Usage: <UnAuthRoute><LoginPage /></UnAuthRoute>
 */
export function UnAuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
