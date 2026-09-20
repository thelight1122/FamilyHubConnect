import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import { constitution } from '../../data/mockData';

export default function ConstitutionPage() {
  const navigate = useNavigate();
  const [toast, showToast] = useToast();
  
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [proposalText, setProposalText] = useState('');
  const [rationaleText, setRationaleText] = useState('');
  
  const missionText =
    constitution?.mission ??
    'To foster a home of unconditional love, continuous growth, and unwavering support for every member of our family. We grow together, learn together, and celebrate each other.';

  const rules = constitution?.rules?.length ? constitution.rules : [
    'No phones at the dinner table.',
    'Listen before reacting or interrupting.',
    'Always say "I love you" before sleep.',
    'Own your mistakes and apologize sincerely.',
  ];

  const handleSubmitProposal = () => {
    if(!proposalText.trim()) {
      showToast('Please draft an amendment proposal');
      return;
    }
    showToast('Amendment proposal submitted!');
    setIsProposeModalOpen(false);
    setProposalText('');
    setRationaleText('');
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative w-full overflow-x-hidden">
      <Toast message={toast} />

      {/* Top Navigation */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined block">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Family Constitution</h1>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined block text-slate-400">history</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full pb-8">
        {/* Hero Section / Preamble */}
        <section className="p-6 text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full mx-auto border-4 border-primary/20 p-1">
              <div 
                className="w-full h-full rounded-full bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=200&h=200')" }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
              <span className="material-symbols-outlined text-sm block">verified_user</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">The Thompson Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              "{missionText}"
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 text-xs font-semibold rounded-full uppercase tracking-wider">
                Established June 2024
              </span>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="px-4 py-6 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="text-lg font-bold">Our Core Values</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="p-2 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-lg shrink-0">
                <span className="material-symbols-outlined block">favorite</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-50">Kindness</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Treating everyone with empathy and understanding, even during disagreements.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg shrink-0">
                <span className="material-symbols-outlined block">gavel</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-50">Honesty</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Speaking our truth with love and maintaining transparency in our actions.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-lg shrink-0">
                <span className="material-symbols-outlined block">lightbulb</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-50">Curiosity</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Never stop learning about ourselves, each other, and the world around us.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Family Rules Section */}
        <section className="px-4 py-6 space-y-4 bg-primary/5 dark:bg-primary/10 my-4 border-y border-primary/10 dark:border-primary/20">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary">rule</span>
            <h3 className="text-lg font-bold">Family Rules</h3>
          </div>
          <ul className="space-y-2">
            {rules.map((rule, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span className="text-sm font-medium">{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Acknowledgment Section */}
        <section className="px-4 py-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold">Signatories</h3>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Last Updated: Oct 12, 2023</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex -space-x-3 overflow-hidden">
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100')" }} />
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100')" }} />
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=100&h=100')" }} />
              <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100')" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">All members have signed</p>
              <p className="text-xs text-slate-500">Thompson Family Hub</p>
            </div>
            <div className="text-primary pr-2">
              <span className="material-symbols-outlined block text-2xl">verified</span>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="px-6 py-4">
          <button 
            onClick={() => setIsProposeModalOpen(true)}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
            Propose Amendment
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
            Amendments will be discussed in the next family meeting
          </p>
        </div>
      </main>

      {/* Propose Amendment Modal */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsProposeModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">feed</span>
                Propose Amendment
              </h3>
              <button onClick={() => setIsProposeModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  Proposed Change or Addition
                </label>
                <textarea 
                  value={proposalText} 
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="e.g. Add a rule about screen time limits on weekends..." 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  Rationale <span className="text-[10px] font-medium opacity-60">(Optional)</span>
                </label>
                <textarea 
                  value={rationaleText} 
                  onChange={(e) => setRationaleText(e.target.value)}
                  placeholder="Why should the family adopt this amendment?" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[80px] resize-none"
                />
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSubmitProposal}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98]"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
