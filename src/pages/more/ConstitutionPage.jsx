import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useFamilyCore from '../../hooks/useFamilyCore';
import useConstitution from '../../hooks/useConstitution';

export default function ConstitutionPage() {
  const navigate = useNavigate();
  const [toast, showToast] = useToast();
  const { family, membership, members } = useFamilyCore();
  const constitution = useConstitution(family?.id);
  const isAdult = membership?.role === 'adult';

  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [proposalText, setProposalText] = useState('');
  const [rationaleText, setRationaleText] = useState('');
  const [missionDraft, setMissionDraft] = useState('');
  const [valueDraft, setValueDraft] = useState('');
  const [ruleDraft, setRuleDraft] = useState('');

  const missionText = constitution.mission;
  const values = constitution.values;
  const rules = constitution.rules.map((rule) => rule.body);
  const nameOf = (userId) => members.find((m) => m.user_id === userId)?.display_name ?? 'Family member';

  const runAndToast = async (promise, success) => {
    const outcome = await promise;
    showToast(outcome.ok ? success : outcome.message);
    return outcome.ok;
  };

  const handleSubmitProposal = async () => {
    if(!proposalText.trim()) {
      showToast('Please draft an amendment proposal');
      return;
    }
    if (constitution.live) {
      const ok = await runAndToast(
        constitution.proposeAmendment({ proposal: proposalText, rationale: rationaleText }),
        'Amendment proposal submitted!'
      );
      if (!ok) return;
    } else {
      showToast('Amendment proposal submitted!');
    }
    setIsProposeModalOpen(false);
    setProposalText('');
    setRationaleText('');
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative w-full overflow-x-hidden">
      <Toast message={toast} />

      {/* Top Navigation */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined block">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Family Constitution</h1>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined block text-slate-400">history</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full pb-8">
        {/* Hero Section / Preamble */}
        <section className="p-6 text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full mx-auto border-4 border-primary/20 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-5xl">family_restroom</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
              <span className="material-symbols-outlined text-sm block">verified_user</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Family Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              {missionText || 'No live mission statement entered.'}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 text-xs font-semibold rounded-full uppercase tracking-wider">
                Awaiting live setup
              </span>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="px-4 py-6 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="text-lg font-bold">Our Core Values</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {values.map((value) => (
              <div key={value.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <span className="text-sm font-bold">{value.title}</span>
              </div>
            ))}
            {values.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
                <span className="material-symbols-outlined text-3xl text-slate-300">auto_awesome</span>
                <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No live values entered</p>
              </div>
            )}
          </div>
        </section>

        {/* Family Rules Section */}
        <section className="px-4 py-6 space-y-4 bg-primary/5 dark:bg-primary/10 my-4 border-y border-primary/10 dark:border-primary/20">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary">rule</span>
            <h3 className="text-lg font-bold">Family Rules</h3>
          </div>
          <ul className="space-y-2">
            {rules.length === 0 ? (
              <li className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                No live family rules entered.
              </li>
            ) : rules.map((rule, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span className="text-sm font-medium">{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {constitution.live && isAdult && (
          <section className="px-4 py-2 space-y-3" aria-label="Edit constitution">
            <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-slate-500">Edit (adults)</h3>
            <form
              className="flex gap-2"
              onSubmit={async (event) => {
                event.preventDefault();
                if (await runAndToast(constitution.saveMission(missionDraft), 'Mission saved')) setMissionDraft('');
              }}
            >
              <input value={missionDraft} onChange={(e) => setMissionDraft(e.target.value)} placeholder="Family mission" className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
              <button type="submit" disabled={!missionDraft.trim()} className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Save mission</button>
            </form>
            <form
              className="flex gap-2"
              onSubmit={async (event) => {
                event.preventDefault();
                if (await runAndToast(constitution.addValue(valueDraft), 'Value added')) setValueDraft('');
              }}
            >
              <input value={valueDraft} onChange={(e) => setValueDraft(e.target.value)} placeholder="New value" className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
              <button type="submit" disabled={!valueDraft.trim()} className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Add value</button>
            </form>
            <form
              className="flex gap-2"
              onSubmit={async (event) => {
                event.preventDefault();
                if (await runAndToast(constitution.addRule(ruleDraft), 'Rule added')) setRuleDraft('');
              }}
            >
              <input value={ruleDraft} onChange={(e) => setRuleDraft(e.target.value)} placeholder="New rule" className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
              <button type="submit" disabled={!ruleDraft.trim()} className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Add rule</button>
            </form>
          </section>
        )}

        {constitution.live && constitution.amendments.length > 0 && (
          <section className="px-4 py-6 space-y-3">
            <h3 className="px-2 text-lg font-bold">Amendments</h3>
            {constitution.amendments.map((amendment) => (
              <div key={amendment.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold">{amendment.proposal}</p>
                {amendment.rationale && <p className="mt-1 text-xs text-slate-500">{amendment.rationale}</p>}
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {nameOf(amendment.proposed_by)} · {amendment.status}
                </p>
                {isAdult && amendment.status === 'proposed' && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => runAndToast(constitution.decideAmendment(amendment.id, true), 'Amendment adopted')} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Adopt</button>
                    <button onClick={() => runAndToast(constitution.decideAmendment(amendment.id, false), 'Amendment declined')} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">Decline</button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Acknowledgment Section */}
        <section className="px-4 py-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold">Signatories</h3>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              {constitution.signatures.length ? `${constitution.signatures.length} signed` : 'No live signatures'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex -space-x-3 overflow-hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-2 ring-white dark:bg-slate-800 dark:ring-slate-900">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {constitution.signatures.length
                  ? constitution.signatures.map((s) => nameOf(s.user_id)).join(', ')
                  : 'No live signatories recorded'}
              </p>
              <p className="text-xs text-slate-500">{family?.name ?? 'Family Hub'}</p>
            </div>
            {constitution.live && !constitution.hasSigned ? (
              <button onClick={() => runAndToast(constitution.sign(), 'Signed')} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white">
                Sign
              </button>
            ) : (
              <div className="text-primary pr-2">
                <span className="material-symbols-outlined block text-2xl">verified</span>
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="px-6 py-4">
          <button 
            onClick={() => setIsProposeModalOpen(true)}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
            Propose Amendment
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
            Amendments will be discussed in the next family meeting
          </p>
        </div>
      </main>

      {/* Propose Amendment Modal */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsProposeModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">feed</span>
                Propose Amendment
              </h3>
              <button onClick={() => setIsProposeModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  Proposed Change or Addition
                </label>
                <textarea 
                  value={proposalText} 
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Enter the proposed change or addition" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  Rationale <span className="text-[10px] font-medium opacity-60">(Optional)</span>
                </label>
                <textarea 
                  value={rationaleText} 
                  onChange={(e) => setRationaleText(e.target.value)}
                  placeholder="Why should the family adopt this amendment?" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[80px] resize-none"
                />
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSubmitProposal}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98]"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
