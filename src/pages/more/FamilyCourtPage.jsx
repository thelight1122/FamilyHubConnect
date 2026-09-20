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
  
  // Convert mock data to local state
  const [localStats, setLocalStats] = useState(familyCourt.stats);
  const [localConsequences, setLocalConsequences] = useState(familyCourt.consequences);
  const [localHistory, setLocalHistory] = useState(familyCourt.history);
  
  const [markedDone, setMarkedDone] = useState([]);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingConsequence, setEditingConsequence] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', violation: '', timeRemaining: '1h 0m' });

  const handleMarkDone = (id) => {
    setMarkedDone((prev) => [...new Set([...prev, id])]);
    showToast('✓ Marked as complete');
  };

  const handleSaveConsequence = () => {
    if (!formData.title || !formData.violation) {
      showToast('Please fill all fields');
      return;
    }

    if (editingConsequence) {
      setLocalConsequences(prev => prev.map(c => 
        c.id === editingConsequence.id 
          ? { ...c, title: formData.title, violation: formData.violation, timeRemaining: formData.timeRemaining }
          : c
      ));
      showToast('Reflection updated');
    } else {
      const newConsequence = {
        id: `consequence-${localConsequences.length + 1}`,
        title: formData.title,
        violation: formData.violation,
        status: 'in_progress',
        icon: 'cancel',
        timeRemaining: formData.timeRemaining,
        progress: 10
      };
      setLocalConsequences(prev => [newConsequence, ...prev]);
      setLocalStats(prev => ({ ...prev, activeMeasures: prev.activeMeasures + 1 }));
      showToast('New reflection recorded');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setLocalConsequences(prev => prev.filter(c => c.id !== id));
    setLocalStats(prev => ({ ...prev, activeMeasures: Math.max(0, prev.activeMeasures - 1) }));
    showToast('Reflection removed');
    closeModal();
  };

  const openAddModal = () => {
    setFormData({ title: '', violation: '', timeRemaining: '1h 0m' });
    setEditingConsequence(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (c) => {
    setFormData({ title: c.title, violation: c.violation, timeRemaining: c.timeRemaining || '' });
    setEditingConsequence(c);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingConsequence(null);
  };

  const handleLoadOlderHistory = () => {
    const olderMock = {
      id: Date.now(),
      title: 'Loss of TV Privileges',
      detail: 'Skipped soccer practice',
      status: 'completed',
      ago: '3 wks ago',
      resolution: 'Completed 1 extra chore'
    };
    setLocalHistory(prev => [...prev, olderMock]);
    showToast('Loaded older history');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col w-full relative overflow-x-hidden pb-8">
      <Toast message={toast} />

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined block">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Accountability</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Reflection Management</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      <main className="flex-1 w-full">
        {/* Stats Section */}
        <section className="p-4 grid grid-cols-2 gap-4">
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-4 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Measures</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{localStats.activeMeasures}</span>
              <span className="text-xs font-semibold text-primary/60">Ongoing</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Weekly Resolution</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">{localStats.weeklyResolution}%</span>
              <span className="text-xs font-semibold text-emerald-500">↑ {localStats.resolutionTrend}%</span>
            </div>
          </div>
        </section>

        {/* Active Reflections */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Active Reflections</h2>
            <button
              onClick={() => navigate('/more/appeal')}
              className="text-primary text-sm font-semibold cursor-pointer hover:text-primary/80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {localConsequences.map((c) => {
              const isDone = markedDone.includes(c.id);
              const effectiveStatus = isDone ? 'completed' : c.status;
              const cfg = STATUS_CONFIG[effectiveStatus];
              
              const iconContainerClass = `size-10 rounded-lg flex items-center justify-center ${
                effectiveStatus === 'completed' 
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                  : 'bg-primary/10 text-primary'
              }`;

              return (
                <div
                  key={c.id}
                  className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm transition-opacity ${
                    effectiveStatus === 'completed' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={iconContainerClass}>
                        <span className="material-symbols-outlined shrink-0">{c.icon || 'warning'}</span>
                      </div>
                      <div className="min-w-0 pr-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base truncate">{c.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">Pattern note: {c.violation}</p>
                      </div>
                    </div>
                    {effectiveStatus !== 'completed' && (
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      {effectiveStatus === 'completed' ? (
                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                      ) : (
                        <span className={`size-2 rounded-full ${cfg.dotClass}`} />
                      )}
                      <span className={`text-sm font-medium ${cfg.textClass}`}>{cfg.label}</span>
                    </div>

                    {effectiveStatus === 'in_progress' && (
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{c.timeRemaining || '4h 20m'} remaining</p>
                    )}
                    {effectiveStatus === 'pending_review' && (
                      <button
                        onClick={() => handleMarkDone(c.id)}
                        className="text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-full uppercase transition-colors"
                      >
                        Mark Done
                      </button>
                    )}
                    {effectiveStatus === 'completed' && (
                      <p className="text-xs font-medium text-slate-400 italic">
                        {isDone ? 'Resolved just now' : `Resolved ${c.resolvedAgo || 'recently'}`}
                      </p>
                    )}
                  </div>

                  {effectiveStatus === 'in_progress' && (
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${c.progress || 75}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
            
            {localConsequences.length === 0 && (
              <div className="text-center py-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">sentiment_satisfied</span>
                <p className="text-slate-500 font-medium text-sm">No active reflections. The ledger is clear.</p>
              </div>
            )}
          </div>
        </section>

        {/* Reflection History */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Reflection History</h2>
            <span className="material-symbols-outlined text-slate-400">history</span>
          </div>
          <div className="space-y-2">
            {localHistory.map((h) => (
              <div
                key={h.id}
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-l-2 ${
                  h.status === 'completed' 
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                <span className={`material-symbols-outlined ${h.status === 'completed' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {h.status === 'completed' ? 'task_alt' : 'cancel'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{h.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{h.detail}</p>
                </div>
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{h.ago}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleLoadOlderHistory}
            className="w-full mt-4 py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium hover:border-primary hover:text-primary transition-all dark:hover:border-primary dark:hover:text-primary active:scale-[0.98]"
          >
            Load Older History
          </button>
        </section>
      </main>

      {/* Add / Edit Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingConsequence ? 'Edit Reflection' : 'New Reflection'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Reflection Action</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Screen Time Reflection" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Pattern Observed</label>
                <input 
                  type="text" 
                  value={formData.violation} 
                  onChange={(e) => setFormData({...formData, violation: e.target.value})}
                  placeholder="e.g. Missed assigned chores" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Duration/Condition</label>
                <input 
                  type="text" 
                  value={formData.timeRemaining} 
                  onChange={(e) => setFormData({...formData, timeRemaining: e.target.value})}
                  placeholder="e.g. 24 hours" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {editingConsequence && (
                <button 
                  onClick={() => handleDelete(editingConsequence.id)}
                  className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 transition-colors"
                >
                  <span className="material-symbols-outlined block">delete</span>
                </button>
              )}
              <button 
                onClick={handleSaveConsequence}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20"
              >
                {editingConsequence ? 'Update' : 'Record Reflection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
