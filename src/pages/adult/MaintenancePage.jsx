import { useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { paths } from '../../config/paths';
import { maintenance } from '../../data/mockData';
import { orbIds, recordGovernanceEvent } from '../../pod';

const SECTIONS = [
  { id: 'vehicles', label: 'Vehicles', icon: 'directions_car' },
  { id: 'home', label: 'Home', icon: 'home_repair_service' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'subscriptions' },
];

const STATUS_CLASS = {
  Overdue: 'bg-rose-50 text-rose-600 border-rose-100',
  'Due soon': 'bg-amber-50 text-amber-700 border-amber-100',
  Schedule: 'bg-blue-50 text-blue-600 border-blue-100',
  Ready: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Review: 'bg-violet-50 text-violet-600 border-violet-100',
  Active: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function MaintenancePage() {
  const [activeSection, setActiveSection] = useState('vehicles');
  const [completed, setCompleted] = useState([]);
  const transparencyPreview = recordGovernanceEvent({
    orbId: orbIds.AUTO_MAINTENANCE,
    eventType: 'maintenance_view',
    summary: 'Adult maintenance hub viewed with AI-safe household operational shadows.',
  });

  const items = maintenance[activeSection] ?? [];

  const toggleComplete = (itemId) => {
    setCompleted((current) => (
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    ));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-surface-0 text-slate-900 overflow-x-hidden">
      <BackHeader title="Maintenance" backTo={paths.adultDashboard} />

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-28 space-y-6">
        <section className="rounded-3xl bg-slate-900 text-white p-5 shadow-lifted">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Adult Utility Orb</p>
              <h1 className="mt-2 text-2xl font-black leading-tight">Household maintenance</h1>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Vehicle, home, and subscription reminders in one guardian-owned view.
              </p>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <span className="material-symbols-outlined">handyman</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[10px] font-bold uppercase text-white/50">Due soon</p>
              <p className="mt-1 text-xl font-black">{maintenance.summary.dueSoon}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[10px] font-bold uppercase text-white/50">Overdue</p>
              <p className="mt-1 text-xl font-black">{maintenance.summary.overdue}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[10px] font-bold uppercase text-white/50">Monthly</p>
              <p className="mt-1 text-xl font-black">${maintenance.summary.monthlySpend}</p>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-atmospheric">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-black transition-all ${
                  activeSection === section.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          {items.map((item) => {
            const isComplete = completed.includes(item.id);

            return (
              <article
                key={item.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm transition-all ${
                  isComplete ? 'border-emerald-100 opacity-75' : 'border-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-black text-slate-900">{item.title}</h2>
                        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">{item.detail}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black ${STATUS_CLASS[item.status] ?? STATUS_CLASS.Active}`}>
                        {isComplete ? 'Done' : item.status}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      <span className="material-symbols-outlined text-sm">{isComplete ? 'undo' : 'task_alt'}</span>
                      {isComplete ? 'Reopen item' : 'Mark handled'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Transparency preview</h2>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                {transparencyPreview.summary}
              </p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {transparencyPreview.orbLabel} / {transparencyPreview.behavior}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
