import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../config/routes';
import { currentMember, dashboardQuickActions, dashboardSchedule, familyName } from '../data/selectors';

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: 'gavel', color: 'text-primary', bg: 'bg-primary/10', text: 'Leo submitted an appeal — pending your review.', ago: '2h ago' },
  { id: 2, icon: 'star', color: 'text-amber-500', bg: 'bg-amber-50', text: 'Emma completed "Clean Room" and earned 50 pts!', ago: '4h ago' },
  { id: 3, icon: 'sports_soccer', color: 'text-green-600', bg: 'bg-green-50', text: 'Practice rescheduled to Friday 4 PM.', ago: '1d ago' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Helper for today's date formatted
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-900 px-6 pt-8 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border-2 border-primary overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt={currentMember.name}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJLjl6Ef7bK-u_B2NcS7dt7erjVSdao2IuOgK27fYvgiRYQ1c6TSjOn2sdLMrDArlKAERFzjINx7uZP06Noe9OuWk9booq3wx_Ryr2CnXiJmlGeFfkTTvbnQ2nyIl1AS87YfbZI6bo_EWwXAAb_y-FPf38D3Wjt2L_CCENy3dwziFH1GbRkcUEW70bREGv3h0R9w_7URV-lb-elowFiRVjBwBTZCHCe2qrwSOOSwX374fPBHyuCHdlgpBTKVSwwDgPaoq16c8oURM"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Good Morning, {currentMember.name}!</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{todayDate}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto pb-24">
        {/* Schedule */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Today's Schedule</h2>
            <button className="text-primary text-sm font-semibold hover:underline">See All</button>
          </div>
          <div className="space-y-3">
            {dashboardSchedule.slice(0, 2).map((item, idx) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className={`size-10 rounded-lg flex items-center justify-center ${item.color.replace('bg-', 'bg-').replace('100', '100')}`}>
                  {/* Using basic color inference for icon text based on bg color */}
                  <span className={`material-symbols-outlined ${item.color.replace('bg-', 'text-').replace('-100', '-500')}`}>
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
                {idx === 0 && (
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">TODAY</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Chores Progress */}
        <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="font-bold text-lg">My Chores</h2>
            <span className="text-sm font-medium text-primary">2/4 Done</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-6 relative z-10">
            <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
          <ul className="space-y-4 relative z-10">
            <li className="flex items-center gap-3">
              <div className="size-6 rounded-md border-2 border-primary bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-sm text-slate-400 line-through">Walk the dog</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-6 rounded-md border-2 border-primary bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-sm text-slate-400 line-through">Make bed</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-6 rounded-md border-2 border-slate-300 dark:border-slate-600"></div>
              <span className="text-sm font-medium">Feed the Dog</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-6 rounded-md border-2 border-slate-300 dark:border-slate-600"></div>
              <span className="text-sm font-medium">Fold Laundry</span>
            </li>
          </ul>
        </section>

        {/* Financials Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => navigate(paths.finance)}
            className="bg-primary p-5 rounded-xl text-white shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="relative z-10">
              <p className="text-xs opacity-80 mb-1">Total Balance</p>
              <h3 className="text-2xl font-bold">{currentMember.points}</h3>
              <p className="text-[10px] font-medium tracking-wider mt-2">POINTS EARNED</p>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-20">
              <span className="material-symbols-outlined text-6xl">payments</span>
            </div>
          </div>
          <div 
            onClick={() => navigate(paths.finance)}
            className="bg-amber-100 dark:bg-amber-900/30 p-5 rounded-xl border border-amber-200 dark:border-amber-800/50 cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">Allowance</p>
            <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200">${currentMember.allowance}.00</h3>
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 mt-2 uppercase">Next payout: Sat</p>
          </div>
        </section>

        {/* Shout Outs */}
        <section>
          <h2 className="font-bold text-lg mb-3">Shout-Outs</h2>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 border-primary shadow-sm">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shrink-0">
                <span className="material-symbols-outlined">favorite</span>
              </div>
              <div>
                <p className="text-sm italic text-slate-700 dark:text-slate-300">"Great job on your math test, {currentMember.name}! I'm so proud of how hard you studied."</p>
                <p className="text-xs font-bold mt-2 text-primary">— Mom</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Quick Actions Restored since it's functional */}
        <section>
          <h2 className="font-bold text-lg mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {dashboardQuickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color}`}>
                  <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{action.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Notifications overlay */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-[60] flex flex-col justify-start"
          onClick={() => setShowNotifications(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-slate-900 w-full max-w-md mx-auto rounded-b-[2rem] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl ${n.bg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-base ${n.color}`}>{n.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1">{n.ago}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowNotifications(false)}
              className="w-full mt-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
