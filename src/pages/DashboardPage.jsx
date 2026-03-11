import { useNavigate } from 'react-router-dom';
import { paths } from '../config/routes';
import { currentMember, dashboardQuickActions, dashboardSchedule, familyName } from '../data/selectors';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light pb-24">
      <div className="relative bg-white px-4 pt-6 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good morning, {currentMember.name}!</h2>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">{familyName}</p>
        </div>
        <button className="absolute top-6 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined text-slate-600">notifications</span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-500">star</span>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{currentMember.points} pts</p>
              <p className="text-xs text-slate-500 font-medium">Points Balance</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-green-600">payments</span>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">${currentMember.allowance}</p>
              <p className="text-xs text-slate-500 font-medium">This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-base font-bold text-slate-900 mb-3">Today's Schedule</h3>
          <div className="space-y-2">
            {dashboardSchedule.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <span className="flex-1 text-sm font-semibold text-slate-800">{item.title}</span>
                <span className="text-sm font-medium text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900">Today's Chores</h3>
            <button
              onClick={() => navigate(paths.chores)}
              className="text-sm text-primary font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">3 of 5 done</span>
            <span className="text-sm font-bold text-slate-700">60%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: '60%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-base font-bold text-slate-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {dashboardQuickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color}`}>
                  <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-amber-100">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-400 text-2xl">star</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-0.5">Shout-out!</p>
            <p className="text-sm text-slate-700 font-medium leading-snug">
              Dad gave you a shout-out: Great job finishing homework!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
