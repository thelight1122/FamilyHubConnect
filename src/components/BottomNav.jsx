import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav({ tabs = [] }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="glass-nav max-w-md mx-auto px-4 pb-8 pt-3">
      <div className="flex justify-around items-center w-full">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.match) || (pathname === '/' && tab.match === '/dashboard');
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1.5 transition-all relative active:scale-90 ${
                active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`relative flex items-center justify-center size-10 rounded-2xl transition-all ${active ? 'bg-primary/10 shadow-sm' : ''}`}>
                <span className={`material-symbols-outlined text-[26px] ${active ? 'filled-icon' : 'font-light'}`}>{tab.icon}</span>
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5 leading-none border-2 border-white dark:border-slate-900 shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-wider uppercase ${active ? 'opacity-100' : 'opacity-40'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
