import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../../components/BackHeader';
import { appeal } from '../../data/mockData';

export default function AppealPage() {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [alternative, setAlternative] = useState('');
  const [learned, setLearned] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const consequence = {
    label: 'Active Consequence',
    title: typeof appeal?.consequence === 'string' ? appeal.consequence : '1-day screen time ban',
    reason: appeal?.reason ?? 'Came home 15 minutes past curfew without notifying parents.',
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length > 0) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    if (!reason.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
        <BackHeader title="Submit Appeal" backTo="/more" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-24">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-green-500" style={{ fontSize: '40px' }}>check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Appeal Submitted!</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Your appeal is pending parent review. You'll be notified once a decision is made.
          </p>
          <div className="w-full bg-white rounded-2xl border border-slate-100 p-4 text-left mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">What happens next</p>
            <div className="space-y-2">
              {['Parent reviews your case', 'Decision made within 24 hours', "You'll receive a notification"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4c8ce6] text-base">arrow_right</span>
                  <p className="text-sm text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/more')}
            className="w-full bg-[#4c8ce6] text-white font-semibold py-3.5 rounded-2xl text-sm"
          >
            Back to More
          </button>
        </div>
      </div>
    );
  }

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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Proposed Alternative</label>
            <input
              type="text"
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              placeholder="e.g. Extra chores this weekend"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4c8ce6]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What I've Learned</label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Evidence (Optional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 bg-white hover:border-[#4c8ce6] transition-colors"
            >
              {attachedFile ? (
                <>
                  <span className="material-symbols-outlined text-[#4c8ce6] text-4xl">attach_file</span>
                  <p className="text-sm text-[#4c8ce6] font-semibold truncate max-w-full px-4">{attachedFile}</p>
                  <p className="text-xs text-slate-400">Tap to change</p>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-slate-300 text-4xl">upload_file</span>
                  <p className="text-sm text-slate-400 font-medium">Tap to add files</p>
                  <p className="text-xs text-slate-300">Photos, screenshots, or documents</p>
                </>
              )}
            </button>
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
            disabled={!reason.trim()}
            className="w-full bg-[#4c8ce6] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-sm disabled:opacity-50"
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
