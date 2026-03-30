import { useLocation, Outlet } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { childNavTabs } from '../../config/routes';

export default function ChildLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative flex flex-col min-h-dvh w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-colors">
      <main
        key={pathname}
        className="flex-1 overflow-y-auto pb-16 scrollbar-hide bg-slate-50 dark:bg-slate-950"
        style={{ animation: 'page-fade-in 0.15s ease-out' }}
      >
        <Outlet />
      </main>
      <BottomNav tabs={childNavTabs} />
    </div>
  );
}
