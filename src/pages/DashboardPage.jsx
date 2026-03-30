import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { paths } from '../config/routes';

export default function DashboardPage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'adult') {
      navigate(paths.adultDashboard, { replace: true });
    } else {
      navigate(paths.childDashboard, { replace: true });
    }
  }, [role, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="animate-pulse text-slate-500 font-medium">Loading your hub...</div>
    </div>
  );
}
