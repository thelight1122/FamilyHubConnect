import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../../components/BackHeader';
import { finances } from '../../data/mockData';

export default function LoanPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  const loan = finances.loans[0];
  const progress = Math.round((loan.paid / loan.amount) * 100);

  const handleSubmit = () => {
    navigate('/finance/loan/confirmation');
  };

  return (
    <div className="min-h-dvh bg-[#f6f7f8]">
      <BackHeader title="Family Bank" backTo="/finance" />

      {/* Balance Card */}
      <div className="bg-[#4c8ce6] text-white rounded-2xl mx-4 mt-4 p-5">
        <p className="text-sm font-medium text-white/80 mb-1">Family Balance</p>
        <p className="text-4xl font-black mb-1">
          ${finances.totalSavings.toLocaleString()}
        </p>
        <p className="text-sm text-white/70">0% interest on all family loans</p>
      </div>

      {/* My Active Loans */}
      <div className="mx-4 mt-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">My Active Loans</h2>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-slate-800">{loan.name}</p>
              <p className="text-sm text-slate-500">${loan.amount} loan</p>
            </div>
            <span className="text-xs bg-blue-50 text-[#4c8ce6] px-2 py-1 rounded-full font-medium">
              Active
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{loan.borrower} paid ${loan.paid}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="bg-[#4c8ce6] h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              <span className="material-symbols-outlined text-sm align-middle mr-1">calendar_today</span>
              {loan.due} target
            </p>
            <button className="bg-[#4c8ce6] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#3b7bd4] transition-colors">
              Make Payment
            </button>
          </div>
        </div>
      </div>

      {/* Request New Loan */}
      <div className="bg-slate-50 rounded-2xl p-4 mx-4 mt-6 border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Request New Loan</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4c8ce6] focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="What is this loan for?"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4c8ce6] focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#4c8ce6] text-white font-bold py-3 rounded-xl hover:bg-[#3b7bd4] transition-colors"
        >
          Submit Request
        </button>
      </div>

      {/* Loan History */}
      <div className="mx-4 mt-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Loan History</h2>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Bicycle Helmet</p>
              <p className="text-sm text-slate-500">$75</p>
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
              Paid Off
            </span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mx-4 mt-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-3">How It Works</h2>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#4c8ce6] mt-0.5">check_circle</span>
            <p className="text-sm text-slate-700">Request a loan and parents will review and approve it.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#4c8ce6] mt-0.5">check_circle</span>
            <p className="text-sm text-slate-700">Repayments are automatically deducted from your weekly allowance.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#4c8ce6] mt-0.5">check_circle</span>
            <p className="text-sm text-slate-700">All family loans are 0% interest — no hidden fees ever.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
