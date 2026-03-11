import { useNavigate } from 'react-router-dom';

export default function LoanConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#f6f7f8] max-w-md mx-auto flex flex-col">
      {/* Top Success Section */}
      <div className="flex flex-col items-center pt-16 pb-8 px-4">
        {/* Success Circle */}
        <div className="size-32 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-green-500 text-6xl">check_circle</span>
        </div>

        {/* Confetti Row */}
        <div className="flex gap-2 text-3xl mb-4">
          <span>🎉</span>
          <span>🎊</span>
          <span>✨</span>
          <span>🎉</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-1">Loan Approved!</h1>
        <p className="text-slate-500 text-base">Congratulations, Leo!</p>
      </div>

      {/* Approved Amount Card */}
      <div className="bg-white rounded-2xl p-5 mx-4 shadow-sm border border-green-100 mb-4">
        <div className="flex flex-col items-center text-center">
          <p className="text-4xl font-black text-green-600 mb-1">$200.00</p>
          <p className="text-lg font-semibold text-slate-700 mb-3">Mountain Bike 🚲</p>
          <p className="text-sm text-slate-500 italic">
            Your loan has been approved by the Thompson Family Bank!
          </p>
        </div>
      </div>

      {/* Loan Terms Card */}
      <div className="bg-slate-50 rounded-2xl mx-4 p-4 mb-4 border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Loan Terms</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
            <div>
              <p className="text-sm font-medium text-slate-700">Interest Rate</p>
              <p className="text-sm text-slate-500">0%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
            <div>
              <p className="text-sm font-medium text-slate-700">Payment</p>
              <p className="text-sm text-slate-500">$10/week from allowance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
            <div>
              <p className="text-sm font-medium text-slate-700">Target Payoff</p>
              <p className="text-sm text-slate-500">October 15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mx-4 mb-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Next Steps</h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-slate-50">
            <div className="flex size-8 shrink-0 items-center justify-center bg-green-100 rounded-full">
              <span className="text-sm font-bold text-green-600">1</span>
            </div>
            <p className="text-sm text-slate-700 flex-1">Funds added to your wallet</p>
            <span className="material-symbols-outlined text-green-500">check_circle</span>
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="flex size-8 shrink-0 items-center justify-center bg-green-100 rounded-full">
              <span className="text-sm font-bold text-green-600">2</span>
            </div>
            <p className="text-sm text-slate-700 flex-1">Automatic $10/week deduction from allowance</p>
            <span className="material-symbols-outlined text-green-500">check_circle</span>
          </div>
        </div>
      </div>

      {/* Back to Family Bank Button */}
      <div className="mx-4 mt-auto mb-8">
        <button
          onClick={() => navigate('/finance')}
          className="w-full bg-[#4c8ce6] text-white font-bold py-4 rounded-2xl hover:bg-[#3b7bd4] transition-colors text-base"
        >
          Back to Family Bank
        </button>
      </div>
    </div>
  );
}
