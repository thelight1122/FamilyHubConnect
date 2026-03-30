import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/routes';
import { currentMember, dashboardQuickActions } from '../../data/selectors';

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: 'gavel', color: 'text-primary', bg: 'bg-primary/10', text: 'Leo submitted a pitch — pending review.', ago: '2h ago' },
  { id: 2, icon: 'star', color: 'text-amber-500', bg: 'bg-amber-50', text: 'Emma completed "Clean Room" and earned 50 pts!', ago: '4h ago' },
];

const MOCK_TIMELINE = [
  { id: 101, title: 'Emma reached a savings goal!', time: 'Today, 10:30 AM', icon: 'savings', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-500/10' },
  { id: 102, title: 'Leo submitted a loan pitch', time: 'Yesterday', icon: 'request_quote', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/10' },
  { id: 103, title: 'Family Court ticket dismissed', time: 'Tuesday', icon: 'gavel', color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-500/10' },
];

export default function AdultDashboard() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 pt-10 pb-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border-2 border-primary overflow-hidden shadow-sm">
              <img
                className="w-full h-full object-cover"
                alt={currentMember.name}
                src={currentMember.avatar || 'https://i.pravatar.cc/150'}
              />
            </div>
            <div>
              <p className="text-primary font-bold text-[10px] uppercase tracking-wider">Family Command</p>
              <h1 className="text-xl font-black leading-tight">Good Morning, {currentMember.name}!</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{todayDate}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined font-light">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8 overflow-y-auto pb-28 animate-fade-in">
        
        {/* Priority Actions */}
        <section>
          <h2 className="font-bold text-lg mb-4 px-1">Review & Manage</h2>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => navigate(paths.finance)}
              className="bg-gradient-to-br from-rose-500 to-orange-500 p-5 rounded-2xl text-white shadow-md shadow-orange-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">assignment_late</span>
                </div>
                <h3 className="text-lg font-black leading-tight">2 Pitches<br/>Pending</h3>
                <p className="text-[10px] font-bold tracking-wider mt-3 opacity-80 uppercase">Tap to Review</p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 blur-[2px]">
                <span className="material-symbols-outlined text-8xl">clinical_notes</span>
              </div>
            </div>

            <div 
              onClick={() => navigate(paths.finance)}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-2xl text-white shadow-md shadow-indigo-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">account_balance</span>
                </div>
                <h3 className="text-lg font-black leading-tight">Family<br/>Vault</h3>
                <p className="text-[10px] font-bold tracking-wider mt-3 opacity-80 uppercase">$1,250 Available</p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 blur-[2px]">
                <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
              </div>
            </div>
          </div>
        </section>

        {/* Family Timeline */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-bold text-lg">Family Activity</h2>
            <button className="text-primary text-[11px] font-bold uppercase tracking-wider hover:underline">View All</button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-6">
              {MOCK_TIMELINE.map((item) => (
                <div key={item.id} className="relative pl-6">
                  <div className={`absolute -left-[1.125rem] bg-white dark:bg-slate-900 p-1 rounded-full`}>
                    <div className={`size-6 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                      <span className="material-symbols-outlined text-[12px]">{item.icon}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[14px] text-slate-800 dark:text-slate-100 leading-snug">{item.title}</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
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
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl ${n.bg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-xl ${n.color}`}>{n.icon}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mt-1.5">{n.ago}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
