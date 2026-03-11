import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative flex flex-col min-h-dvh w-full max-w-md mx-auto bg-white shadow-xl overflow-hidden">
      <main
        key={pathname}
        className="flex-1 overflow-y-auto pb-16 scrollbar-hide"
        style={{ animation: 'page-fade-in 0.15s ease-out' }}
      >
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
