import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

const TABS = [
  { key: 'resolution', label: 'Resolution' },
  { key: 'jury', label: 'Jury Pool' },
  { key: 'archive', label: 'Archive' },
  { key: 'rulebook', label: 'Rule Book' },
];

export default function FamilyGovernancePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resolution');

  {/* TODO: fetch governance data from /api/governance */}

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <BackHeader title="Family Governance" backTo={paths.more} />

      {/* Tab Nav */}
      <nav className="bg-white sticky top-[57px] z-40">
        <div className="flex border-b border-slate-200 px-4 gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center border-b-[3px] pb-3 pt-4 whitespace-nowrap text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-slate-500 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 pb-8">
        {/* Resolution Tab */}
        {activeTab === 'resolution' && (
          <section className="px-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight">Active Mediation</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded">
                1 Pending
              </span>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <div
                className="h-32 w-full flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #4c8ce6 0%, #1e3a8a 100%)' }}
              >
                <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[80px] text-white">balance</span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold mb-1">Request a Family Hearing</h4>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Formally present a conflict for mediation. This ensures a neutral platform where
                  everyone is heard and a fair resolution is reached.
                </p>
                <button
                  onClick={() => navigate(paths.moreAppeal)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>New Resolution Request</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Jury Pool Tab */}
        {activeTab === 'jury' && (
          <section className="px-4 pt-6">
            <h3 className="text-xl font-bold tracking-tight mb-4">The Jury Pool</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">Mom (Sarah)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Next Mediator (April 15-30)</p>
                </div>
                <div className="size-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 opacity-60">
                <div className="size-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">Dad (Michael)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Standby Mediator</p>
                </div>
              </div>
            </div>
            <button className="mt-4 text-primary text-sm font-semibold flex items-center gap-1">
              <span>View full rotation schedule</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </section>
        )}

        {/* Archive Tab */}
        {activeTab === 'archive' && (
          <section className="px-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight">Court Archive</h3>
              <button className="text-sm text-primary font-semibold">See All</button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-primary">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Ruling: April 02, 2024
                  </span>
                  <span className="material-symbols-outlined text-slate-300">history_edu</span>
                </div>
                <p className="font-bold text-slate-800 mb-1">The "Dirty Dishes" Dispute</p>
                <p className="text-sm text-slate-600 italic">
                  "Agreed resolution: Leo will handle kitchen duty for 3 extra days; the group chat
                  remains for reminders only."
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-slate-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Ruling: March 18, 2024
                  </span>
                </div>
                <p className="font-bold text-slate-800 mb-1">Screen Time Extension</p>
                <p className="text-sm text-slate-600 italic">
                  "Resolution: Homework must be verified before 7 PM to unlock bonus hour."
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Rule Book Tab */}
        {activeTab === 'rulebook' && (
          <section className="px-4 pt-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10">
                <span className="material-symbols-outlined text-[140px]">menu_book</span>
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Family Constitution</h3>
              <p className="text-slate-400 text-sm mb-4 relative z-10">
                Our agreed-upon rules for a happy and fair household.
              </p>
              <div className="flex flex-wrap gap-2 relative z-10">
                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs border border-slate-700">
                  Article 1: Privacy
                </span>
                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs border border-slate-700">
                  Article 2: Chores
                </span>
                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs border border-slate-700">
                  Article 3: Respect
                </span>
              </div>
              <button
                onClick={() => navigate(paths.moreConstitution)}
                className="mt-6 w-full bg-white text-slate-900 font-bold py-2 rounded-lg text-sm relative z-10"
              >
                Open Rule Book
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
