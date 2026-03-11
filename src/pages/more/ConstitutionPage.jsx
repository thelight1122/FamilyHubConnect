import BackHeader from '../../components/BackHeader';
import { constitution } from '../../data/mockData';

export default function ConstitutionPage() {
  const missionText =
    constitution?.mission ??
    'We, the Thompson Family, commit to growing together with love, honesty, and curiosity — supporting each other through every adventure life brings.';

  const coreValues = [
    { label: 'Kindness', icon: 'favorite', bg: 'bg-rose-50', color: 'text-rose-500', border: 'border-rose-100' },
    { label: 'Honesty', icon: 'verified_user', bg: 'bg-blue-50', color: 'text-blue-500', border: 'border-blue-100' },
    { label: 'Curiosity', icon: 'lightbulb', bg: 'bg-amber-50', color: 'text-amber-500', border: 'border-amber-100' },
  ];

  const rules = constitution?.rules ?? [
    'Respect each other\'s feelings and personal space.',
    'No screens during family dinner time.',
    'Everyone contributes to household chores.',
    'We resolve conflicts with calm conversations.',
    'Celebrate each other\'s wins, big and small.',
  ];

  const avatarColors = ['bg-[#4c8ce6]', 'bg-rose-400', 'bg-amber-400', 'bg-green-400'];
  const avatarInitials = ['D', 'S', 'L', 'E'];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <BackHeader title="Family Constitution" rightIcon="history" />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Parchment-style hero */}
        <div className="mx-4 mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
            Thompson Family Mission
          </p>
          <p className="text-slate-700 text-sm italic leading-relaxed">
            &ldquo;{missionText}&rdquo;
          </p>
        </div>

        {/* Core Values */}
        <div className="mt-5">
          <h2 className="text-base font-bold text-slate-800 px-4 mb-3">Core Values</h2>
          <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-hide">
            {coreValues.map((value) => (
              <div
                key={value.label}
                className={`flex-shrink-0 w-28 ${value.bg} border ${value.border} rounded-2xl p-4 flex flex-col items-center gap-2`}
              >
                <span className={`material-symbols-outlined ${value.color} text-3xl`}>{value.icon}</span>
                <p className={`text-xs font-bold ${value.color}`}>{value.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Family Rules */}
        <div className="px-4 mt-5">
          <h2 className="text-base font-bold text-slate-800 mb-3">Family Rules</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 px-4 py-3.5 ${idx < rules.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-slate-400 w-4 text-right">{idx + 1}.</span>
                  <span className="material-symbols-outlined text-[#4c8ce6] text-lg">check_circle</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signatories */}
        <div className="px-4 mt-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Signatories</p>
              <p className="text-sm font-semibold text-slate-700">All members signed ✓</p>
            </div>
            <div className="flex items-center">
              {avatarInitials.map((initial, idx) => (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded-full ${avatarColors[idx]} flex items-center justify-center border-2 border-white text-white text-xs font-bold ${idx > 0 ? '-ml-2' : ''}`}
                  style={{ zIndex: avatarInitials.length - idx }}
                >
                  {initial}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Propose Amendment button */}
        <div className="px-4 mt-4 mb-4">
          <button className="w-full border border-[#4c8ce6] text-[#4c8ce6] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm bg-white">
            <span className="material-symbols-outlined text-lg">edit_document</span>
            Propose Amendment
          </button>
        </div>
      </div>
    </div>
  );
}
