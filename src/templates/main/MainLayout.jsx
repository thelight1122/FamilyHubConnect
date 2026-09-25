import { Suspense } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import PageLoading from '../../components/PageLoading';
import { adultNavTabs, childNavTabs } from '../../config/routes';
import useAuth from '../../context/useAuth';

export default function MainLayout() {
  const { pathname } = useLocation();
  const { role } = useAuth();
  
  const currentTabs = role === 'adult' ? adultNavTabs : childNavTabs;

  return (
    <div className="relative flex flex-col min-h-dvh w-full max-w-md mx-auto bg-surface-0 shadow-lifted overflow-hidden transition-colors">
      <main
        key={pathname}
        className="flex-1 overflow-y-auto pb-32 scrollbar-hide"
        style={{ animation: 'page-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Keeps the bottom nav in place while a page's code loads. */}
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav tabs={currentTabs} />
    </div>
  );
}
