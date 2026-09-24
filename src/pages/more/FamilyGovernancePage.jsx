import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TABS = ['Resolution', 'Circle', 'Archive', 'Rule Book'];
const reflectionCircle = [];
const resolutionArchive = [];

export default function FamilyGovernancePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Resolution');

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 justify-between">
        <div className="text-primary flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <span className="material-symbols-outlined">gavel</span>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Family Governance</h2>
        <div className="size-10 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined text-slate-500">notifications</span>
        </div>
      </header>

      {/* Tab Nav */}
      <nav className="bg-white dark:bg-slate-900 sticky top-[73px] z-40">
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 gap-6 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <p className="text-sm">{tab}</p>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 pb-24">
        {/* Resolution Tab */}
        {activeTab === 'Resolution' && (
          <section className="px-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight">Active Mediation</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                0 Pending
              </span>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
              <div
                className="h-32 w-full flex items-center justify-center relative overflow-hidden"
                style={{ backgroundImage: 'linear-gradient(135deg, #4c8ce6 0%, #1e3a8a 100%)' }}
              >
                <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[80px] text-white">balance</span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold mb-1">Request a Family Hearing</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                  Formally present a conflict for mediation. This ensures a neutral platform where everyone
                  is heard and a fair resolution is reached.
                </p>
                <button
                  onClick={() => navigate('/more/appeal')}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>New Resolution Request</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Circle Tab */}
        {activeTab === 'Circle' && (
          <section className="px-4 pt-6">
            <h3 className="text-xl font-bold tracking-tight mb-4">The Reflection Circle</h3>
            <div className="grid grid-cols-1 gap-3">
              {reflectionCircle.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-3xl text-slate-300">groups</span>
                  <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No reflection circle rotation yet</p>
                </div>
              ) : reflectionCircle.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-opacity ${
                    !member.active ? 'opacity-60' : ''
                  }`}
                >
                  <div
                    className={`size-12 rounded-full flex items-center justify-center ${
                      member.active
                        ? 'bg-primary/20 text-primary'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{member.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{member.period || 'Standby Mediator'}</p>
                  </div>
                  {member.active && <div className="size-2 rounded-full bg-emerald-500" />}
                </div>
              ))}
            </div>
            <button className="mt-4 text-primary text-sm font-semibold flex items-center gap-1 hover:text-primary/80 transition-colors">
              <span>View full rotation schedule</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </section>
        )}

        {/* Archive Tab */}
        {activeTab === 'Archive' && (
          <section className="px-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight">Resolution Archive</h3>
              <button className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors">See All</button>
            </div>
            <div className="flex flex-col gap-4">
              {resolutionArchive.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-3xl text-slate-300">inventory_2</span>
                  <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No archived resolutions yet</p>
                </div>
              ) : resolutionArchive.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 border-l-4 ${
                    item.highlight 
                      ? 'border-l-primary' 
                      : 'border-l-slate-300 dark:border-l-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Ruling: {item.date}
                    </span>
                    {item.highlight && (
                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-500">history_edu</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{item.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{item.resolution}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rule Book Tab */}
        {activeTab === 'Rule Book' && (
          <section className="px-4 pt-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[140px]">menu_book</span>
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Family Constitution</h3>
              <p className="text-slate-400 text-sm mb-4 relative z-10">
                Live family rules will appear here after your test family enters them.
              </p>
              <div className="flex flex-wrap gap-2 relative z-10">
                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs border border-slate-700">
                  No live articles entered
                </span>
              </div>
              <button
                onClick={() => navigate('/more/constitution')}
                className="mt-6 w-full bg-white text-slate-900 font-bold py-3 rounded-lg text-sm relative z-10 hover:bg-slate-100 transition-colors shadow-lg"
              >
                Open Rule Book
              </button>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}
