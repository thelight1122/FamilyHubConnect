import { useNavigate } from 'react-router-dom';
import { currentMember } from '../../data/selectors';
import { emptyFinance } from '../../data/liveData';
import { paths } from '../../config/paths';
import { useState } from 'react';
import useToast from '../../hooks/useToast';
import Toast from '../../components/Toast';

export default function FinancePage() {
  const navigate = useNavigate();

  // Temporary toggle to review both prototypes easily.
  // Real implementation would rely solely on `currentMember.role`
  const [isParentView, setIsParentView] = useState(currentMember.role === 'parent');
  const [toast, showToast] = useToast();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col pb-24">
      <Toast message={toast} />
      {/* Dev Toggle (Prototype Only) */}
      <div className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 p-2 text-xs flex justify-center gap-4 border-b border-yellow-500/30">
        <span className="font-bold">Prototype Toggle:</span>
        <button className={`font-bold ${isParentView ? 'underline' : ''}`} onClick={() => setIsParentView(true)}>Parent View</button>
        <button className={`font-bold ${!isParentView ? 'underline' : ''}`} onClick={() => setIsParentView(false)}>Child View</button>
      </div>

      <header className="flex items-center p-4 border-b border-slate-200 dark:border-slate-800 justify-between sticky top-[36px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40">
        <div 
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          {isParentView ? 'Family Bank' : `${currentMember.name}'s Wallet`}
        </h2>
        <div className="flex w-10 items-center justify-end">
          {isParentView ? (
            <button
              onClick={() => showToast('Bank settings will activate after live bank records are configured.')}
              aria-label="Bank settings"
              className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-transparent transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          ) : (
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">emoji_events</span>
            </button>
          )}
        </div>
      </header>

      {isParentView ? <ParentBankView navigate={navigate} /> : <ChildWalletView navigate={navigate} />}
    </div>
  );
}

