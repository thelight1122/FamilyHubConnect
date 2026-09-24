import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VALUES = [
  { id: 'kindness', label: 'Kindness', desc: 'Empathy & Care', icon: 'favorite' },
  { id: 'respect', label: 'Respect', desc: 'Honor others', icon: 'handshake' },
  { id: 'honesty', label: 'Honesty', desc: 'Truthfulness', icon: 'verified_user' },
  { id: 'curiosity', label: 'Curiosity', desc: 'Love of learning', icon: 'lightbulb' },
  { id: 'resilience', label: 'Resilience', desc: 'Staying strong', icon: 'fitness_center' },
  { id: 'courage', label: 'Courage', desc: 'Brave actions', icon: 'shield' },
];

export default function OnboardingValuesPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(['kindness', 'respect', 'curiosity']);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-slate-900 shadow-xl overflow-x-hidden">
        
        {/* Header */}
        <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <div 
            onClick={() => navigate(-1)}
            className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Core Values</h2>
          <div className="size-10"></div>
        </div>

        {/* Progress Section */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between items-center">
            <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wider">Onboarding Progress</p>
            <p className="text-primary text-sm font-bold">2 of 4</p>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="px-4 pt-4 pb-4">
          <h3 className="tracking-tight text-2xl font-bold leading-tight">Step 2: Core Values</h3>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed mt-2">
            Select the values that define your family. These will form the foundation of your Family Constitution.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {VALUES.map((value) => {
            const isSelected = selected.includes(value.id);
            return (
              <label key={value.id} className="relative flex flex-col gap-3 pb-3 group cursor-pointer" onClick={(e) => {
                  e.preventDefault();
                  toggle(value.id);
                }}>
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  readOnly
                  className="peer absolute top-2 right-2 z-10 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary pointer-events-none" 
                />
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center border-2 transition-all ${
                  isSelected ? 'bg-primary/20 border-primary' : 'bg-primary/5 dark:bg-primary/10 border-transparent group-hover:bg-primary/20'
                }`}>
                  <span className="material-symbols-outlined text-primary text-4xl">{value.icon}</span>
                </div>
                <div>
                  <p className="text-base font-semibold">{value.label}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{value.desc}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Add Custom Value */}
        <div className="px-4 pt-2 mb-8">
          <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Add Custom Value
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-auto p-4 flex gap-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0">
          <button 
            onClick={() => navigate('/onboarding/setup')}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Back
          </button>
          <button 
            onClick={() => navigate('/onboarding/rules')}
            className="flex-[2] px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Next: Rules
          </button>
        </div>
      </div>
    </div>
  );
}
