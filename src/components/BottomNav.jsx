import { useNavigate, useLocation } from 'react-router-dom';
import { bottomNavTabs } from '../config/routes';

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 z-50">
      <div className="flex">
        {bottomNavTabs.map((tab) => {
          const active = pathname.startsWith(tab.match);
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 transition-colors relative ${
                active ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <span className="relative inline-flex">
                <span className="material-symbols-outlined text-[24px]">{tab.icon}</span>
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
