import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';

export default function FinancePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center bg-white p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-100">
        <div className="text-primary flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
        </div>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Family Finance
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-50 text-slate-600">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Total Savings Card */}
        {/* TODO: fetch from /api/finance */}
        <div className="p-4">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-primary text-white shadow-lg shadow-primary/20">
            <div className="flex justify-between items-start">
              <p className="opacity-90 text-sm font-medium">Total Family Savings</p>
              <span className="material-symbols-outlined opacity-80">trending_up</span>
            </div>
            <p className="text-3xl font-bold leading-tight tracking-tight">$24,580.00</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">+2.4% this month</span>
            </div>
          </div>
        </div>

        {/* Financial Tip of the Day (AI Powered) */}
        <div className="px-4 pb-4">
          <div className="flex gap-4 rounded-xl p-4 bg-primary/10 border border-primary/20 items-center">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined">lightbulb_circle</span>
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">AI Financial Tip</p>
              <p className="text-sm text-slate-700 leading-snug">
                Setting aside just $5/week for Sarah&apos;s goal could reach the target 2 months earlier!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links / Action Grid */}
        <div className="px-4 py-2">
          <h3 className="text-slate-900 text-base font-bold mb-3">Finance Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-2"
              onClick={() => {/* no-op */}}
            >
              <span className="material-symbols-outlined text-primary">payments</span>
              <span className="text-sm font-semibold">Allowance</span>
            </button>
            <button
              className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-2"
              onClick={() => {/* no-op */}}
            >
              <span className="material-symbols-outlined text-primary">target</span>
              <span className="text-sm font-semibold">Savings Goals</span>
            </button>
            <button
              className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-2"
              onClick={() => navigate(paths.financeLoan)}
            >
              <span className="material-symbols-outlined text-primary">account_balance</span>
              <span className="text-sm font-semibold">Family Bank</span>
            </button>
            <button
              className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-2"
              onClick={() => navigate(paths.financeMarket)}
            >
              <span className="material-symbols-outlined text-primary">monitoring</span>
              <span className="text-sm font-semibold">Market Simulator</span>
            </button>
          </div>
        </div>

        {/* Member Wallets */}
        <div className="pt-6">
          <div className="flex items-center justify-between px-4 pb-2">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">Member Wallets</h3>
            <button className="text-primary text-sm font-semibold">View All</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
            {/* Dad */}
            <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="size-16 rounded-full bg-slate-100 overflow-hidden border-2 border-primary/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Portrait of a smiling middle-aged man"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCHzAmckYooADZpKaH2UZzfS-q1we1IVKibAswbz2GMCsNkWOCwbFb85p5lZftGD2LGCIl29-GJpZt44noQOh9vBAbfzmv4zUaKL_HcppnWgZk8Vk5x6R0AM7re32czMSN1pcMhC-Enm6b2KfeRNpIzPC98jtFW-KnnNfRo8suf35W582jxWC6ZRSCZ3COV4I3qeCYkkJHneMKMpdmS-Qfz1hi3s9qqmX89lqrFrCO05b22THacaBuBsJnB7ydFmMKrclCY37_nZM"
                />
              </div>
              <div className="text-center">
                <p className="text-slate-900 text-sm font-bold">Dad</p>
                <p className="text-primary text-xs font-bold">$8,400</p>
              </div>
            </div>
            {/* Mom */}
            <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="size-16 rounded-full bg-slate-100 overflow-hidden border-2 border-primary/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Portrait of a smiling middle-aged woman"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOBhu7iQP2P4p7ec1T3_FHqy2ZLpWBOssiNxlREpjvjkJV-_y-JDuUm7UQ0NQvkgNh8tQbXIPIoTWMZ9cQqLWRqGdngCgcfLhjmgNM-MtB5jjUAnFRT7jJoPQrPyQhj3Z3uKmajgQGLynYgXfNnHWWsBaT4L7CQKbXn5clnMouEGAo5FLjciiKmmImz7OX8UvSFEsdIxAxLDFQRXhDV8S5ZmilkXDfeTW_vSogo5OqNLr8DoRa38LxA4VBuPSROQp84XpTHFm70KM"
                />
              </div>
              <div className="text-center">
                <p className="text-slate-900 text-sm font-bold">Mom</p>
                <p className="text-primary text-xs font-bold">$12,200</p>
              </div>
            </div>
            {/* Leo */}
            <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="size-16 rounded-full bg-slate-100 overflow-hidden border-2 border-primary/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Portrait of a young teenage boy"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtkM0Kz8TVPiuRxqDjNn33-crPQUMT3MkHVNxNXGTEuym3T1rpaZ12iCWtjA6xOer7eW1SGYP-xp4wmd09AHMyX6F_Zjta6d2wogH7HUdNLYdl3D6l9r9Ho2xr35rvUx4IuhDmtjgIme18QsfsA56SJYelHH_6h5B2xpAf76l8V3uAWCuqrZvikExrstN_Z3W7Ho6zueJpVqkKQet4Muw15unKvs_gE6Cu0eak-IOKitFMBNHw6ezgpvGqNaNBvEFFXQ_drOM49iM"
                />
              </div>
              <div className="text-center">
                <p className="text-slate-900 text-sm font-bold">Leo</p>
                <p className="text-primary text-xs font-bold">$450</p>
              </div>
            </div>
            {/* Sarah */}
            <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="size-16 rounded-full bg-slate-100 overflow-hidden border-2 border-primary/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Portrait of a young teenage girl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1h1WK3gY4N6biYRHC-pOhef4d_ZeFFOLS6ZzmjSlMCSGDVSleiHSHvGtQjHqk63VRbTAhP3JVKs-M0521O1GrpN20vLEW2Svhz6ehvlcfBSz_TtU0vYu0PzfxVyG9Pw9TjK6AfzVulenKO5QY3j8cuKaebNE2yK5wxzW6ijIzD_cFU9SFbg3-PZ5zNaaIU0AYvubIAFPUG1-oWbwmvggDtM6kBNtD2Ul_sla0TMvZRy7sfOeSu8NtbParRs0lQzGk1IYuwF9Pkz0"
                />
              </div>
              <div className="text-center">
                <p className="text-slate-900 text-sm font-bold">Sarah</p>
                <p className="text-primary text-xs font-bold">$530</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Mini-List */}
        {/* TODO: fetch from /api/finance */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-slate-900 text-base font-bold">Recent Activity</h3>
            <button className="text-slate-500 text-xs">See History</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <span className="material-symbols-outlined text-sm">add</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Allowance Added</p>
                  <p className="text-xs text-slate-500">Leo &bull; Yesterday</p>
                </div>
              </div>
              <p className="text-sm font-bold text-green-600">+$20.00</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <span className="material-symbols-outlined text-sm">savings</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Goal Progress</p>
                  <p className="text-xs text-slate-500">Sarah &bull; 2 days ago</p>
                </div>
              </div>
              <p className="text-sm font-bold text-primary">+$15.00</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
