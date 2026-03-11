import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="relative flex flex-col min-h-dvh w-full max-w-md mx-auto bg-white shadow-xl overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-16 scrollbar-hide">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
