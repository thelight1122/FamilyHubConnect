import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Home', icon: 'home', path: '/dashboard', match: '/dashboard' },
  { label: 'Finance', icon: 'account_balance_wallet', path: '/finance', match: '/finance' },
  { label: 'Chores', icon: 'checklist', path: '/chores', match: '/chores' },
  { label: 'Sports', icon: 'sports_soccer', path: '/sports', match: '/sports' },
  { label: 'More', icon: 'grid_view', path: '/more', match: '/more' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.match);
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 transition-colors ${
                active ? 'text-primary' : 'text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">{tab.icon}</span>
              <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer for mobile */}
      <div className="h-safe-b" />
    </nav>
  );
}
