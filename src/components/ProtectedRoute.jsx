import { Navigate, useLocation } from 'react-router-dom';
import { paths } from '../config/routes';
import useAuth from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  return children;
}
