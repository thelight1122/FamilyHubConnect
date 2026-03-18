import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

const SUGGESTED_RULES = [
  { id: 'phones',   icon: 'no_sim',           label: 'No phones at dinner',   defaultOn: true  },
  { id: 'bedtime',  icon: 'bedtime',           label: 'Bedtime at 9 PM',       defaultOn: true  },
  { id: 'homework', icon: 'menu_book',         label: 'Homework before screens', defaultOn: false },
  { id: 'tidy',     icon: 'cleaning_services', label: 'Tidy room daily',       defaultOn: false },
];

export default function OnboardingRulesPage() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  // All suggested rules toggled on by default (keyed by rule id)
  const [selectedRules, setSelectedRules] = useState(() => {
    const initial = {};
    SUGGESTED_RULES.forEach(r => { initial[r.id] = r.defaultOn; });
    return initial;
  });

  const [customRules, setCustomRules] = useState([]);
  const [customRule, setCustomRule] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  function toggleSuggestedRule(id) {
    setSelectedRules(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleCustomRule(label) {
    setSelectedRules(prev => ({ ...prev, [label]: !prev[label] }));
  }

  function handleAddCustom() {
    const trimmed = customRule.trim();
    if (!trimmed) return;
    const allLabels = [
      ...SUGGESTED_RULES.map(r => r.label.toLowerCase()),
      ...customRules.map(r => r.toLowerCase()),
    ];
    if (allLabels.includes(trimmed.toLowerCase())) {
      showToast('That rule already exists.');
      return;
    }
    setCustomRules(prev => [...prev, trimmed]);
    setSelectedRules(prev => ({ ...prev, [trimmed]: true }));
    setCustomRule('');
    setShowCustomInput(false);
  }

  function handleContinue() {
    // TODO: POST rules to /api/onboarding/rules
    navigate(paths.invite);
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white shadow-xl overflow-x-hidden">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Top Navigation */}
      <header className="bg-white sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-md mx-auto flex items-center p-4 justify-between">
          <button
            onClick={() => navigate(paths.onboardingValues)}
            className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Family Hub Connect
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full flex-1 flex flex-col pb-24">
        {/* Progress Bar Section */}
        <div className="flex flex-col gap-3 p-6">
          <div className="flex gap-6 justify-between items-end">
            <p className="text-slate-900 text-sm font-semibold uppercase tracking-wider">
              Onboarding Progress
            </p>
            <p className="text-primary text-sm font-bold">2 of 3</p>
          </div>
          <div className="rounded-full bg-slate-200 h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '66%' }} />
          </div>
          <p className="text-slate-500 text-xs font-medium">Next: Invite Family</p>
        </div>

        {/* Header Content */}
        <div className="px-6 pb-6">
          <h2 className="text-slate-900 text-3xl font-extrabold leading-tight mb-2">
            Step 2 of 3: Household Rules
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Set initial rules for your family to keep everyone on the same page. You can always adjust these later.
          </p>
        </div>

        {/* Suggested Rules List */}
        <div className="px-6 space-y-4">
          <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tips_and_updates</span>
            Suggested Rules
          </h3>

          <div className="space-y-3">
            {SUGGESTED_RULES.map(({ id, icon, label }) => (
              <label
                key={id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <span className="font-medium text-slate-800">{label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!selectedRules[id]}
                  onChange={() => toggleSuggestedRule(id)}
                  className="w-6 h-6 rounded-full border-slate-300 text-primary focus:ring-primary"
                />
              </label>
            ))}

            {/* Custom rules */}
            {customRules.map(label => (
              <label
                key={label}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">star</span>
                  </div>
                  <span className="font-medium text-slate-800">{label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!selectedRules[label]}
                  onChange={() => toggleCustomRule(label)}
                  className="w-6 h-6 rounded-full border-slate-300 text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>

          {/* Add Custom Rule */}
          {showCustomInput ? (
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={customRule}
                onChange={e => setCustomRule(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                placeholder="Enter custom rule…"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={handleAddCustom}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => { setShowCustomInput(false); setCustomRule(''); }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Add Custom Rule
            </button>
          )}
        </div>

        {/* Info Banner */}
        <div className="px-6 py-8">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-sm text-slate-600 leading-tight">
              These rules will be shared with the whole family once they join the hub.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-4">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            onClick={() => navigate(paths.onboardingValues)}
            className="flex-1 py-4 px-6 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-[2] py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            Continue
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
