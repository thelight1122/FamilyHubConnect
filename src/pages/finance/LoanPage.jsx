import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentMember } from '../../data/selectors';
import { paths } from '../../config/paths';

export default function LoanPage() {
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

      {isParentView ? <ParentLoanView navigate={navigate} /> : <ChildLoanPitchView navigate={navigate} />}
    </div>
  );
}

// ----------------------------------------------------------------------------
// PARENT LOAN VIEW (Review & Repayments)
// ----------------------------------------------------------------------------
function ParentLoanView({ navigate }) {
  const loans = [];
  const pitches = [];

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center bg-white/90 dark:bg-slate-900/90 p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="text-slate-600 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined block">arrow_back</span>
        </button>
        <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold flex-1 text-center pr-10">Active Loans</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Repayment Tracking</h2>
          {loans.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="material-symbols-outlined text-3xl text-slate-300">payments</span>
              <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No live loans entered</p>
              <p className="mt-1 text-xs font-medium text-slate-400">Loan records will appear here after family entry.</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Pending Pitches ({pitches.length})</h2>
          {pitches.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="material-symbols-outlined text-3xl text-slate-300">description</span>
              <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No live pitches submitted</p>
              <p className="mt-1 text-xs font-medium text-slate-400">Submitted family pitches will be listed here for review.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// CHILD LOAN PITCH VIEW (Pitch Request)
// ----------------------------------------------------------------------------
function ChildLoanPitchView({ navigate }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 shadow-xl max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-600 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined block">arrow_back</span>
        </button>
        <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold flex-1 text-center pr-10">Pitch Your Idea</h1>
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col gap-2 p-6 bg-primary/5 dark:bg-primary/10">
        <div className="flex justify-between items-center">
          <p className="text-primary text-[11px] font-bold uppercase tracking-widest">Step 1 of 4: The Vision</p>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">25% Complete</p>
        </div>
        <div className="h-2 w-full bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-primary/10">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        
        {/* Section 1: The Goal */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 border border-primary/20 text-primary p-2.5 rounded-xl shadow-inner">
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <h2 className="text-[19px] font-bold tracking-tight">What's your big idea?</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed">Tell your parents what you're borrowing for. Be descriptive!</p>
          <div className="relative">
            <textarea 
              className="w-full min-h-[120px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent p-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm shadow-sm transition-all focus:bg-white" 
              placeholder="Describe the funding request..."
            ></textarea>
          </div>
        </section>

        {/* Section 2: Amount & Type */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Amount Needed</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
              <input 
                className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary text-sm font-bold shadow-sm transition-all focus:bg-white" 
                placeholder="0.00" 
                step="0.01" 
                type="number"
              />
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</label>
            <select className="w-full py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary text-sm font-bold shadow-sm transition-all focus:bg-white appearance-none">
              <option>Education & Tools</option>
              <option>Fun & Hobby</option>
              <option>Emergency</option>
              <option>Other</option>
            </select>
          </div>
        </section>

        {/* Interest Rate Helper */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4 flex gap-4 shadow-sm">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <h4 className="text-[13px] font-bold text-primary tracking-wide">Interest Rate Suggestion</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Education loans usually have 0% interest! Fun loans might have a small fee of 2%.</p>
          </div>
        </div>

        {/* Section 3: Repayment Plan */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 border border-primary/20 text-primary p-2.5 rounded-xl shadow-inner">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <h2 className="text-[19px] font-bold tracking-tight">The Payback Plan</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer bg-white dark:bg-slate-800 hover:border-primary/50 hover:shadow-sm transition-all">
              <input className="text-primary focus:ring-primary w-5 h-5 border-slate-300" name="payback" type="radio" defaultChecked />
              <span className="ml-3 text-[14px] font-bold">Weekly Allowance Deductions</span>
            </label>
            <label className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer bg-white dark:bg-slate-800 hover:border-primary/50 hover:shadow-sm transition-all">
              <input className="text-primary focus:ring-primary w-5 h-5 border-slate-300" name="payback" type="radio" />
              <div className="ml-3">
                <span className="block text-[14px] font-bold">Extra Chores</span>
                <span className="text-xs text-slate-500 font-medium">Mowing the lawn, washing the car, etc.</span>
              </div>
            </label>
          </div>
        </section>

        {/* Educational Tip */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm mb-4">
          <span className="material-symbols-outlined text-amber-500 text-2xl drop-shadow-sm">lightbulb</span>
          <p className="text-[13px] text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="block mb-0.5 font-bold tracking-wide">PRO TIP</strong> A good pitch shows you've thought about how to pay it back! Parents love to see a responsible plan.
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 pt-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20">
        <button 
          onClick={() => navigate(paths.financeLoanConfirmation)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span className="text-[15px] tracking-wide">Submit Pitch to Parents</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
}
