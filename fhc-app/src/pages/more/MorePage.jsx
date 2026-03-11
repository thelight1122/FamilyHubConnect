import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { familyMembers } from '../../data/mockData';

export default function MorePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const features = [
    { label: 'Family Constitution', route: '/more/constitution', icon: 'gavel', bg: 'bg-violet-50', color: 'text-violet-600' },
    { label: 'Family Timeline', route: '/more/timeline', icon: 'timeline', bg: 'bg-rose-50', color: 'text-rose-500' },
    { label: 'Pet Hub', route: '/more/pets', icon: 'pets', bg: 'bg-amber-50', color: 'text-amber-500' },
    { label: 'Health Logs', route: '/more/health', icon: 'health_and_safety', bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Family Court', route: '/more/court', icon: 'gavel', bg: 'bg-orange-50', color: 'text-orange-500' },
    { label: "Creator's Studio", route: '/more/creator', icon: 'auto_fix_high', bg: 'bg-blue-50', color: 'text-blue-500' },
    { label: 'Family Governance', route: '/more/governance', icon: 'balance', bg: 'bg-indigo-50', color: 'text-indigo-600' },
  ];

  const accountItems = [
    { label: 'Profile Settings', icon: 'manage_accounts', route: null },
    { label: 'Invite Family', icon: 'group_add', route: '/invite' },
    { label: 'Notifications', icon: 'notifications', route: null },
  ];

  const avatarColors = ['bg-[#4c8ce6]', 'bg-rose-400', 'bg-amber-400', 'bg-green-400'];
  const avatarInitials = ['D', 'S', 'L', 'E'];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white">
        <h1 className="text-2xl font-bold text-slate-800">More</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f7f8]">
          <span className="material-symbols-outlined text-slate-600">settings_applications</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Family profile card */}
        <div className="mx-4 mt-4 bg-white border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            {/* Overlapping avatars */}
            <div className="flex items-center">
              {avatarInitials.map((initial, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-full ${avatarColors[idx]} flex items-center justify-center border-2 border-white text-white text-sm font-bold ${idx > 0 ? '-ml-3' : ''}`}
                  style={{ zIndex: avatarInitials.length - idx }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">Thompson Family</p>
              <p className="text-xs text-slate-400 mt-0.5">4 members</p>
            </div>
            <button className="border border-[#4c8ce6] text-[#4c8ce6] text-xs font-semibold px-3 py-1.5 rounded-lg">
              View Profile
            </button>
          </div>
        </div>

        {/* Features grid */}
        <div className="px-4 mt-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Family Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <button
                key={feature.route}
                onClick={() => navigate(feature.route)}
                className={`bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 text-left hover:border-slate-200 transition-all ${
                  idx === features.length - 1 && features.length % 2 !== 0 ? 'col-span-2' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${feature.color} text-xl`}>{feature.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-tight">{feature.label}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-base flex-shrink-0">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* Account section */}
        <div className="mt-5 px-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Account</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {accountItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => item.route && navigate(item.route)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#f6f7f8] transition-all ${idx < accountItems.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <span className="material-symbols-outlined text-slate-400 text-xl">{item.icon}</span>
                <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
                <span className="material-symbols-outlined text-slate-300 text-base">chevron_right</span>
              </button>
            ))}

            {/* Divider */}
            <div className="border-t border-slate-200 mx-4" />

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 transition-all"
            >
              <span className="material-symbols-outlined text-red-400 text-xl">logout</span>
              <span className="flex-1 text-sm font-medium text-red-500">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
