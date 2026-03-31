import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { paths } from '../config/routes';

export default function DashboardPage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) return; // Wait for role to be available

    const target = role === 'adult' ? paths.adultDashboard : paths.childDashboard;
    
    // Only navigate if we aren't already at the target to avoid loop triggers
    if (window.location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [role, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="animate-pulse text-slate-500 font-medium">Loading your hub...</div>
    </div>
  );
}