// ----------------------------------------------------------------------------
// PARENT BANK VIEW
// ----------------------------------------------------------------------------
function ParentBankView({ navigate }) {
  const pendingPitches = [];
  const activeLoans = [];

  return (
    <main className="flex-1 overflow-y-auto">
      <section className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-2xl p-5 bg-[#ec5b13] text-white shadow-lg shadow-[#ec5b13]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
            <p className="text-white/90 text-sm font-bold leading-normal uppercase tracking-wider">Shared Pool</p>
          </div>
          <p className="text-white tracking-tight text-3xl font-extrabold leading-tight">$0.00</p>
          <p className="text-white/80 text-xs font-medium">No live deposits recorded</p>
        </div>
        <div 
          onClick={() => navigate(paths.financeLoan)}
          className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500 text-sm">payments</span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-normal uppercase tracking-wider">Active Loans</p>
          </div>
          <p className="text-slate-900 dark:text-slate-100 tracking-tight text-3xl font-extrabold leading-tight">$0.00</p>
          <p className="text-[#ec5b13] text-xs font-bold">0 Total Borrowers</p>
        </div>
      </section>

      <section className="px-4 py-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">Pending Loan Pitches</h3>
          <span className="bg-[#ec5b13]/10 text-[#ec5b13] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">{pendingPitches.length} New</span>
        </div>
        <div className="space-y-3">
          {pendingPitches.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="material-symbols-outlined text-3xl text-slate-300">request_quote</span>
              <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No live pitches submitted</p>
              <p className="mt-1 text-xs font-medium text-slate-400">Family loan pitches will appear here after entry.</p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-6">
        <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight mb-4">Active Loans</h3>
        <div className="grid grid-cols-1 gap-4">
          {activeLoans.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="material-symbols-outlined text-3xl text-slate-300">payments</span>
              <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No live loans entered</p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-6 bg-slate-100 dark:bg-slate-900/50 mt-4 rounded-t-3xl border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4 pt-2">
          <span className="material-symbols-outlined text-[#ec5b13]">tune</span>
          <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">Bank Settings</h3>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Interest Rates</p>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800">
            No live banking settings entered.
          </div>
        </div>
      </section>
    </main>
  );
}

// ----------------------------------------------------------------------------
// CHILD WALLET VIEW
// ----------------------------------------------------------------------------
function ChildWalletView({ navigate }) {
  const transactions = emptyFinance.recentActivity;

  return (
    <main className="flex-1 max-w-md mx-auto w-full pb-24">
      {/* Balance Card */}
      <section className="p-6 pb-2 text-center animate-in slide-in-from-bottom-2 fade-in duration-500">
        <div className="relative inline-block mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-primary p-1 bg-white dark:bg-slate-800 shadow-xl shadow-primary/10">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-5xl">person</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-400 text-white p-2 rounded-full shadow-lg flex items-center justify-center border-2 border-white dark:border-background-dark">
            <span className="material-symbols-outlined text-[16px]">verified</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-5xl font-extrabold text-primary tracking-tighter drop-shadow-sm">$0.00</p>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] pt-1">Current Balance</p>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold mt-3">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>Live wallet ready</span>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="mx-4 my-6 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transform transition-all hover:shadow-md">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Next Payout</h3>
          <span className="material-symbols-outlined text-primary">schedule</span>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-700">
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">--</p>
            <p className="text-[10px] font-bold tracking-wider text-primary uppercase mt-1">Days</p>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-700">
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">--</p>
            <p className="text-[10px] font-bold tracking-wider text-primary uppercase mt-1">Hrs</p>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-700">
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">--</p>
            <p className="text-[10px] font-bold tracking-wider text-primary uppercase mt-1">Min</p>
          </div>
        </div>
        <p className="text-center text-[11px] font-bold text-slate-400 mt-4 italic">No live payout schedule entered.</p>
      </section>

      {/* Savings Goal */}
      <section className="mx-4 mb-6 p-6 bg-gradient-to-br from-primary to-blue-600 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Active Savings Goal</p>
              <h3 className="text-[22px] font-extrabold tracking-tight">No live goal entered</h3>
            </div>
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
              <span className="material-symbols-outlined text-3xl text-white">pedal_bike</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold tracking-wider">
              <span className="text-white/90">$0.00 / $0.00</span>
              <span className="text-white">0%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden p-[2px]">
              <div className="bg-white h-full rounded-full w-0 relative">
                {/* Shine effect */}
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
          <button className="mt-5 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[13px] font-bold tracking-wide uppercase transition-all active:scale-[0.98]">
            View Details
          </button>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4 mx-4 mb-6">
        <button 
          onClick={() => navigate(paths.financeLoan)}
          className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 gap-3 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all scale-100 group-active:scale-95 shadow-inner">
            <span className="material-symbols-outlined text-2xl">request_quote</span>
          </div>
          <span className="font-bold text-[13px] tracking-wide">Request Funds</span>
        </button>
        <button onClick={() => navigate(paths.financeMarket)} className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 gap-3 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all group">
          <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all scale-100 group-active:scale-95 shadow-inner">
            <span className="material-symbols-outlined text-2xl">query_stats</span>
          </div>
          <span className="font-bold text-[13px] tracking-wide">Market Sim</span>
        </button>
      </section>

      {/* Recent Transactions */}
      <section className="mx-4">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-lg tracking-tight">Recent Transactions</h3>
          <button className="text-primary text-[11px] font-bold uppercase tracking-wider hover:underline">See All</button>
        </div>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="material-symbols-outlined text-3xl text-slate-300">receipt_long</span>
              <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No transactions yet</p>
            </div>
          ) : transactions.slice(0,3).map((item) => {
            const isPositive = item.amount > 0;
            return (
              <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${isPositive ? 'bg-green-50 dark:bg-green-500/10 text-green-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[15px] text-slate-800 dark:text-slate-100 truncate">{item.label}</p>
                  <p className="text-[11px] text-slate-500 font-bold tracking-wide mt-0.5">{item.date}</p>
                </div>
                <p className={`font-black text-right tracking-tight ${isPositive ? 'text-green-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {isPositive ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
