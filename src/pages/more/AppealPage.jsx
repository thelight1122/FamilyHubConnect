import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    reason: appeal?.reason ?? 'Missing curfew by 15 mins',
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
      <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
        {/* TopAppBar Component */}
        <div className="flex items-center p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div 
            onClick={() => navigate('/more')}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Submit Appeal</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-24">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800">
            <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Appeal Submitted!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Your appeal is pending parent review. You'll be notified once a decision is made.
          </p>
          <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-left mb-6">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">What happens next</p>
            <div className="space-y-3">
              {['Parent reviews your case', 'Decision made within 24 hours', "You'll receive a notification"].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-base">arrow_right_alt</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => navigate('/more')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Back to More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* TopAppBar Component */}
      <div className="flex items-center p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div 
          onClick={() => navigate(-1)}
          className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Submit Appeal</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Consequence Details Section */}
        <div className="px-4 pt-6 pb-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Consequence Details</h3>
          <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-primary text-xs font-bold uppercase tracking-wider">{consequence.label}</p>
                <p className="text-lg font-bold leading-tight">{consequence.title}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-normal">Reason: {consequence.reason}</p>
              </div>
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-3xl">no_photography</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
        </div>

        {/* Reason for Appeal */}
        <div className="px-4 py-3">
          <label className="flex flex-col gap-2">
            <p className="text-base font-semibold">
              Reason for Appeal <span className="text-red-400">*</span>
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px] p-4 text-base font-normal outline-none transition-colors"
              placeholder="Explain your side of the story here..."
            ></textarea>
          </label>
        </div>

        {/* Proposed Alternative */}
        <div className="px-4 py-3">
          <label className="flex flex-col gap-2">
            <p className="text-base font-semibold">Proposed Alternative</p>
            <input
              type="text"
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              className="form-input flex w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary px-4 text-base font-normal outline-none transition-colors leading-normal"
              placeholder="e.g., Extra chore instead"
            />
          </label>
        </div>

        {/* Impact / Learning */}
        <div className="px-4 py-3">
          <label className="flex flex-col gap-2">
            <p className="text-base font-semibold">What I've learned from this</p>
            <textarea
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] p-4 text-base font-normal outline-none transition-colors"
              placeholder="Reflect on the situation..."
            ></textarea>
          </label>
        </div>

        {/* Evidence / Attachments */}
        <div className="px-4 py-3 pb-8">
          <p className="text-base font-semibold mb-2">Evidence / Attachments</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
          >
            {attachedFile ? (
               <>
                 <span className="material-symbols-outlined text-primary mb-2 text-3xl">attach_file</span>
                 <p className="text-primary text-sm font-semibold truncate max-w-full px-4">{attachedFile}</p>
                 <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Tap to change</p>
               </>
            ) : (
              <>
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary mb-2 text-4xl transition-colors">upload_file</span>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Tap to upload photo or file</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">(e.g., Proof of finished homework)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review as Parent link */}
      <div className="flex justify-center -mt-2 pb-2">
        <button
          onClick={() => navigate('/more/appeal/review')}
          className="text-sm text-primary font-semibold flex items-center gap-1 hover:text-primary/80 transition-colors"
        >
          Review as Parent
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
        <button 
          onClick={handleSubmit}
          disabled={!reason.trim()}
          className="w-full h-14 bg-primary disabled:bg-primary/50 disabled:cursor-not-allowed hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">gavel</span>
          Submit Appeal
        </button>
        <button 
          onClick={() => navigate('/more')}
          className="w-full h-14 bg-transparent text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
