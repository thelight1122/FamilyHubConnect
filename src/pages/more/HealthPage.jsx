import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useAuth from '../../context/useAuth';
import useFamilyCore from '../../hooks/useFamilyCore';
import useHealth, { HEALTH_EVENT_TYPES } from '../../hooks/useHealth';

const EVENT_ICONS = {
  Illness: 'sick',
  Injury: 'healing',
  'Doctor Visit': 'stethoscope',
  'Medication Change': 'pill',
  Other: 'description',
};

export default function HealthPage() {
  const [showModal, setShowModal] = useState(false);
  const [logType, setLogType] = useState('Illness');
  const [logNote, setLogNote] = useState('');
  const [toast, showToast] = useToast();
  const { family, membership, members } = useFamilyCore();
  const health = useHealth(family?.id);
  const { currentUser } = useAuth();
  const myId = currentUser?.id;
  const isAdult = membership?.role === 'adult';

  // Whose health is shown: yourself, or (for adults) one of the children.
  const people = members.filter((m) => m.user_id === myId || (isAdult && m.role === 'child'));
  const [subjectId, setSubjectId] = useState(null);
  const subject = people.find((p) => p.user_id === subjectId) ?? people.find((p) => p.user_id === myId) ?? null;

  const logs = health.logs.filter((log) => log.member_id === subject?.user_id);
  const medications = health.medications.filter((med) => med.member_id === subject?.user_id);

  const [medForm, setMedForm] = useState({ name: '', dose: '', schedule: '' });

  const handleSave = async () => {
    if (health.live && subject) {
      const outcome = await health.logEvent(subject.user_id, logType, logNote);
      if (!outcome.ok) {
        showToast(outcome.message);
        return;
      }
    }
    setShowModal(false);
    setLogNote('');
    showToast('Health event logged!');
  };

  const handleAddMedication = async (event) => {
    event.preventDefault();
    const outcome = await health.addMedication(subject.user_id, medForm.name, medForm.dose, medForm.schedule);
    showToast(outcome.ok ? 'Medication added' : outcome.message);
    if (outcome.ok) setMedForm({ name: '', dose: '', schedule: '' });
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
              <p className="text-slate-900 text-2xl font-bold leading-tight tracking-tight">{subject?.display_name ?? 'Family Member'}</p>
              <p className="text-slate-500 text-sm font-normal leading-normal">
                {logs.length ? `${logs.length} recent ${logs.length === 1 ? 'entry' : 'entries'}` : 'No live health logs yet'}
              </p>
            </div>
          </div>
          {health.live && people.length > 1 && (
            <div className="flex gap-2 overflow-x-auto" aria-label="Whose health">
              {people.map((person) => (
                <button
                  key={person.user_id}
                  onClick={() => setSubjectId(person.user_id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold border ${
                    person.user_id === subject?.user_id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {person.user_id === myId ? 'Me' : person.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {health.error && <p className="mx-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{health.error}</p>}

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
        </div>
        <div className="space-y-3">
          {medications.map((med) => (
            <div key={med.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <span className="material-symbols-outlined text-primary">pill</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{med.name}</p>
                <p className="text-xs text-slate-500">{[med.dose, med.schedule].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
          ))}
          {medications.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <span className="material-symbols-outlined text-3xl text-slate-300">pill</span>
              <p className="mt-2 text-sm font-bold text-slate-600">No live medications entered</p>
            </div>
          )}
          {health.live && subject && (
            <form onSubmit={handleAddMedication} className="grid grid-cols-3 gap-2">
              <input value={medForm.name} onChange={(e) => setMedForm((f) => ({ ...f, name: e.target.value }))} placeholder="Medication" required className="col-span-3 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input value={medForm.dose} onChange={(e) => setMedForm((f) => ({ ...f, dose: e.target.value }))} placeholder="Dose" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input value={medForm.schedule} onChange={(e) => setMedForm((f) => ({ ...f, schedule: e.target.value }))} placeholder="When" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white">Add</button>
            </form>
          )}
        </div>
      </div>

      {/* Recent History */}
      <div className="px-4 pt-8">
        <h3 className="text-slate-900 text-lg font-bold leading-tight tracking-tight mb-4">Recent History</h3>
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="relative flex gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-primary z-10">
                <span className="material-symbols-outlined text-primary text-xl">{EVENT_ICONS[log.kind] ?? 'description'}</span>
              </div>
              <div className="flex flex-col gap-1 pb-2">
                <p className="text-slate-900 font-bold">{log.kind}</p>
                {log.note && <p className="text-slate-600 text-sm">{log.note}</p>}
                <p className="text-xs text-slate-400">{new Date(log.logged_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="relative flex gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-slate-300 z-10">
                <span className="material-symbols-outlined text-slate-400 text-xl">description</span>
              </div>
              <div className="flex flex-col gap-1 pb-6">
                <p className="text-slate-900 font-bold">No live health history entered</p>
                <p className="text-slate-600 text-sm">Health events will appear here after entry.</p>
              </div>
            </div>
          )}
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
              {HEALTH_EVENT_TYPES.map(type => (
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
