import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VALUES = [
  { id: 'kindness', label: 'Kindness', icon: 'favorite', color: 'rose' },
  { id: 'respect', label: 'Respect', icon: 'handshake', color: 'blue' },
  { id: 'honesty', label: 'Honesty', icon: 'verified_user', color: 'emerald' },
  { id: 'curiosity', label: 'Curiosity', icon: 'lightbulb', color: 'amber' },
  { id: 'resilience', label: 'Resilience', icon: 'fitness_center', color: 'orange' },
  { id: 'courage', label: 'Courage', icon: 'shield', color: 'violet' },
];

const COLOR_MAP = {
  rose: 'text-rose-500',
  blue: 'text-blue-500',
  emerald: 'text-emerald-500',
  amber: 'text-amber-500',
  orange: 'text-orange-500',
  violet: 'text-violet-500',
};

export default function OnboardingValuesPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(['kindness', 'honesty']);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="bg-[#f6f7f8] min-h-dvh max-w-md mx-auto flex flex-col">
      {/* Progress Bar */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500">Step 1 of 3</p>
          <p className="text-xs font-semibold text-[#4c8ce6]">33%</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-[#4c8ce6] h-2 rounded-full transition-all"
            style={{ width: '33%' }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="px-4 pb-5">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Choose Your Core Values</h1>
        <p className="text-slate-500 text-sm">Select values that define your family</p>
      </div>

      {/* Values Grid */}
      <div className="px-4 flex-1">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {VALUES.map((value) => {
            const isSelected = selected.includes(value.id);
            return (
              <button
                key={value.id}
                onClick={() => toggle(value.id)}
                className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-[#4c8ce6] bg-[#4c8ce6]/5'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Checkbox Icon */}
                <span
                  className={`absolute top-2 right-2 material-symbols-outlined text-lg ${
                    isSelected ? 'text-[#4c8ce6]' : 'text-slate-300'
                  }`}
                >
                  {isSelected ? 'check_box' : 'check_box_outline_blank'}
                </span>

                {/* Value Icon */}
                <span
                  className={`material-symbols-outlined text-4xl ${COLOR_MAP[value.color]}`}
                >
                  {value.icon}
                </span>

                {/* Label */}
                <p
                  className={`text-sm font-semibold ${
                    isSelected ? 'text-[#4c8ce6]' : 'text-slate-700'
                  }`}
                >
                  {value.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Add Custom Value */}
        <button className="w-full border-2 border-dashed border-slate-300 rounded-2xl py-4 text-sm font-semibold text-slate-500 hover:border-[#4c8ce6] hover:text-[#4c8ce6] transition-colors mb-6">
          + Add Custom Value
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-slate-200 bg-white flex gap-3">
        <button
          onClick={() => navigate('/login')}
          className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => navigate('/onboarding/rules')}
          className="flex-1 py-4 rounded-2xl bg-[#4c8ce6] text-white font-bold hover:bg-[#3b7bd4] transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
