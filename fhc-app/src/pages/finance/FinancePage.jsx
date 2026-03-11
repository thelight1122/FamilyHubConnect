import { useNavigate } from 'react-router-dom';
import { familyMembers, finances } from '../../data/mockData';

const tools = [
  { label: 'Allowance', icon: 'payments', color: 'text-primary bg-primary/10', path: null },
  { label: 'Savings Goals', icon: 'savings', color: 'text-green-600 bg-green-50', path: null },
  { label: 'Family Bank', icon: 'account_balance', color: 'text-violet-600 bg-violet-50', path: '/finance/loan' },
  { label: 'Market Sim', icon: 'show_chart', color: 'text-orange-500 bg-orange-50', path: '/finance/market' },
];

const walletMembers = [
  { name: 'Dad', wallet: 8400, avatarIndex: 1 },
  { name: 'Mom', wallet: 12200, avatarIndex: 2 },
  { name: 'Leo', wallet: 450, avatarIndex: 0 },
  { name: 'Sarah', wallet: 530, avatarIndex: 3 },
];

export default function FinancePage() {
  const navigate = useNavigate();

  const getAvatar = (index) => familyMembers[index]?.avatar;

  return (
    <div className="min-h-screen bg-background-light pb-24">
      {/* Page header */}
      <div className="bg-white px-4 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Finance Hub</h1>
        <button className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-1.5 hover:bg-amber-100 transition-colors">
          <span className="material-symbols-outlined text-amber-500 text-base">lightbulb</span>
          <span className="text-xs font-semibold text-amber-700">AI Tip</span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Hero card */}
        <div className="bg-primary text-white rounded-2xl p-5">
          <p className="text-sm font-medium opacity-80 mb-1">Total Family Savings</p>
          <p className="text-4xl font-bold tracking-tight mb-1">$24,580</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5">↑ $1,240 this month</span>
          </div>
        </div>

        {/* AI Tip card */}
        <div className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-amber-100">
          <span className="material-symbols-outlined text-amber-500 text-2xl mt-0.5 shrink-0">lightbulb</span>
          <p className="text-sm text-slate-600 leading-relaxed">
            Try setting up automated savings goals for each family member to build financial discipline!
          </p>
        </div>

        {/* Finance Tools grid */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-base font-bold text-slate-900 mb-3">Finance Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => (
              <button
                key={tool.label}
                onClick={() => tool.path && navigate(tool.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tool.color}`}>
                  <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Member Wallets */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-base font-bold text-slate-900 mb-3">Member Wallets</h3>
          <div className="space-y-3">
            {walletMembers.map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <img
                  src={getAvatar(member.avatarIndex)}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(100, (member.wallet / 12200) * 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900 tabular-nums">
                  ${member.wallet.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-base font-bold text-slate-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {finances.recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.label}</p>
                  <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                </div>
                <p className={`text-sm font-bold tabular-nums ${item.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
