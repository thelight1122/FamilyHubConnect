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
    // Redirect unauthorized users gracefully to their allowed dashboard
    return <Navigate to={paths.dashboard} replace />;
  }

  return children;
}
