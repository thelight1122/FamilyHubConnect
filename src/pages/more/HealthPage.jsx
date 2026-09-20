import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

{/* TODO: fetch health data from /api/health/:memberId */}

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
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 ring-4 ring-primary/10"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDa5zxrqqwTj31VU2KY24dz48oODGdUE00S4bwE9CFiUtLITQvAIFwDZw1afw_t7t7L_aetixV7CRz1gH2dFcOTX_uXUan5hdlrJnot3YTNu-j9JkKlI8Rqp0SEXJbc-5JYevK3rgXCdBrOEGDdmtFJ1vNRNABXOpG9WtvlvwEOLNQgQCeMIaq1n8ljYbCFB3o8qE-UF_62O6r8U10bf5NQZ0zOHPa_F87-yIP45aZtUA5xJzpZ07iLxsQhDvq6_iu8w2e19-NHAL4")' }}
            />
            <div className="flex flex-col">
              <p className="text-slate-900 text-2xl font-bold leading-tight tracking-tight">Leo</p>
              <p className="text-slate-500 text-sm font-normal leading-normal">Last updated: Today, 10:30 AM</p>
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
          {/* Med Item 1 */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">pill</span>
            </div>
            <div className="flex-1">
              <p className="text-slate-900 font-bold text-sm">Amoxicillin</p>
              <p className="text-slate-500 text-xs">5ml • Twice daily</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-xs uppercase tracking-wider">Next Dose</p>
              <p className="text-slate-900 font-semibold text-sm">8:00 PM</p>
            </div>
          </div>
          {/* Med Item 2 */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
              <span className="material-symbols-outlined">medication</span>
            </div>
            <div className="flex-1">
              <p className="text-slate-900 font-bold text-sm">Children's Tylenol</p>
              <p className="text-slate-500 text-xs">As needed for fever</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Last Taken</p>
              <p className="text-slate-900 font-semibold text-sm">10:15 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="px-4 pt-8">
        <h3 className="text-slate-900 text-lg font-bold leading-tight tracking-tight mb-4">Recent History</h3>
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
          {/* History Event 1 */}
          <div className="relative flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-primary z-10">
              <span className="material-symbols-outlined text-primary text-xl">thermometer</span>
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase">Today • 10:15 AM</p>
              <p className="text-slate-900 font-bold">Fever Logged</p>
              <p className="text-slate-600 text-sm">Temperature: 101.2°F. Administered Tylenol. Leo is resting.</p>
            </div>
          </div>
          {/* History Event 2 */}
          <div className="relative flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-orange-400 z-10">
              <span className="material-symbols-outlined text-orange-400 text-xl">healing</span>
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase">Yesterday • 4:30 PM</p>
              <p className="text-slate-900 font-bold">Minor Injury</p>
              <p className="text-slate-600 text-sm">Scraped knee while playing in the yard. Cleaned and bandaged.</p>
            </div>
          </div>
          {/* History Event 3 */}
          <div className="relative flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-slate-300 z-10">
              <span className="material-symbols-outlined text-slate-400 text-xl">description</span>
            </div>
            <div className="flex flex-col gap-1 pb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase">Aug 22 • 9:00 AM</p>
              <p className="text-slate-900 font-bold">Pediatrician Visit</p>
              <p className="text-slate-600 text-sm">Routine check-up. Amoxicillin prescribed for ear infection.</p>
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
