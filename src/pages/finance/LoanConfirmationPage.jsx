import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentMember } from '../../data/selectors';
import { paths } from '../../config/paths';

export default function LoanConfirmationPage() {
  const navigate = useNavigate();
  // Using role to switch views, plus a dev toggle for prototype
  const [isParentView, setIsParentView] = useState(currentMember.role === 'parent');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col pb-24">
      {/* Dev Toggle (Prototype Only) */}
      <div className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 p-2 text-xs flex justify-center gap-4 border-b border-yellow-500/30">
        <span className="font-bold">Prototype Toggle:</span>
        <button className={`font-bold ${isParentView ? 'underline' : ''}`} onClick={() => setIsParentView(true)}>Parent View</button>
        <button className={`font-bold ${!isParentView ? 'underline' : ''}`} onClick={() => setIsParentView(false)}>Child View</button>
      </div>

      {isParentView ? <ParentReviewPitchView navigate={navigate} /> : <ChildLoanApprovalView navigate={navigate} />}
    </div>
  );
}

// ----------------------------------------------------------------------------
// PARENT REVIEW VIEW (Loan Pitch Approval)
// ----------------------------------------------------------------------------
function ParentReviewPitchView({ navigate }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 shadow-xl max-w-md mx-auto w-full">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="text-slate-900 dark:text-slate-100 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined block">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold ml-2">Review Loan Pitch</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Child Pitch Summary */}
        <section className="p-6 flex flex-col items-center border-b border-slate-50 dark:border-slate-800">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#ec5b13]/20 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#ec5b13]/10 text-[#ec5b13]">
                <span className="material-symbols-outlined text-4xl">person</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-[#ec5b13] text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
              <span className="material-symbols-outlined text-xs block">verified</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-[#ec5b13]">$0.00</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No live pitch selected</p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="px-6 py-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">The Vision</h3>
          <div className="bg-[#ec5b13]/5 dark:bg-[#ec5b13]/10 p-4 rounded-xl border-l-4 border-[#ec5b13]">
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed italic">
              No live pitch details have been submitted yet.
            </p>
          </div>
        </section>

        {/* Loan Details Grid */}
        <section className="px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Loan Details</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ec5b13]">category</span>
                <span className="text-slate-600 dark:text-slate-300">Category</span>
              </div>
              <span className="font-semibold">Not entered</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ec5b13]">payments</span>
                <span className="text-slate-600 dark:text-slate-300">Payback Plan</span>
              </div>
              <span className="font-semibold text-right">Not entered</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ec5b13]">calendar_today</span>
                <span className="text-slate-600 dark:text-slate-300">Target Date</span>
              </div>
              <span className="font-semibold text-right">Not entered</span>
            </div>
          </div>
        </section>

        {/* AI Insight Card */}
        <section className="px-6 py-4">
          <div className="bg-slate-900 dark:bg-[#ec5b13]/20 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#ec5b13]/20 rounded-full blur-xl"></div>
            <div className="flex gap-3 items-start relative z-10">
              <span className="material-symbols-outlined text-[#ec5b13] shrink-0">auto_awesome</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ec5b13] mb-1">AI Insight</p>
                <p className="text-sm text-slate-200 dark:text-slate-100 leading-snug">
                  Insight will appear after a live loan pitch is submitted.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence Section */}
        <section className="px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Evidence & Attachments</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="shrink-0 w-full h-24 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-600">
              <span className="material-symbols-outlined text-slate-400">description</span>
              <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold">No live attachments</span>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Action Footer */}
      <footer className="fixed bottom-0 max-w-md w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 pb-8 space-y-3 z-20">
        <button className="w-full bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2" onClick={() => navigate(paths.finance)}>
          <span className="material-symbols-outlined">check_circle</span>
          Approve Loan
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-1 py-3 px-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">chat_bubble</span>
            Negotiate
          </button>
          <button className="flex items-center justify-center gap-1 py-3 px-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Deny
          </button>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------------
// CHILD LOAN APPROVAL VIEW (Confirmation after parent approval)
// ----------------------------------------------------------------------------
function ChildLoanApprovalView({ navigate }) {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-background-dark min-h-screen flex flex-col shadow-xl w-full">
      {/* Top App Bar */}
      <div className="flex items-center p-4 justify-between sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-primary/10">
        <div onClick={() => navigate(-1)} className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-[19px] font-bold leading-tight tracking-tight flex-1 text-center pr-12">Loan Status</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Hero Image */}
        <div className="px-4 py-4">
          <div className="flex min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary/20 bg-primary/10 text-primary shadow-sm">
            <span className="material-symbols-outlined text-5xl">request_quote</span>
            <p className="mt-2 text-sm font-bold">No live approval recorded</p>
          </div>
        </div>

        {/* Amount Display */}
        <div className="text-center px-4 pt-4">
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Total Approved</span>
          <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-[54px] font-extrabold leading-none pb-2 mt-1">$0.00</h1>
        </div>

        {/* Personalized Message */}
        <div className="px-6 text-center mb-8">
          <h3 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-tight pb-2 mt-2">Awaiting live approval</h3>
          <p className="text-slate-600 dark:text-slate-400 text-[15px] font-medium leading-relaxed">Approved family loan details will appear here after review.</p>
        </div>

        {/* Terms Summary Card */}
        <div className="mx-4 bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10 mb-8 shadow-sm">
          <h4 className="text-primary font-bold text-sm mb-5 flex items-center gap-2 tracking-wide">
            <span className="material-symbols-outlined text-[18px]">info</span>
            LOAN TERMS
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Interest Rate</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-[15px]">Not entered</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Repayment Method</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-[15px]">Not entered</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Target Completion</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-[15px]">Not entered</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="px-6 mb-8">
          <h4 className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-5 tracking-tight">Next Steps</h4>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              </div>
              <div className="pt-0.5">
                <p className="text-slate-900 dark:text-slate-100 font-bold text-[15px]">Funds Transfer</p>
                <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-0.5 font-medium leading-relaxed">No live transfer has been recorded.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <div className="pt-0.5">
                <p className="text-slate-900 dark:text-slate-100 font-bold text-[15px]">Scheduled Repayment</p>
                <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-0.5 font-medium leading-relaxed">No live repayment schedule has been recorded.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-4 mt-8 pb-4">
          <button 
            onClick={() => navigate(paths.finance)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-[15px] tracking-wide"
          >
            Back to Family Bank
            <span className="material-symbols-outlined">home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
