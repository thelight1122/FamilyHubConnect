import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PRESET_RULES = [
  { id: 1, text: '📵 No phones at dinner' },
  { id: 2, text: '🌙 Bedtime at 9 PM' },
  { id: 3, text: '📚 Homework before screens' },
  { id: 4, text: '🧹 Tidy room daily' },
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
      const newRule = { id: Date.now(), text: customRule.trim() };
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
    <div className="bg-[#f6f7f8] min-h-dvh max-w-md mx-auto flex flex-col">
      {/* Progress Bar */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500">Step 2 of 3</p>
          <p className="text-xs font-semibold text-[#4c8ce6]">66%</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-[#4c8ce6] h-2 rounded-full transition-all"
            style={{ width: '66%' }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="px-4 pb-5">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Set Your Household Rules</h1>
        <p className="text-slate-500 text-sm">Choose the rules your family will live by</p>
      </div>

      {/* Rules Checklist */}
      <div className="px-4 flex-1">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 overflow-hidden">
          {rules.map((rule, index) => {
            const isChecked = checked.includes(rule.id);
            return (
              <button
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 ${
                  index < rules.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl shrink-0 ${
                    isChecked ? 'text-[#4c8ce6]' : 'text-slate-300'
                  }`}
                >
                  {isChecked ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <p
                  className={`text-sm font-medium ${
                    isChecked ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {rule.text}
                </p>
              </button>
            );
          })}
        </div>

        {/* Add Custom Rule */}
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-700 mb-2">Add Custom Rule</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRule}
              onChange={(e) => setCustomRule(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomRule()}
              placeholder="Type a custom rule..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4c8ce6] focus:border-transparent"
            />
            <button
              onClick={addCustomRule}
              className="bg-[#4c8ce6] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#3b7bd4] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Info Callout */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2 mb-6">
          <span className="material-symbols-outlined text-blue-400 text-lg mt-0.5 shrink-0">info</span>
          <p className="text-sm text-blue-700">
            These rules can be updated anytime from the Family Constitution.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-slate-200 bg-white flex gap-3">
        <button
          onClick={() => navigate('/onboarding/values')}
          className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          className="flex-1 py-4 rounded-2xl bg-[#4c8ce6] text-white font-bold hover:bg-[#3b7bd4] transition-colors"
        >
          Finish Setup →
        </button>
      </div>
    </div>
  );
}
