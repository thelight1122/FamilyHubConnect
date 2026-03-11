import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import { familyCourt } from '../../data/mockData';

const STATUS_CONFIG = {
  in_progress: { dotClass: 'bg-amber-500 animate-pulse', textClass: 'text-amber-600', label: 'In Progress' },
  pending_review: { dotClass: 'bg-blue-500', textClass: 'text-blue-600', label: 'Pending Review' },
  completed: { dotClass: '', textClass: 'text-emerald-600', label: 'Completed' },
};

export default function FamilyCourtPage() {
  const navigate = useNavigate();
  const [toast, showToast] = useToast();
  const [markedDone, setMarkedDone] = useState([]);
  const { stats, consequences, history } = familyCourt;

  const handleMarkDone = (id) => {
    setMarkedDone((prev) => [...new Set([...prev, id])]);
    showToast('✓ Marked as complete');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toast message={toast} />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#4c8ce6]/10 p-2 rounded-lg text-[#4c8ce6]">
            <span className="material-symbols-outlined">gavel</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Family Court</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Consequence Management</p>
          </div>
        </div>
        <button
          onClick={() => showToast('Add consequence coming soon')}
          className="bg-[#4c8ce6] text-white p-2 rounded-full flex items-center justify-center hover:bg-[#3a7bd5] transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className="flex-1 pb-24">
        {/* Stats */}
        <section className="p-4 grid grid-cols-2 gap-4">
          <div className="bg-[#4c8ce6]/5 border border-[#4c8ce6]/10 rounded-xl p-4">
            <p className="text-slate-500 text-sm font-medium mb-1">Active Measures</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#4c8ce6]">{stats.activeMeasures}</span>
              <span className="text-xs font-semibold text-[#4c8ce6]/60">Ongoing</span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-slate-500 text-sm font-medium mb-1">Weekly Resolution</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-700">{stats.weeklyResolution}%</span>
              <span className="text-xs font-semibold text-emerald-500">↑ {stats.resolutionTrend}%</span>
            </div>
          </div>
        </section>

        {/* Active Consequences */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Active Consequences</h2>
            <button
              onClick={() => navigate('/more/appeal')}
              className="text-[#4c8ce6] text-sm font-semibold"
            >
              + New Appeal
            </button>
          </div>
          <div className="space-y-3">
            {consequences.map((c) => {
              const isDone = markedDone.includes(c.id);
              const effectiveStatus = isDone ? 'completed' : c.status;
              const cfg = STATUS_CONFIG[effectiveStatus];
              return (
                <div
                  key={c.id}
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
                      <button
                        onClick={() => showToast('Edit coming soon')}
                        className="text-slate-400 hover:text-[#4c8ce6]"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      {effectiveStatus === 'completed' ? (
                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                      ) : (
                        <span className={`size-2 rounded-full ${cfg.dotClass}`} />
                      )}
                      <span className={`text-sm font-medium ${cfg.textClass}`}>{cfg.label}</span>
                    </div>

                    {effectiveStatus === 'in_progress' && (
                      <p className="text-sm font-bold text-slate-700">{c.timeRemaining} remaining</p>
                    )}
                    {effectiveStatus === 'pending_review' && (
                      <button
                        onClick={() => handleMarkDone(c.id)}
                        className="text-xs font-bold bg-slate-100 hover:bg-green-50 hover:text-green-600 px-3 py-1 rounded-full uppercase transition-colors"
                      >
                        Mark Done
                      </button>
                    )}
                    {effectiveStatus === 'completed' && (
                      <p className="text-xs font-medium text-slate-400 italic">
                        {isDone ? 'Just now' : `Resolved ${c.resolvedAgo}`}
                      </p>
                    )}
                  </div>

                  {effectiveStatus === 'in_progress' && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#4c8ce6] h-full rounded-full" style={{ width: `${c.progress}%` }} />
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
            {history.map((h) => (
              <div
                key={h.id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border-l-2 transition-colors hover:bg-slate-50 ${
                  h.status === 'completed' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300'
                }`}
              >
                <span className={`material-symbols-outlined ${h.status === 'completed' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {h.status === 'completed' ? 'task_alt' : 'cancel'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-xs text-slate-500">{h.detail}</p>
                </div>
                <span className="text-xs font-medium text-slate-400">{h.ago}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast('No older history available')}
            className="w-full mt-4 py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-[#4c8ce6] hover:text-[#4c8ce6] transition-all"
          >
            Load Older History
          </button>
        </section>

        {/* System Integration */}
        <section className="px-4 pb-8">
          <div className="bg-[#4c8ce6] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">System Integration</h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                Screen time bans and app locks are automatically synced with child devices via the Family Hub.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">iOS ScreenTime Active</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">Android Link Active</span>
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
