import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/routes';
import { dashboardQuickActions } from '../../data/selectors';
import useAuth from '../../context/useAuth';
import useFamilyCore from '../../hooks/useFamilyCore';

export default function ChildDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { chores, family } = useFamilyCore();
  const [showNotifications, setShowNotifications] = useState(false);

  const user = currentUser || { name: 'Family Member', avatar: '', allowance: 0, points: 0 };
  const completedChores = chores.filter((chore) => chore.completed_at).length;
  const totalChores = chores.length;
  const progressPercent = totalChores > 0 ? Math.round((completedChores / totalChores) * 100) : 0;

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface-0 text-slate-900 min-h-screen flex flex-col font-display">
      {/* Header */}
      <header className="glass-header px-6 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border-2 border-primary overflow-hidden shadow-sm">
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-black text-primary">
                {user.name?.slice(0, 1).toUpperCase() || 'F'}
              </div>
            </div>
            <div>
              <p className="text-primary font-bold text-[10px] uppercase tracking-widest leading-none mb-1">My Adventure</p>
              <h1 className="text-xl font-black leading-tight text-slate-900">Hey, {user.name}!</h1>
              <p className="text-slate-500 text-[11px] font-bold">{todayDate}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-3 rounded-2xl bg-white shadow-atmospheric text-slate-600 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[2px] font-light">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8 overflow-y-auto pb-28 animate-fade-in">
        
        {/* Priority Actions */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => navigate(paths.finance)}
              className="bg-gradient-to-br from-orange-400 to-rose-500 p-5 rounded-2xl text-white shadow-md shadow-orange-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">campaign</span>
                </div>
                <h3 className="text-lg font-black leading-tight">Fund<br/>Pitch</h3>
                <p className="text-[10px] font-bold tracking-wider mt-3 opacity-80 uppercase">Request Loan</p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 blur-[2px]">
                <span className="material-symbols-outlined text-8xl">record_voice_over</span>
              </div>
            </div>

            <div 
              onClick={() => navigate(paths.finance)}
              className="bg-gradient-to-br from-blue-500 to-teal-400 p-5 rounded-2xl text-white shadow-md shadow-teal-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                </div>
                <h3 className="text-lg font-black leading-tight">My<br/>Wallet</h3>
                <p className="text-[10px] font-bold tracking-wider mt-3 opacity-80 uppercase">{completedChores} of {totalChores} Done</p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 blur-[2px]">
                <span className="material-symbols-outlined text-8xl">payments</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Chores Progress */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-atmospheric relative overflow-hidden">
          <div className="flex items-center justify-between mb-5 relative z-10">
            <h2 className="font-extrabold text-lg tracking-tight">Today's Chores</h2>
            <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{completedChores}/{totalChores} Done</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full mb-8 relative z-10 overflow-hidden">
            <div className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <ul className="space-y-4 relative z-10">
            {chores.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm font-semibold text-slate-500">
                {family ? 'No chores have been entered yet.' : 'Create your family to begin adding chores.'}
              </li>
            ) : chores.slice(0, 4).map((chore) => (
              <li key={chore.id} className="flex items-center gap-3">
                <div className={`size-6 rounded-md border-2 flex items-center justify-center shadow-sm ${chore.completed_at ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>
                  {chore.completed_at && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <span className={`text-sm ${chore.completed_at ? 'text-slate-400 line-through decoration-2' : 'font-semibold text-slate-700'}`}>{chore.title}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Family Timeline */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-extrabold text-slate-900 tracking-tight">Family Story</h2>
            <button className="text-primary text-[11px] font-black uppercase tracking-widest hover:underline">See More</button>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-atmospheric">
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-7">
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
                <span className="material-symbols-outlined text-3xl text-slate-300">timeline</span>
                <p className="mt-2 text-sm font-semibold text-slate-600">No live family story yet</p>
              </div>
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
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px]">Family Rules</h3>
                <p className="text-xs text-slate-500 font-medium">Read the constitution</p>
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
