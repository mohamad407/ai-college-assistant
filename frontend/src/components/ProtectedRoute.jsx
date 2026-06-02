import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import Loading from '@components/common/Loading';

/**
 * Wraps any route that requires authentication.
 * – Shows a full-page loader while auth is hydrating.
 * – Redirects to /login (with return path) if not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated      = useAuthStore((s) => s.isHydrated);
  const location        = useLocation();

  if (!isHydrated) {
    return <Loading variant="page" label="Authenticating…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
