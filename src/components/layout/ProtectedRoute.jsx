import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * ProtectedRoute — guards routes based on auth state, profile completion, and role.
 *
 * Props:
 *   role: 'student' | 'professional' | 'admin' — if provided, enforces role match.
 *
 * Flow:
 *   1. Not authenticated → redirect to /auth/login
 *   2. Admin route → check adminToken (Express JWT)
 *   3. Profile incomplete → redirect to /complete-profile
 *   4. Wrong role → redirect to their own dashboard
 */
export default function ProtectedRoute({ requireRole, requireAuth, requireProfile, children }) {
  const location = useLocation();
  const { isAuthenticated, isProfileCompleted, user, isAdminAuthenticated } = useAuthStore();

  // ---- Admin guard ----
  if (requireRole === 'admin') {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children ? children : <Outlet />;
  }

  // ---- Regular auth guard ----
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Profile completion gate
  if (requireProfile && !isProfileCompleted && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  // Role gate — redirect to user's own dashboard
  if (requireRole && user?.role !== requireRole) {
    const dashboardMap = {
      student: '/student/dashboard',
      professional: '/professional/dashboard',
    };
    return <Navigate to={dashboardMap[user?.role] ?? '/'} replace />;
  }

  return children ? children : <Outlet />;
}
