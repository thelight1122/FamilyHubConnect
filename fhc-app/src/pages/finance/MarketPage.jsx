import { useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { portfolio } from '../../data/mockData';

export default function MarketPage() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (stock, action) => {
    setSelected({ stock, action });
  };

  const dismissSelection = () => setSelected(null);

  return (
    <div className="min-h-screen bg-background-light pb-24">
      <BackHeader title="Market Simulator" />

      <div className="px-4 pt-4 space-y-4">
        {/* Portfolio value card */}
        <div className="bg-primary text-white rounded-2xl p-5">
          <p className="text-sm font-medium opacity-80 mb-1">My Portfolio</p>
          <p className="text-3xl font-bold tracking-tight">
            PM${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-2">
            <span className="text-xs font-semibold bg-green-400/30 text-green-100 border border-green-300/30 rounded-full px-2.5 py-0.5">
              +{portfolio.change}% today
            </span>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900">Portfolio Performance</h3>
            <span className="text-xs text-slate-400 font-medium">Last 7 days</span>
          </div>
          <svg
            viewBox="0 0 300 120"
            className="w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            <line x1="0" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="70" x2="300" y2="70" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="40" x2="300" y2="40" stroke="#f1f5f9" strokeWidth="1" />
            {/* Filled area under line */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4c8ce6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4c8ce6" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d="M0 90 L50 82 L100 75 L150 65 L175 70 L200 55 L230 48 L260 38 L300 25 L300 110 L0 110 Z"
              fill="url(#chartGradient)"
            />
            {/* Line */}
            <path
              d="M0 90 L50 82 L100 75 L150 65 L175 70 L200 55 L230 48 L260 38 L300 25"
              fill="none"
              stroke="#4c8ce6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* End dot */}
            <circle cx="300" cy="25" r="4" fill="#4c8ce6" />
          </svg>
        </div>

        {/* Daily Tip */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5">💡</span>
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            Ice Cream Inc is trending up this week! Great time to buy?
          </p>
        </div>

        {/* Selected banner */}
        {selected && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              <p className="text-sm font-semibold text-green-800">
                {selected.action === 'buy' ? 'Buying' : 'Selling'}{' '}
                <span className="font-bold">{selected.stock.name}</span> ({selected.stock.ticker})
              </p>
            </div>
            <button
              onClick={dismissSelection}
              className="text-green-600 hover:text-green-800"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        {/* Stocks list */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-base font-bold text-slate-900">My Stocks</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {portfolio.stocks.map((stock) => (
              <div
                key={stock.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderLeft: `4px solid ${stock.color}` }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{stock.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{stock.ticker} · {stock.shares} shares</p>
                </div>
                <div className="text-right mr-3">
                  <p className="text-sm font-bold text-slate-900">${stock.price.toFixed(2)}</p>
                  <p className={`text-xs font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handleSelect(stock, 'buy')}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => handleSelect(stock, 'sell')}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-500 shrink-0">info</span>
          <p className="text-sm text-slate-500 font-medium">
            This is a learning simulation. No real money involved.
          </p>
        </div>
      </div>
    </div>
  );
}
