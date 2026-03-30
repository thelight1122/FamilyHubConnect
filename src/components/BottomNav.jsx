import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav({ tabs = [] }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-2 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center w-full">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.match) || (pathname === '/' && tab.match === '/dashboard');
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                active ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'
              }`}
            >
              <span className="relative inline-flex">
                <span className={`material-symbols-outlined text-[24px] ${active ? 'filled-icon' : ''}`}>{tab.icon}</span>
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {tab.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer for mobile */}
      <div className="h-2" />
    </nav>
  );
}
