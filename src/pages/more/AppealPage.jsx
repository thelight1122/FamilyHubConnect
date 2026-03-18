import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

// TODO: POST appeal to /api/appeals

export default function AppealPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [reason, setReason] = useState('');
  const [alternative, setAlternative] = useState('');
  const [learned, setLearned] = useState('');
  const [fileName, setFileName] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light">
        <BackHeader title="Submit Appeal" backTo={paths.more} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-24">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <span
              className="material-symbols-outlined text-green-500"
              style={{ fontSize: '40px' }}
            >
              check_circle
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Appeal Submitted!</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Your appeal is pending parent review. You'll be notified once a decision is made.
          </p>
          <div className="w-full bg-white rounded-2xl border border-slate-100 p-4 text-left mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
              What happens next
            </p>
            <div className="space-y-2">
              {[
                'Parent reviews your case',
                'Decision made within 24 hours',
                "You'll receive a notification",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    arrow_right
                  </span>
                  <p className="text-sm text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate(paths.more)}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl text-sm"
          >
            Back to More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <BackHeader title="Submit Appeal" backTo={paths.more} />

      <div className="flex-1 overflow-y-auto pb-24 px-4">
        {/* Consequence Details */}
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-primary text-xs font-bold uppercase tracking-wider">
                Active Consequence
              </p>
              <p className="text-slate-900 text-lg font-bold leading-tight">
                1-day screen time ban
              </p>
              <p className="text-slate-600 text-sm font-normal">
                Reason: Missing curfew by 15 mins
              </p>
            </div>
            <div className="w-20 h-20 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-4xl">no_photography</span>
            </div>
          </div>
        </div>

        <div className="my-4 h-px bg-slate-100 w-full" />

        {/* Reason for Appeal */}
        <div className="py-3">
          <label className="flex flex-col gap-2">
            <p className="text-slate-900 text-base font-semibold">
              Reason for Appeal <span className="text-red-400">*</span>
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain your side of the story here..."
              className="w-full min-h-[120px] resize-none rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </label>
        </div>

        {/* Proposed Alternative */}
        <div className="py-3">
          <label className="flex flex-col gap-2">
            <p className="text-slate-900 text-base font-semibold">Proposed Alternative</p>
            <input
              type="text"
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              placeholder="e.g., Extra chore instead"
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </label>
        </div>

        {/* What I've Learned */}
        <div className="py-3">
          <label className="flex flex-col gap-2">
            <p className="text-slate-900 text-base font-semibold">What I've learned from this</p>
            <textarea
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="Reflect on the situation..."
              className="w-full min-h-[100px] resize-none rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </label>
        </div>

        {/* Evidence Upload */}
        <div className="py-3 pb-8">
          <p className="text-slate-900 text-base font-semibold mb-2">Evidence / Attachments</p>
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            onChange={(e) => setFileName(e.target.files[0]?.name)}
          />
          <div
            onClick={() => fileRef.current.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mb-2 text-3xl">
              upload_file
            </span>
            {fileName ? (
              <>
                <p className="text-primary text-sm font-semibold truncate max-w-full px-4">
                  {fileName}
                </p>
                <p className="text-slate-400 text-xs mt-1">Tap to change</p>
              </>
            ) : (
              <>
                <p className="text-slate-600 text-sm">Tap to upload photo or file</p>
                <p className="text-slate-400 text-xs mt-1">(e.g., Proof of finished homework)</p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pb-4">
          <button
            onClick={() => setSubmitted(true)}
            disabled={!reason.trim()}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            Submit Appeal
          </button>
          <button
            onClick={() => navigate(paths.more)}
            className="w-full h-12 bg-transparent text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
