import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';

export default function ResolutionConfirmedPage() {
  const navigate = useNavigate();

  const caseData = {
    child: "Leo",
    summaryText: "Leo's screen time reflection has been resolved with washing all dinner dishes tonight and a half-day screen adjustment starting after his project."
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Top Bar */}
      <div className="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <div className="text-emerald-500 flex size-12 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined text-3xl">task_alt</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Resolution Confirmed</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Celebration Header */}
        <div className="px-4 pb-3 pt-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="mx-auto w-16 h-16 inline-flex items-center justify-center bg-emerald-500/10 rounded-full mb-4 ring-8 ring-emerald-500/5">
            <span className="material-symbols-outlined text-emerald-500 text-4xl">celebration</span>
          </div>
          <h1 className="tracking-tight text-[32px] font-bold leading-tight mb-2">Agreement Reached!</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal">
            Fairness win! Thanks for working together to find a solution.
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-4 mt-2">
          <div className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all hover:shadow-md">
            <div 
              className="w-full h-40 bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&q=80&w=800')" }}
            ></div>
            <div className="flex w-full flex-col gap-2 p-5">
              <p className="text-primary text-xs font-bold uppercase tracking-wider">Resolution Summary</p>
              <p className="text-slate-800 dark:text-slate-200 text-[15px] font-medium leading-relaxed">
                {caseData.summaryText}
              </p>
            </div>
          </div>
        </div>

        {/* Updated Terms Section */}
        <div className="px-4 py-4 mt-2">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Updated Terms</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="size-12 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-2xl">skillet</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[15px]">Chore: Dinner Dishes</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">Due: Tonight, 7:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="size-12 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <span className="material-symbols-outlined text-2xl">hourglass_top</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[15px]">Screen Time Reflection</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">Reduced to 4 hours total today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps / Automation Status */}
        <div className="px-4 py-6">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/20 shadow-inner">
            <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Automation Status</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-500 shrink-0">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300 text-[13px] font-bold">Task added to Chore Hub</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-500 shrink-0">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300 text-[13px] font-bold">Screen time limit updated in Router Control</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-500 shrink-0">check_circle</span>
                <span className="text-slate-700 dark:text-slate-300 text-[13px] font-bold">Notification sent to {caseData.child} and Parents</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions (Sticky Bottom) */}
      <div className="p-4 pt-4 flex flex-col gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 sticky bottom-0">
        <button 
          onClick={() => navigate(paths.dashboard)}
          className="w-full bg-primary hover:bg-primary/90 hover:scale-[0.99] active:scale-95 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20"
        >
          Back to Dashboard
        </button>
        <button 
          onClick={() => navigate(paths.moreCourt)}
          className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl transition-colors border border-transparent shadow-sm"
        >
          View Reflections
        </button>
      </div>
    </div>
  );
}
