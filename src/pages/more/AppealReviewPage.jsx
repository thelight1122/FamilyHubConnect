import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appeal } from '../../data/mockData';

const decisionConfig = {
  approved: { bg: 'bg-emerald-500', text: 'Reflection Approved', icon: 'check_circle', label: 'Approve Reflection' },
  denied: { bg: 'bg-red-500', text: 'Reflection Returned', icon: 'cancel', label: 'Return Reflection' },
  negotiate: { bg: 'bg-primary', text: 'Resolution Dialogue Opened', icon: 'forum', label: 'Open Resolution Dialogue' },
};

export default function AppealReviewPage() {
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null);
  const [pendingDecision, setPendingDecision] = useState(null);

  const appealData = {
    caseId: appeal?.caseId ?? '12345',
    child: 'Leo',
    charge: appeal?.reason ?? 'Missed Curfew',
    consequence: typeof appeal?.consequence === 'string' ? appeal.consequence : 'Screen time reflection',
    childArgument: appeal?.childArgument ?? "I was helping a friend with homework and lost track of time. I didn't mean to be late, but it was really important for them to finish before tomorrow.",
    proposedAlternative: appeal?.proposedAlternative ?? 'Extra chore: Vacuuming the living room',
    evidenceCount: 1,
  };

  const confirmDecision = () => {
    setDecision(pendingDecision);
    setPendingDecision(null);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div 
          onClick={() => navigate(-1)}
          className="flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Review Reflection</h2>
      </div>

      {decision && (
        <div className={`${decisionConfig[decision].bg} text-white px-4 py-3 flex items-center justify-center gap-2`}>
          <span className="material-symbols-outlined text-xl">{decisionConfig[decision].icon}</span>
          <p className="font-bold text-sm tracking-wide">{decisionConfig[decision].text}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Section 1: The Reflection */}
        <section className="bg-white dark:bg-slate-900 mt-2">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">The Reflection</h2>
          
          <div className="flex items-center gap-4 px-4 min-h-[72px] py-2">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-primary/20" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150&h=150')" }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-bold leading-normal">{appealData.child}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">
                Case #{appealData.caseId} - {appealData.charge}
              </p>
            </div>
          </div>
          
          <div className="p-4 pt-2">
            <div className="flex justify-between gap-x-6 py-3 border-b border-slate-50 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">Original Reflection</p>
              <p className="text-sm font-bold leading-normal text-right">{appealData.consequence}</p>
            </div>
            <div className="flex justify-between gap-x-6 py-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">Submission Time</p>
              <p className="text-sm font-medium leading-normal text-right">Today, 4:30 PM</p>
            </div>
          </div>
        </section>

        {/* Section 2: Child's Reflection */}
        <section className="bg-white dark:bg-slate-900 mt-2 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-primary">Child's Reflection</h3>
          <div className="bg-background-light dark:bg-background-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 relative">
            <span className="material-symbols-outlined absolute top-2 right-2 text-slate-200 dark:text-slate-700 text-4xl opacity-50">format_quote</span>
            <p className="text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed relative z-10">
              "{appealData.childArgument}"
            </p>
          </div>
        </section>

        {/* Section 3: Proposed Repair */}
        <section className="bg-white dark:bg-slate-900 mt-2 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-primary">Proposed Repair</h3>
          <div className="flex items-center gap-3 bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border border-primary/20">
            <span className="material-symbols-outlined text-primary text-2xl">cleaning_services</span>
            <p className="text-primary font-bold text-sm tracking-tight">{appealData.proposedAlternative}</p>
          </div>
        </section>

        {/* Section 4: Evidence */}
        <section className="bg-white dark:bg-slate-900 mt-2 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-primary">Evidence</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-background-light dark:bg-background-dark p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="relative group cursor-pointer w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mx-auto sm:mx-0 shrink-0 shadow-sm">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10"></div>
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&q=80&w=200&h=200')" }}
              ></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                 <span className="material-symbols-outlined text-white block text-sm">zoom_in</span>
              </div>
              <div className="absolute bottom-1 right-1 bg-white/90 dark:bg-slate-900/90 rounded px-1.5 py-0.5 text-[10px] font-bold z-20">IMAGE</div>
            </div>
            <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
              <p className="font-bold text-sm">homework_proof.jpg</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Attached by {appealData.child} &bull; 1.2 MB
              </p>
            </div>
          </div>
        </section>

        {/* Decision Confirmation view (if decided) */}
        {decision && (
          <div className="px-4 mt-6 mb-8">
            <div className={`${decisionConfig[decision].bg} text-white rounded-2xl p-6 text-center shadow-lg`}>
              <span className="material-symbols-outlined text-4xl mb-2 block">{decisionConfig[decision].icon}</span>
              <p className="font-bold text-lg mb-1">{decisionConfig[decision].text}</p>
              <p className="text-sm text-white/90 font-medium">Your decision has been recorded and {appealData.child} has been notified.</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!decision && (
          <section className="p-4 flex flex-col gap-3 mt-4 mb-8">
            <button 
              onClick={() => setPendingDecision('approved')}
              className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Approve Alternative
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => setPendingDecision('denied')}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-500 dark:text-red-400 font-bold py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>
                Deny
              </button>
              <button 
                onClick={() => setPendingDecision('negotiate')}
                className="flex-1 bg-white dark:bg-slate-800 border-2 border-primary text-primary font-bold py-3.5 flex items-center justify-center gap-2 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
              >
                <span className="material-symbols-outlined text-base font-bold">forum</span>
                Negotiate
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Confirm modal */}
      {pendingDecision && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setPendingDecision(null)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-slate-900 rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-16 h-16 rounded-2xl ${decisionConfig[pendingDecision].bg} flex items-center justify-center mx-auto mb-5 shadow-inner`}>
              <span className="material-symbols-outlined text-white text-3xl">{decisionConfig[pendingDecision].icon}</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">
              {decisionConfig[pendingDecision].label}?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 font-medium px-4">
              This will notify {appealData.child} of your decision immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDecision(null)}
                className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDecision}
                className={`flex-1 py-3.5 rounded-xl ${decisionConfig[pendingDecision].bg} hover:brightness-110 text-white font-bold text-sm transition-all shadow-md shadow-${decisionConfig[pendingDecision].bg.replace('bg-', '')}/30`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
