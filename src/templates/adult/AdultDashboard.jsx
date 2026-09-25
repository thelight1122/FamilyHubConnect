import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/routes';
import { dashboardQuickActions } from '../../data/selectors';
import useAuth from '../../context/useAuth';
import useFamilyCore from '../../hooks/useFamilyCore';

export default function AdultDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { family, chores, rewards } = useFamilyCore();
  const [showNotifications, setShowNotifications] = useState(false);

  const user = currentUser || { name: 'Adult', avatar: '' };
  const activeChores = chores.filter((chore) => !chore.completed_at).length;

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface-0 text-slate-900 min-h-screen flex flex-col font-display">
      {/* Header */}
      <header className="glass-header px-6 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border-2 border-primary overflow-hidden shadow-sm">
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-black text-primary">
                {user.name?.slice(0, 1).toUpperCase() || 'A'}
              </div>
            </div>
            <div>
              <p className="text-primary font-bold text-[10px] uppercase tracking-widest leading-none mb-1">HQ Command</p>
              <h1 className="text-xl font-black leading-tight text-slate-900">Hi, {user.name}</h1>
              <p className="text-slate-500 text-[11px] font-bold">{todayDate}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-3 rounded-2xl bg-white shadow-atmospheric text-slate-600 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px] font-light">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8 overflow-y-auto pb-28 animate-fade-in">
        
        {/* Priority Actions */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-extrabold text-slate-900 tracking-tight">Review & Manage</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => navigate(paths.finance)}
              className="bg-gradient-to-br from-rose-500 to-rose-600 p-5 rounded-[2rem] text-white shadow-lifted shadow-rose-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-3 backdrop-blur-md">
                  <span className="material-symbols-outlined text-sm filled-icon">gavel</span>
                </div>
                <h3 className="text-lg font-black leading-tight">{activeChores}<br/>Open Chores</h3>
                <p className="text-[10px] font-black tracking-widest mt-4 opacity-80 uppercase">Live Family Data</p>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-20 blur-[1px]">
                <span className="material-symbols-outlined text-9xl">reviews</span>
              </div>
            </div>

            <div 
              onClick={() => navigate(paths.finance)}
              className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-[2rem] text-white shadow-lifted shadow-indigo-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-3 backdrop-blur-md">
                  <span className="material-symbols-outlined text-sm filled-icon">account_balance</span>
                </div>
                <h3 className="text-lg font-black leading-tight">Reward<br/>Catalog</h3>
                <p className="text-[10px] font-black tracking-widest mt-4 opacity-80 uppercase">{rewards.length} Live Rewards</p>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-20 blur-[1px]">
                <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
              </div>
            </div>
          </div>
        </section>

        {/* Family Timeline */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-extrabold text-slate-900 tracking-tight">Family Activity</h2>
            <button onClick={() => navigate(paths.moreTimeline)} className="text-primary text-[11px] font-black uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-atmospheric">
            <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
              <span className="material-symbols-outlined text-3xl text-slate-300">timeline</span>
              <h3 className="mt-2 font-bold text-slate-800">No live activity recorded</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {family ? 'Family activity will appear after chores, rewards, and reflections are entered.' : 'Create your test family to begin recording activity.'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="font-bold text-lg mb-4 px-1">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {dashboardQuickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path || '#')}
                className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
              >
                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group-hover:shadow-md transition-all ${action.color}`}>
                  <span className="material-symbols-outlined text-[26px]">{action.icon}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight px-1">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Governance / Family Constitution */}
        <section>
          <div 
            onClick={() => navigate(paths.moreConstitution)}
            className="flex items-center justify-between bg-violet-50 dark:bg-violet-500/10 p-4 rounded-2xl border border-violet-100 dark:border-violet-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center text-violet-600 dark:text-violet-400">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px]">Family Constitution</h3>
                <p className="text-xs text-slate-500 font-medium">Review core values & rules</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </section>

      </main>

      {/* Notifications Overlay */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-[60] flex flex-col justify-end"
          onClick={() => setShowNotifications(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
          <div
            className="relative bg-white dark:bg-slate-900 w-full rounded-t-[2rem] shadow-2xl p-6 pb-auto translate-y-0 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="bg-slate-100 dark:bg-slate-800 size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="space-y-4 mb-8">
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
                <span className="material-symbols-outlined text-3xl text-slate-300">notifications</span>
                <p className="mt-2 text-sm font-semibold text-slate-600">No live notifications yet</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
