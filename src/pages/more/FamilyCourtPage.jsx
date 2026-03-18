import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

// TODO: fetch consequences from /api/court

const consequences = [
  {
    idx: 0,
    icon: 'smartphone',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    title: '1-day screen time ban',
    violation: 'Missed curfew',
    status: 'in_progress',
    timeRemaining: '4h 20m',
    progress: 75,
  },
  {
    idx: 1,
    icon: 'cleaning_services',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Extra Chore: Kitchen',
    violation: 'Unfinished chores',
    status: 'pending_review',
  },
  {
    idx: 2,
    icon: 'videogame_asset_off',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    title: 'No Gaming: Weekend',
    violation: 'Late homework',
    status: 'completed',
    resolvedAgo: '2h ago',
  },
];

export default function FamilyCourtPage() {
  const [toast, showToast] = useToast();
  const [doneIds, setDoneIds] = useState([]);

  const handleMarkDone = (idx) => {
    setDoneIds((prev) => [...prev, idx]);
    showToast('Consequence marked complete');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toast message={toast} />
      <BackHeader title="Family Court" backTo={paths.more} />

      <div className="flex-1 pb-24">
        {/* Stats */}
        <section className="p-4 grid grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <p className="text-slate-500 text-sm font-medium mb-1">Active Measures</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">3</span>
              <span className="text-xs font-semibold text-primary/60">Ongoing</span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-slate-500 text-sm font-medium mb-1">Weekly Resolution</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-700">85%</span>
              <span className="text-xs font-semibold text-emerald-500">↑ 12%</span>
            </div>
          </div>
        </section>

        {/* Active Consequences */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Active Consequences</h2>
            <span className="text-primary text-sm font-semibold cursor-pointer">View All</span>
          </div>
          <div className="space-y-3">
            {consequences.map((c) => {
              const isDone = doneIds.includes(c.idx);
              const effectiveStatus = isDone ? 'completed' : c.status;

              return (
                <div
                  key={c.idx}
                  className={`bg-white border border-slate-100 rounded-xl p-4 shadow-sm ${
                    effectiveStatus === 'completed' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-lg ${c.iconBg} ${c.iconColor} flex items-center justify-center`}>
                        <span className="material-symbols-outlined">{c.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{c.title}</h3>
                        <p className="text-xs text-slate-500">Violation: {c.violation}</p>
                      </div>
                    </div>
                    {effectiveStatus !== 'completed' && (
                      <button className="text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    {effectiveStatus === 'in_progress' && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-sm font-medium text-amber-600">In Progress</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{c.timeRemaining} remaining</p>
                      </>
                    )}
                    {effectiveStatus === 'pending_review' && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-blue-600">Pending Review</span>
                        </div>
                        <button
                          onClick={() => handleMarkDone(c.idx)}
                          className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full uppercase"
                        >
                          Mark Done
                        </button>
                      </>
                    )}
                    {effectiveStatus === 'completed' && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                          <span className="text-sm font-medium text-emerald-600">Completed</span>
                        </div>
                        <p className="text-xs font-medium text-slate-400 italic">
                          {isDone ? 'Just now' : `Resolved ${c.resolvedAgo}`}
                        </p>
                      </>
                    )}
                  </div>

                  {effectiveStatus === 'in_progress' && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Consequence History */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Consequence History</h2>
            <span className="material-symbols-outlined text-slate-400">history</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border-l-2 border-emerald-500 bg-emerald-50/30">
              <span className="material-symbols-outlined text-emerald-500">task_alt</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">Earlier Bedtime (8PM)</p>
                <p className="text-xs text-slate-500">Completed Jan 12 • Leo</p>
              </div>
              <span className="text-xs font-medium text-slate-400">3 days ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border-l-2 border-slate-300">
              <span className="material-symbols-outlined text-slate-400">cancel</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">No Dessert</p>
                <p className="text-xs text-slate-500">Waived by Mom • Maya</p>
              </div>
              <span className="text-xs font-medium text-slate-400">5 days ago</span>
            </div>
          </div>
          <button className="w-full mt-4 py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-primary hover:text-primary transition-all">
            Load Older History
          </button>
        </section>

        {/* System Integration */}
        <section className="px-4 pb-8">
          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">System Integration</h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                Screen time bans and app locks are automatically synced with child devices via the
                Family Hub.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                  iOS ScreenTime Active
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                  Android Link Active
                </span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <span className="material-symbols-outlined text-[120px]">sync</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
