import { useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { appeal } from '../../data/mockData';

export default function AppealReviewPage() {
  const [decision, setDecision] = useState(null);

  const appealData = {
    caseId: appeal?.caseId ?? '12345',
    child: 'Leo Thompson',
    charge: appeal?.reason ?? 'Missed Curfew — 15 mins late',
    consequence: typeof appeal?.consequence === 'string' ? appeal.consequence : '1-day screen time ban',
    childArgument: appeal?.childArgument ?? 'I was helping Mrs. Chen carry her groceries inside. I didn\'t have my phone on me to call.',
    proposedAlternative: appeal?.proposedAlternative ?? 'Vacuuming the living room instead',
    evidenceCount: 1,
  };

  const decisionConfig = {
    approved: { bg: 'bg-green-500', text: 'Appeal Approved', icon: 'check_circle' },
    denied: { bg: 'bg-red-500', text: 'Appeal Denied', icon: 'cancel' },
    negotiate: { bg: 'bg-[#4c8ce6]', text: 'Negotiation Opened', icon: 'forum' },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <BackHeader title="Review Appeal" backTo="/more/appeal" />

      {/* Decision banner */}
      {decision && (
        <div className={`${decisionConfig[decision].bg} text-white px-4 py-3 flex items-center gap-2`}>
          <span className="material-symbols-outlined text-lg">{decisionConfig[decision].icon}</span>
          <p className="text-sm font-semibold">Decision: {decisionConfig[decision].text}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-24 px-4">
        {/* Case summary card */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                Case #{appealData.caseId} &bull; {appealData.child}
              </p>
              <p className="font-bold text-slate-800 text-sm">{appealData.charge}</p>
            </div>
            <span className="bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-100 flex-shrink-0 ml-2">
              Pending Review
            </span>
          </div>
        </div>

        {/* Original consequence card */}
        <div className="mt-3 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-400 text-2xl">no_photography</span>
          <div>
            <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-0.5">Original Consequence</p>
            <p className="font-bold text-slate-800 text-sm">{appealData.consequence}</p>
          </div>
        </div>

        {/* Child's Argument */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">Child's Argument</h3>
          <div className="bg-white rounded-2xl border-l-4 border-[#4c8ce6] border border-slate-100 p-4">
            <blockquote className="text-sm text-slate-600 italic leading-relaxed">
              &ldquo;{appealData.childArgument}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Proposed Alternative */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">Proposed Alternative</h3>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4c8ce6] text-xl">swap_horiz</span>
            <p className="text-sm text-slate-700">{appealData.proposedAlternative}</p>
          </div>
        </div>

        {/* Evidence card */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">Evidence</h3>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f6f7f8] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-slate-400 text-xl">photo_camera</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{appealData.evidenceCount} attachment submitted</p>
              <p className="text-xs text-slate-400 mt-0.5">Tap to view</p>
            </div>
            <span className="material-symbols-outlined text-slate-300 text-base ml-auto">chevron_right</span>
          </div>
        </div>

        {/* Decision buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setDecision('approved')}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              decision === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            ✓ Approve Appeal
          </button>

          <button
            onClick={() => setDecision('denied')}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all ${
              decision === 'denied'
                ? 'bg-red-50 border-red-500 text-red-600'
                : 'bg-white border-red-500 text-red-600'
            }`}
          >
            <span className="material-symbols-outlined text-lg">cancel</span>
            ✗ Deny Appeal
          </button>

          <button
            onClick={() => setDecision('negotiate')}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              decision === 'negotiate'
                ? 'bg-[#3a7bd5] text-white'
                : 'bg-[#4c8ce6] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">forum</span>
            💬 Open Negotiation
          </button>
        </div>

        {/* Decision confirmation */}
        {decision && (
          <div className={`mt-4 ${decisionConfig[decision].bg} text-white rounded-2xl p-4 text-center`}>
            <span className="material-symbols-outlined text-3xl mb-1 block">{decisionConfig[decision].icon}</span>
            <p className="font-bold text-base">{decisionConfig[decision].text}</p>
            <p className="text-sm text-white/80 mt-0.5">Your decision has been recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
}
