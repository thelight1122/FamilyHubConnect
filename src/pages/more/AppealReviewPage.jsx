import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

// TODO: PATCH appeal decision to /api/appeals/:id

const DECISION_CONFIG = {
  approve: {
    label: 'Approve Appeal',
    icon: 'check_circle',
    bgClass: 'bg-green-500',
    borderClass: 'border-green-500',
    textClass: 'text-green-600',
    resultText: 'Appeal approved — Leo has been notified',
  },
  deny: {
    label: 'Deny Appeal',
    icon: 'cancel',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-500',
    textClass: 'text-red-600',
    resultText: 'Appeal denied — Leo has been notified',
  },
  negotiate: {
    label: 'Open Negotiation',
    icon: 'forum',
    bgClass: 'bg-primary',
    borderClass: 'border-primary',
    textClass: 'text-primary',
    resultText: 'Negotiation opened — Leo has been notified',
  },
};

export default function AppealReviewPage() {
  const [pendingDecision, setPendingDecision] = useState(null);
  const [decision, setDecision] = useState(null);

  const confirmDecision = () => {
    setDecision(pendingDecision);
    setPendingDecision(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <BackHeader title="Review Appeal" backTo={paths.more} />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* The Appeal — child info */}
        <div className="bg-white mt-2">
          <h2 className="text-slate-900 text-[22px] font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
            The Appeal
          </h2>
          <div className="flex items-center gap-4 px-4 min-h-[72px] py-2">
            <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20 shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">person</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-slate-900 text-base font-medium leading-normal">Leo</p>
              <p className="text-slate-500 text-sm font-normal leading-normal">
                Case #12345 - Missed Curfew
              </p>
            </div>
          </div>
          <div className="p-4 pt-2">
            <div className="flex justify-between gap-x-6 py-2 border-b border-slate-50">
              <p className="text-slate-500 text-sm font-normal leading-normal">
                Original Consequence
              </p>
              <p className="text-slate-900 text-sm font-semibold leading-normal text-right">
                1-day screen time ban
              </p>
            </div>
            <div className="flex justify-between gap-x-6 py-2">
              <p className="text-slate-500 text-sm font-normal leading-normal">Submission Time</p>
              <p className="text-slate-900 text-sm font-normal leading-normal text-right">
                Today, 4:30 PM
              </p>
            </div>
          </div>
        </div>

        {/* Child's Argument */}
        <div className="bg-white mt-2 p-4">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider mb-3">
            Child's Argument
          </h3>
          <div className="bg-background-light p-4 rounded-xl border border-slate-200">
            <p className="text-slate-700 text-sm italic leading-relaxed">
              "I was helping a friend with homework and lost track of time. I didn't mean to be
              late, but it was really important for them to finish before tomorrow."
            </p>
          </div>
        </div>

        {/* Proposed Alternative */}
        <div className="bg-white mt-2 p-4">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider mb-3">
            Proposed Alternative
          </h3>
          <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-xl border border-primary/20">
            <span className="material-symbols-outlined text-primary">cleaning_services</span>
            <p className="text-primary font-semibold text-sm">
              Extra chore: Vacuuming the living room
            </p>
          </div>
        </div>

        {/* Evidence */}
        <div className="bg-white mt-2 p-4">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider mb-3">
            Evidence
          </h3>
          <div className="flex gap-4">
            <div className="relative group cursor-pointer w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-400 text-3xl">image</span>
              <div className="absolute bottom-1 right-1 bg-white/90 rounded px-1 py-0.5 text-[10px] font-bold">
                IMAGE
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-slate-900 text-sm font-medium">homework_proof.jpg</p>
              <p className="text-slate-500 text-xs">Attached by Leo • 1.2 MB</p>
            </div>
          </div>
        </div>

        {/* Decision Buttons — hidden once decided */}
        {!decision && (
          <div className="p-4 flex flex-col gap-3 mt-4 mb-4">
            <button
              onClick={() => setPendingDecision('approve')}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Approve Appeal
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDecision('deny')}
                className="flex-1 bg-white border border-slate-200 text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all"
              >
                Deny Appeal
              </button>
              <button
                onClick={() => setPendingDecision('negotiate')}
                className="flex-1 bg-white border border-slate-200 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <span className="material-symbols-outlined text-base">forum</span>
                Negotiate
              </button>
            </div>
          </div>
        )}

        {/* Result Card — shown after decision */}
        {decision && (
          <div className={`mx-4 mt-6 mb-4 ${DECISION_CONFIG[decision].bgClass} text-white rounded-2xl p-5 text-center`}>
            <span className="material-symbols-outlined text-3xl mb-2 block">
              {DECISION_CONFIG[decision].icon}
            </span>
            <p className="font-bold text-base">{DECISION_CONFIG[decision].resultText}</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {pendingDecision && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          onClick={() => setPendingDecision(null)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-14 h-14 rounded-full ${DECISION_CONFIG[pendingDecision].bgClass} flex items-center justify-center mx-auto mb-4`}
            >
              <span className="material-symbols-outlined text-white text-3xl">
                {DECISION_CONFIG[pendingDecision].icon}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              {DECISION_CONFIG[pendingDecision].label}?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              This will notify Leo of your decision.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDecision(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDecision}
                className={`flex-1 py-3 rounded-2xl ${DECISION_CONFIG[pendingDecision].bgClass} text-white font-semibold text-sm`}
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
