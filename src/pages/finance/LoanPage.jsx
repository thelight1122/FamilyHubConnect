import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

export default function LoanPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !purpose) return;
    navigate(paths.financeLoanConfirmation);
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-xl overflow-hidden font-display text-slate-900">
      <BackHeader title="Family Bank" backTo={paths.finance} />

      {/* TODO: fetch active loans from /api/loans */}
      <main className="w-full p-4 space-y-6 pb-24">
        {/* Welcome Card */}
        <div className="bg-primary rounded-xl p-6 text-white shadow-lg shadow-primary/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-medium">Available Balance</p>
              <h1 className="text-4xl font-bold mt-1">$125.50</h1>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              LEVEL 5 SAVER
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button className="flex-1 bg-white text-primary py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Request Fund
            </button>
            <button className="flex-1 bg-black/10 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">history</span>
              History
            </button>
          </div>
        </div>

        {/* Savings Match Section */}
        <section>
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="text-lg font-bold">Savings Match</h3>
            <span className="text-primary text-sm font-bold">Parents&apos; Boost</span>
          </div>
          <div className="bg-white rounded-xl p-4 border border-primary/10 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <span className="material-symbols-outlined text-3xl">handshake</span>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Match Earned</p>
              <p className="text-xl font-bold text-slate-900">+$42.00</p>
              <p className="text-xs text-slate-400 mt-1">Mom &amp; Dad matched 50% of your savings!</p>
            </div>
          </div>
        </section>

        {/* Active Loans Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center mb-1 px-1">
            <h3 className="text-lg font-bold">My Active Loans</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>

          {/* Loan Card */}
          <div className="bg-white rounded-xl p-4 border border-primary/10 shadow-sm">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">directions_bike</span>
                <p className="font-bold">New Mountain Bike</p>
              </div>
              <p className="text-primary font-bold">65% Paid</p>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
              <div className="bg-primary h-full rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <p className="text-slate-500">
                Next payment: <span className="text-slate-900 font-bold">Oct 15</span>
              </p>
              <p className="text-slate-500">
                Remaining: <span className="text-slate-900 font-bold">$35.00</span>
              </p>
            </div>
          </div>

          {/* Pitch a New Loan — decorative CTA + form */}
          <div className="w-full bg-primary/10 border-2 border-dashed border-primary/30 py-4 rounded-xl flex flex-col items-center justify-center gap-2">
            <div className="bg-primary text-white p-2 rounded-full">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <span className="font-bold text-primary">Pitch a New Loan</span>
            <span className="text-xs text-primary/60">Need something big? Convince the Bank!</span>
          </div>

          {/* New Loan Request Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-3">
            <h4 className="font-bold text-base">New Loan Request</h4>
            <div>
              <label htmlFor="loan-amount" className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                Amount ($)
              </label>
              <input
                id="loan-amount"
                type="number"
                min="1"
                placeholder="e.g. 200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label htmlFor="loan-purpose" className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                Purpose
              </label>
              <input
                id="loan-purpose"
                type="text"
                placeholder="e.g. New mountain bike"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="submit"
              disabled={!amount || !purpose}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              Submit Loan Request
            </button>
          </form>
        </section>

        {/* Money School Shortcut */}
        <section>
          <div className="bg-slate-900 rounded-xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-white text-lg font-bold mb-1">Money School</h3>
              <p className="text-slate-400 text-sm mb-4">Complete &quot;The Magic of Interest&quot; to earn $5.00!</p>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
                Start Learning
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <span className="material-symbols-outlined text-8xl text-white">school</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
