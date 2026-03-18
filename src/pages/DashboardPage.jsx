import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../config/paths';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col">

      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border-2 border-primary overflow-hidden">
              {/* TODO: fetch user data from /api/user */}
              <img
                className="w-full h-full object-cover"
                alt="Family member avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJLjl6Ef7bK-u_B2NcS7dt7erjVSdao2IuOgK27fYvgiRYQ1c6TSjOn2sdLMrDArlKAERFzjINx7uZP06Noe9OuWk9booq3wx_Ryr2CnXiJmlGeFfkTTvbnQ2nyIl1AS87YfbZI6bo_EWwXAAb_y-FPf38D3Wjt2L_CCENy3dwziFH1GbRkcUEW70bREGv3h0R9w_7URV-lb-elowFiRVjBwBTZCHCe2qrwSOOSwX374fPBHyuCHdlgpBTKVSwwDgPaoq16c8oURM"
              />
            </div>
            <div>
              {/* TODO: fetch user data from /api/user */}
              <h1 className="text-xl font-bold leading-tight">Good Morning, Leo!</h1>
              <p className="text-slate-500 text-sm">Monday, October 23rd</p>
            </div>
          </div>
          <button
            className="p-2 rounded-full bg-slate-100 text-slate-600"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto pb-24">

        {/* Today's Schedule */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Today's Schedule</h2>
            <button className="text-primary text-sm font-semibold">See All</button>
          </div>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl flex items-center gap-4 border border-slate-100">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">sports_soccer</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Soccer Practice</p>
                <p className="text-xs text-slate-500">4:00 PM - 5:30 PM</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-full text-slate-500">TODAY</span>
            </div>
            <div className="bg-white p-4 rounded-xl flex items-center gap-4 border border-slate-100">
              <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Math Tutoring</p>
                <p className="text-xs text-slate-500">6:00 PM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </section>

        {/* My Chores */}
        <section className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">My Chores</h2>
            <span className="text-sm font-medium text-primary">2/4 Done</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mb-6">
            <div className="bg-primary h-2 rounded-full w-[50%]"></div>
          </div>
          <ul className="space-y-4">
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
              <div className="size-6 rounded-md border-2 border-slate-300"></div>
              <span className="text-sm font-medium">Feed the Dog</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="size-6 rounded-md border-2 border-slate-300"></div>
              <span className="text-sm font-medium">Fold Laundry</span>
            </li>
          </ul>
        </section>

        {/* Points & Allowance */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-primary p-5 rounded-xl text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs opacity-80 mb-1">Total Balance</p>
              {/* TODO: fetch user data from /api/user */}
              <h3 className="text-2xl font-bold">1,250</h3>
              <p className="text-[10px] font-medium tracking-wider mt-2">POINTS EARNED</p>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-20">
              <span className="material-symbols-outlined text-6xl">payments</span>
            </div>
          </div>
          <div className="bg-amber-100 p-5 rounded-xl border border-amber-200">
            <p className="text-xs text-amber-700 mb-1">Allowance</p>
            {/* TODO: fetch user data from /api/user */}
            <h3 className="text-2xl font-bold text-amber-800">$15.00</h3>
            <p className="text-[10px] font-bold text-amber-600 mt-2 uppercase">Next payout: Sat</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="font-bold text-lg mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(paths.finance)}
              className="bg-white p-4 rounded-xl flex items-center gap-3 border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <span className="text-sm font-semibold">Finance</span>
            </button>
            <button
              onClick={() => navigate(paths.sports)}
              className="bg-white p-4 rounded-xl flex items-center gap-3 border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">sports_soccer</span>
              </div>
              <span className="text-sm font-semibold">Sports</span>
            </button>
            <button
              onClick={() => navigate(paths.morePets)}
              className="bg-white p-4 rounded-xl flex items-center gap-3 border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined">pets</span>
              </div>
              <span className="text-sm font-semibold">Pet Hub</span>
            </button>
            <button
              onClick={() => navigate(paths.moreCourt)}
              className="bg-white p-4 rounded-xl flex items-center gap-3 border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <span className="text-sm font-semibold">Family Court</span>
            </button>
          </div>
        </section>

        {/* Shout-Outs */}
        <section>
          <h2 className="font-bold text-lg mb-3">Shout-Outs</h2>
          <div className="bg-white p-4 rounded-xl border-l-4 border-primary shadow-sm">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shrink-0">
                <span className="material-symbols-outlined">favorite</span>
              </div>
              <div>
                {/* TODO: fetch user data from /api/user */}
                <p className="text-sm italic text-slate-700">"Great job on your math test, Leo! I'm so proud of how hard you studied."</p>
                <p className="text-xs font-bold mt-2 text-primary">— Mom</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Notification Overlay */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-start"
          onClick={() => setShowNotifications(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-white w-full max-w-md mx-auto rounded-b-3xl shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base text-primary">gavel</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-snug">Leo submitted an appeal — pending your review.</p>
                  <p className="text-xs text-slate-400 mt-0.5">2h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base text-amber-500">star</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-snug">Emma completed "Clean Room" and earned 50 pts!</p>
                  <p className="text-xs text-slate-400 mt-0.5">4h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base text-green-600">sports_soccer</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-snug">Practice rescheduled to Friday 4 PM.</p>
                  <p className="text-xs text-slate-400 mt-0.5">1d ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
