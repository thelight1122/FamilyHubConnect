import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

export default function MarketPage() {
  const [toast, showToast] = useToast();

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-xl overflow-hidden font-display text-slate-900">
      <BackHeader title="Market Simulator" backTo={paths.finance} />

      {/* TODO: fetch portfolio from /api/market */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Portfolio Overview */}
        <section className="p-4">
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-primary/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium">My Portfolio Value</p>
                <h2 className="text-3xl font-extrabold">$3,420.50 PM</h2>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <span className="material-symbols-outlined text-green-300 text-sm">trending_up</span>
              <p className="text-green-300 font-bold text-sm">+$140.20 (4.2%) Today</p>
            </div>
          </div>
        </section>

        {/* Market Trends Chart */}
        <section className="px-4 py-2">
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-900 text-base font-bold">Family Index</h3>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="h-32 w-full relative">
              {/* Simplified SVG Chart */}
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4c8ce6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4c8ce6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,100 Q40,90 80,95 T160,70 T240,80 T320,40 T400,20 L400,120 L0,120 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0,100 Q40,90 80,95 T160,70 T240,80 T320,40 T400,20"
                  fill="none"
                  stroke="#4c8ce6"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-slate-400 font-bold">MON</span>
              <span className="text-[10px] text-slate-400 font-bold">WED</span>
              <span className="text-[10px] text-slate-400 font-bold">FRI</span>
              <span className="text-[10px] text-primary font-extrabold">SUN</span>
            </div>
          </div>
        </section>

        {/* Learn & Earn */}
        <section className="px-4 py-4">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4">
            <div className="bg-amber-100 size-12 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-600">lightbulb</span>
            </div>
            <div>
              <h4 className="text-amber-900 text-sm font-bold">Leo&apos;s Daily Tip</h4>
              <p className="text-amber-800/80 text-xs leading-relaxed mt-1">
                &quot;What is a Stock?&quot; Think of it like owning a tiny piece of your favorite company! If the company does well, your piece becomes more valuable.
              </p>
            </div>
          </div>
        </section>

        {/* Available Stocks List */}
        <section className="px-4 py-2">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-slate-900 text-[22px] font-bold">Available Stocks</h3>
            <button className="text-primary text-sm font-bold">View all</button>
          </div>
          <div className="space-y-3">
            {/* Stock Item 1 */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="size-12 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-pink-500">icecream</span>
              </div>
              <div className="flex-1">
                <h4 className="text-slate-900 font-bold">Ice Cream Inc</h4>
                <p className="text-slate-400 text-xs font-medium">Sweet Rewards</p>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-bold">$45.20</p>
                <p className="text-green-500 text-xs font-bold">+2.4%</p>
              </div>
            </div>
            {/* Stock Item 2 */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-500">smart_toy</span>
              </div>
              <div className="flex-1">
                <h4 className="text-slate-900 font-bold">Toy Co</h4>
                <p className="text-slate-400 text-xs font-medium">Fun &amp; Games</p>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-bold">$12.10</p>
                <p className="text-red-500 text-xs font-bold">-0.8%</p>
              </div>
            </div>
            {/* Stock Item 3 */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-orange-500">pets</span>
              </div>
              <div className="flex-1">
                <h4 className="text-slate-900 font-bold">Pet Treats Ltd</h4>
                <p className="text-slate-400 text-xs font-medium">Happy Paws</p>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-bold">$88.45</p>
                <p className="text-green-500 text-xs font-bold">+5.1%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Area for Selected Stock (Mocked) */}
        <section className="p-4">
          <div className="bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-medium mb-4">Select a stock to trade</p>
            <div className="flex gap-4">
              <button
                className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                onClick={() => showToast('Order placed — shares purchased!')}
              >
                <span className="material-symbols-outlined text-lg">add_circle</span> Buy
              </button>
              <button
                className="flex-1 bg-white text-primary border-2 border-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                onClick={() => showToast('Shares sold successfully!')}
              >
                <span className="material-symbols-outlined text-lg">remove_circle</span> Sell
              </button>
            </div>
          </div>
        </section>
      </main>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
