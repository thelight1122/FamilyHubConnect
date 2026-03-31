import { Navigate, useLocation } from 'react-router-dom';
import { paths } from '../config/routes';
import useAuth from '../context/useAuth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If role is null (initial load/race condition), don't redirect yet
    if (role === null) return null; 

    // Redirect unauthorized users gracefully to their allowed dashboard
    // Use a hard-coded check or redirect to login if role is invalid
    return <Navigate to={role === 'adult' ? paths.adultDashboard : paths.childDashboard} replace />;
  }

  return children;
}
