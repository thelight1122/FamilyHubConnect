import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

const VALUE_OPTIONS = [
  { name: 'Kindness',   icon: 'favorite',      subtitle: 'Empathy & Care',    defaultSelected: true  },
  { name: 'Respect',    icon: 'handshake',      subtitle: 'Honor others',      defaultSelected: false },
  { name: 'Honesty',    icon: 'verified_user',  subtitle: 'Truthfulness',      defaultSelected: true  },
  { name: 'Curiosity',  icon: 'lightbulb',      subtitle: 'Love of learning',  defaultSelected: false },
  { name: 'Resilience', icon: 'fitness_center', subtitle: 'Staying strong',    defaultSelected: false },
  { name: 'Courage',    icon: 'shield',         subtitle: 'Brave actions',     defaultSelected: false },
];

export default function OnboardingValuesPage() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [selectedValues, setSelectedValues] = useState(
    VALUE_OPTIONS.filter(v => v.defaultSelected).map(v => v.name)
  );
  const [customOptions, setCustomOptions] = useState([]);
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const allOptions = [...VALUE_OPTIONS, ...customOptions];

  function toggleValue(name) {
    setSelectedValues(prev =>
      prev.includes(name) ? prev.filter(v => v !== name) : [...prev, name]
    );
  }

  function handleAddCustom() {
    const trimmed = customValue.trim();
    if (!trimmed) return;
    if (allOptions.some(o => o.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('That value already exists.');
      return;
    }
    const newOption = { name: trimmed, icon: 'star', subtitle: 'Custom value', defaultSelected: true };
    setCustomOptions(prev => [...prev, newOption]);
    setSelectedValues(prev => [...prev, trimmed]);
    setCustomValue('');
    setShowCustomInput(false);
  }

  function handleContinue() {
    // TODO: POST selected values to /api/onboarding/values
    navigate(paths.onboardingRules);
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Core Values
        </h2>
        <div className="size-10" />
      </div>

      {/* Progress Section */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-slate-700 text-sm font-semibold uppercase tracking-wider">
            Onboarding Progress
          </p>
          <p className="text-primary text-sm font-bold">1 of 3</p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: '33%' }} />
        </div>
      </div>

      {/* Hero Text */}
      <div className="px-4 pt-6 pb-4">
        <h3 className="text-slate-900 tracking-tight text-2xl font-bold leading-tight">
          Step 1 of 3: Core Values
        </h3>
        <p className="text-slate-600 text-base font-normal leading-relaxed mt-2">
          Select the values that define your family. These will form the foundation of your Family Constitution.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {allOptions.map(({ name, icon, subtitle }) => {
          const isSelected = selectedValues.includes(name);
          return (
            <button
              key={name}
              onClick={() => toggleValue(name)}
              className="relative flex flex-col gap-3 pb-3 text-left group cursor-pointer"
            >
              {/* Selected check indicator */}
              {isSelected && (
                <span className="absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                  <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px', lineHeight: 1 }}>
                    check
                  </span>
                </span>
              )}
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center border-2 transition-all group-hover:bg-primary/20 ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent bg-primary/10'
                }`}
              >
                <span className="material-symbols-outlined text-primary text-4xl">{icon}</span>
              </div>
              <div>
                <p className="text-slate-900 text-base font-semibold">{name}</p>
                <p className="text-slate-500 text-xs">{subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Custom Value */}
      <div className="px-4 pt-2">
        {showCustomInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customValue}
              onChange={e => setCustomValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
              placeholder="Enter custom value…"
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
              onClick={() => { setShowCustomInput(false); setCustomValue(''); }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Add Custom Value
          </button>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto p-4 flex gap-3 bg-white border-t border-slate-100 sticky bottom-0">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-[2] px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Continue
        </button>
      </div>
      <div className="h-6 bg-white" />
    </div>
  );
}
