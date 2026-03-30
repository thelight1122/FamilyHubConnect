import { useState } from 'react';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import { portfolio } from '../../data/mockData';

export default function MarketPage() {
  const [localPortfolio, setLocalPortfolio] = useState(() => {
    // Inject a default cash balance for simulation purposes
    const initialCash = 500.00;
    const initialStocksValue = portfolio.stocks.reduce((acc, s) => acc + (s.shares * s.price), 0);
    return {
      ...portfolio,
      cashBalance: initialCash,
      value: initialStocksValue + initialCash // redefine total value to include cash
    };
  });
  
  const [selected, setSelected] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [toast, showToast] = useToast();

  const handleSelect = (stock, action) => {
    setSelected({ stock, action });
    setTradeAmount('');
  };

  const executeTrade = () => {
    const shares = Number(tradeAmount);
    if (!shares || shares <= 0) return;

    const totalCost = shares * selected.stock.price;
    
    // Validations
    if (selected.action === 'buy' && totalCost > localPortfolio.cashBalance) {
      showToast('Insufficient funds');
      return;
    }
    if (selected.action === 'sell' && shares > selected.stock.shares) {
      showToast('Not enough shares to sell');
      return;
    }

    setLocalPortfolio(prev => {
      const updatedStocks = prev.stocks.map(s => {
        if (s.id === selected.stock.id) {
          return {
            ...s,
            shares: selected.action === 'buy' ? s.shares + shares : s.shares - shares
          };
        }
        return s;
      });

      const newCashBalance = selected.action === 'buy' 
        ? prev.cashBalance - totalCost 
        : prev.cashBalance + totalCost;

      const newStocksValue = updatedStocks.reduce((acc, curr) => acc + (curr.shares * curr.price), 0);

      return {
        ...prev,
        stocks: updatedStocks,
        cashBalance: newCashBalance,
        value: newStocksValue + newCashBalance
      };
    });

    showToast(`Successfully ${selected.action === 'buy' ? 'bought' : 'sold'} ${shares} shares of ${selected.stock.ticker}`);
    setSelected(null);
    setTradeAmount('');
  };

  return (
    <div className="min-h-screen bg-background-light pb-24 relative">
      <Toast message={toast} />
      <BackHeader title="Market Simulator" />

      <div className="px-4 pt-4 space-y-4">
        {/* Portfolio Summary */}
        <div className="bg-primary text-white rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">monitoring</span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-1">Total Account Value</p>
            <p className="text-4xl font-black tracking-tight mb-4">
              ${localPortfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs font-semibold text-white/60 mb-0.5">Cash Balance</p>
                <p className="text-lg font-bold">${localPortfolio.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-white/60 mb-0.5">Today's Return</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-400/20 text-emerald-100 border border-emerald-300/20 rounded-lg px-2 py-1">
                  <span className="material-symbols-outlined text-[10px]">trending_up</span>
                  +{localPortfolio.change}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Trade Sheet (Replacing inline selected UI) */}
        {selected && (
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-5 relative overflow-hidden transform transition-all animate-in fade-in slide-in-from-bottom-4">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${selected.action === 'buy' ? 'bg-primary' : 'bg-rose-500'}`}></div>
            
            <div className="flex items-center justify-between mb-5 pt-1">
              <div className="flex items-center gap-3">
                <div 
                  className="size-12 rounded-xl flex items-center justify-center shadow-inner" 
                  style={{ backgroundColor: `${selected.stock.color}15`, color: selected.stock.color }}
                >
                  <span className="material-symbols-outlined text-2xl font-light">
                    {selected.action === 'buy' ? 'add_shopping_cart' : 'payments'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">
                    {selected.action === 'buy' ? 'Buy' : 'Sell'} {selected.stock.ticker}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">@ ${selected.stock.price.toFixed(2)} / share</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelected(null); setTradeAmount(''); }} 
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Shares</label>
                <input 
                  type="number" 
                  value={tradeAmount} 
                  onChange={(e) => setTradeAmount(e.target.value)} 
                  placeholder="0" 
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xl font-black text-slate-800 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex-1 text-right pt-6">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">Est. Value</p>
                <p className={`text-2xl font-black ${selected.action === 'buy' ? 'text-slate-900' : 'text-emerald-600'}`}>
                  ${(Number(tradeAmount || 0) * selected.stock.price).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Available Cash</p>
                <p className="text-sm font-bold text-slate-700">${localPortfolio.cashBalance.toFixed(2)}</p>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-2"></div>
              <div className="flex flex-col text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Shares Owned</p>
                <p className="text-sm font-bold text-slate-700">{selected.stock.shares}</p>
              </div>
            </div>

            <button 
              onClick={executeTrade}
              disabled={
                !tradeAmount || 
                Number(tradeAmount) <= 0 || 
                (selected.action === 'buy' && Number(tradeAmount) * selected.stock.price > localPortfolio.cashBalance) || 
                (selected.action === 'sell' && Number(tradeAmount) > selected.stock.shares)
              }
              className={`w-full text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98] ${
                selected.action === 'buy' 
                  ? 'bg-primary hover:bg-primary-dark shadow-primary/30' 
                  : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
              }`}
            >
              Confirm {selected.action === 'buy' ? 'Buy' : 'Sell'} Order
            </button>
          </div>
        )}

        {/* Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Performance Map</h3>
            <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-1 rounded-md">7 Days</span>
          </div>
          <svg viewBox="0 0 300 120" className="w-full" preserveAspectRatio="xMidYMid meet">
            <line x1="0" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="70" x2="300" y2="70" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="40" x2="300" y2="40" stroke="#f1f5f9" strokeWidth="1" />
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4c8ce6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4c8ce6" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d="M0 90 L50 82 L100 75 L150 65 L175 70 L200 55 L230 48 L260 38 L300 25 L300 110 L0 110 Z" fill="url(#chartGradient)" />
            <path d="M0 90 L50 82 L100 75 L150 65 L175 70 L200 55 L230 48 L260 38 L300 25" fill="none" stroke="#4c8ce6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="300" cy="25" r="4" fill="#4c8ce6" />
          </svg>
        </div>

        {/* Tip */}
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">lightbulb</span>
          <p className="text-sm text-amber-900 font-medium leading-relaxed">
            Diversifying your portfolio helps reduce risk. Try exploring different sectors!
          </p>
        </div>

        {/* Positions List */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="px-4 pt-5 pb-3 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Positions</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {localPortfolio.stocks.map((stock) => (
              <div key={stock.id} className="flex items-center gap-3 px-4 py-4 hover:bg-slate-50/50 transition-colors" style={{ borderLeft: `4px solid ${stock.color}` }}>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-900 truncate">{stock.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{stock.ticker}</span>
                    <span className="text-xs text-slate-400 font-medium">{stock.shares} shares</span>
                  </div>
                </div>
                <div className="text-right mr-2">
                  <p className="text-sm font-black text-slate-900">${stock.price.toFixed(2)}</p>
                  <p className={`text-[11px] font-bold ${stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'} flex items-center justify-end gap-0.5 mt-0.5`}>
                    <span className="material-symbols-outlined text-[10px]">{stock.change >= 0 ? 'trending_up' : 'trending_down'}</span>
                    {Math.abs(stock.change)}%
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 border-l border-slate-100 pl-3">
                  <button 
                    onClick={() => handleSelect(stock, 'buy')} 
                    className="size-8 flex flex-col items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-dark rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                  <button 
                    onClick={() => handleSelect(stock, 'sell')} 
                    className="size-8 flex flex-col items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors"
                    disabled={stock.shares === 0}
                    style={{ opacity: stock.shares === 0 ? 0.3 : 1 }}
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
