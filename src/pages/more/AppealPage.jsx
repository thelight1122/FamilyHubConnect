import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../../components/BackHeader';
import { appeal } from '../../data/mockData';

export default function AppealPage() {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [alternative, setAlternative] = useState('');
  const [learned, setLearned] = useState('');

  const consequence = {
    label: 'Active Consequence',
    title: typeof appeal?.consequence === 'string' ? appeal.consequence : '1-day screen time ban',
    reason: appeal?.reason ?? 'Came home 15 minutes past curfew without notifying parents.',
  };

  const handleSubmit = () => {
    if (!reason.trim()) return;
    navigate('/more/appeal/review');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <BackHeader title="Submit Appeal" backTo="/more" />

      <div className="flex-1 overflow-y-auto pb-24 px-4">
        {/* Consequence Details card */}
        <div className="mt-4 bg-[#4c8ce6]/5 border border-[#4c8ce6]/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#4c8ce6]/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#4c8ce6] text-3xl">no_photography</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#4c8ce6] uppercase tracking-wide mb-1">{consequence.label}</p>
              <h3 className="text-base font-bold text-slate-800 mb-1">{consequence.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{consequence.reason}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-5 flex flex-col gap-4">
          {/* Reason textarea */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain your side of the story..."
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4c8ce6] resize-none"
            />
          </div>

          {/* Proposed Alternative */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Proposed Alternative
            </label>
            <input
              type="text"
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              placeholder="e.g. Extra chores this weekend"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4c8ce6]"
            />
          </div>

          {/* What I've Learned textarea */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              What I've Learned
            </label>
            <textarea
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="Share what you've reflected on..."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4c8ce6] resize-none"
            />
          </div>

          {/* Evidence upload area */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Evidence (Optional)
            </label>
            <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 bg-white">
              <span className="material-symbols-outlined text-slate-300 text-4xl">upload_file</span>
              <p className="text-sm text-slate-400 font-medium">Tap to add files</p>
              <p className="text-xs text-slate-300">Photos, screenshots, or documents</p>
            </div>
          </div>
        </div>

        {/* Review as Parent link */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate('/more/appeal/review')}
            className="text-sm text-[#4c8ce6] font-semibold flex items-center gap-1"
          >
            Review as Parent
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        {/* Submit + Cancel buttons */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#4c8ce6] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">gavel</span>
            Submit Appeal
          </button>
          <button
            onClick={() => navigate('/more')}
            className="w-full bg-white border border-slate-200 text-slate-500 font-semibold py-3.5 rounded-2xl text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
