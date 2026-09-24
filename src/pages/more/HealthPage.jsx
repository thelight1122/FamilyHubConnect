import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

const EVENT_TYPES = ['Illness', 'Injury', 'Doctor Visit', 'Medication Change', 'Other'];

export default function HealthPage() {
  const [showModal, setShowModal] = useState(false);
  const [logType, setLogType] = useState('Illness');
  const [logNote, setLogNote] = useState('');
  const [toast, showToast] = useToast();

  const handleSave = () => {
    setShowModal(false);
    setLogNote('');
    showToast('Health event logged!');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
      <BackHeader title="Health Logs" backTo={paths.more} />

      {/* Profile Header Section */}
      <div className="flex p-4">
        <div className="flex w-full flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/10">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <div className="flex flex-col">
              <p className="text-slate-900 text-2xl font-bold leading-tight tracking-tight">Family Member</p>
              <p className="text-slate-500 text-sm font-normal leading-normal">No live health logs yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Log New Event Action Card */}
      <div className="px-4 py-2">
        <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-slate-900 text-base font-bold leading-tight">Log New Event</p>
            <p className="text-slate-500 text-sm font-normal leading-normal">Record symptoms, fever, or injuries</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold leading-normal hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm mr-1">add</span>
            <span className="truncate">Add Log</span>
          </button>
        </div>
      </div>

      {/* Medication Tracker Section */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Medication Tracker</h3>
          <button className="text-primary text-sm font-semibold">View All</button>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-slate-300">pill</span>
            <p className="mt-2 text-sm font-bold text-slate-600">No live medications entered</p>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="px-4 pt-8">
        <h3 className="text-slate-900 text-lg font-bold leading-tight tracking-tight mb-4">Recent History</h3>
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
          <div className="relative flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-slate-300 z-10">
              <span className="material-symbols-outlined text-slate-400 text-xl">description</span>
            </div>
            <div className="flex flex-col gap-1 pb-6">
              <p className="text-slate-900 font-bold">No live health history entered</p>
              <p className="text-slate-600 text-sm">Health events will appear here after entry.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="px-4 py-8 mb-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex gap-2 items-start text-slate-500">
            <span className="material-symbols-outlined text-lg">info</span>
            <p className="text-xs leading-relaxed">
              <strong>Disclaimer:</strong> This application is for personal tracking and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom-sheet Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Sheet */}
          <div
            className="relative w-full max-w-md bg-white rounded-t-2xl p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />

            <h3 className="text-slate-900 text-lg font-bold mb-4">Log Health Event</h3>

            {/* Event type pills */}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Event Type</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {EVENT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setLogType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    logType === type
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Notes textarea */}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
            <textarea
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              rows={3}
              placeholder="Describe symptoms, treatment, or observations…"
              value={logNote}
              onChange={e => setLogNote(e.target.value)}
            />

            {/* Save button */}
            <button
              onClick={handleSave}
              className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
            >
              Save Log
            </button>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
