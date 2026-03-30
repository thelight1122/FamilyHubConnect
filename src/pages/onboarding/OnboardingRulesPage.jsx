import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';

const PRESET_RULES = [
  { id: 1, text: 'No phones at dinner', icon: 'no_sim' },
  { id: 2, text: 'Bedtime at 9 PM', icon: 'bedtime' },
  { id: 3, text: 'Homework before screens', icon: 'menu_book' },
  { id: 4, text: 'Tidy room daily', icon: 'cleaning_services' },
];

export default function OnboardingRulesPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [checked, setChecked] = useState([1, 2]);
  const [customRule, setCustomRule] = useState('');
  const [rules, setRules] = useState(PRESET_RULES);

  const toggleRule = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addCustomRule = () => {
    if (customRule.trim()) {
      const newRule = { id: Date.now(), text: customRule.trim(), icon: 'rule' };
      setRules((prev) => [...prev, newRule]);
      setChecked((prev) => [...prev, newRule.id]);
      setCustomRule('');
    }
  };

  const handleFinish = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto flex items-center p-4 justify-between">
          <div 
            onClick={() => navigate(-1)}
            className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Family Hub Connect</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full flex-1 flex flex-col pb-24">
        {/* Progress Bar Section */}
        <div className="flex flex-col gap-3 p-6">
          <div className="flex gap-6 justify-between items-end">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold uppercase tracking-wider">Onboarding Progress</p>
            <p className="text-primary text-sm font-bold">2 of 3</p>
          </div>
          <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '66%' }}></div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Next: Invite Family</p>
        </div>

        {/* Header Content */}
        <div className="px-6 pb-6">
          <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold leading-tight mb-2">Step 2: Household Rules</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Set initial rules for your family to keep everyone on the same page. You can always adjust these later.
          </p>
        </div>

        {/* Suggested Rules List */}
        <div className="px-6 space-y-4">
          <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tips_and_updates</span>
            Suggested Rules
          </h3>
          <div className="space-y-3">
            {rules.map((rule) => {
              const isChecked = checked.includes(rule.id);
              return (
                <label 
                  key={rule.id}
                  className={`flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border shadow-sm transition-all cursor-pointer group ${
                    isChecked ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleRule(rule.id);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{rule.icon}</span>
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{rule.text}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    readOnly
                    className="w-6 h-6 rounded-full border-slate-300 text-primary focus:ring-primary pointer-events-none" 
                  />
                </label>
              );
            })}
          </div>

          {/* Add Custom Rule Input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={customRule}
              onChange={(e) => setCustomRule(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomRule()}
              placeholder="Type a custom rule..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={addCustomRule}
              className="bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">These rules will be shared with the whole family once they join the hub.</p>
          </div>
        </div>
      </main>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-md mx-auto flex gap-4">
          <button 
            onClick={() => navigate('/onboarding/values')}
            className="flex-1 py-4 px-6 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Back
          </button>
          <button 
            onClick={() => navigate('/onboarding/invite')}
            className="flex-[2] py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            Next: Invite Family
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
