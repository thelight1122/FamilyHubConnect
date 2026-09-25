import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import { ONBOARDING_FAMILY_DRAFT_KEY } from './OnboardingSetupPage';

function readDraft() {
  try {
    return JSON.parse(localStorage.getItem(ONBOARDING_FAMILY_DRAFT_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export default function InviteFamilyPage() {
  const navigate = useNavigate();
  const draft = readDraft();
  const inviteCandidates = useMemo(
    () => (draft?.members ?? []).filter((member) => member.email),
    [draft]
  );
  const [selectedEmails, setSelectedEmails] = useState(() => inviteCandidates.map((member) => member.email));
  const [showToast, setShowToast] = useState(false);

  const toggleEmail = (email) => {
    setSelectedEmails((current) => (
      current.includes(email)
        ? current.filter((item) => item !== email)
        : [...current, email]
    ));
  };

  const sendInvites = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(paths.dashboard);
    }, 900);
  };

  return (
    <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-x-hidden font-display text-slate-900 dark:text-slate-100">
      {showToast && (
        <div className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-3 shadow-lg dark:border-green-800 dark:bg-green-900/20">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <p className="text-xs font-medium text-green-700 dark:text-green-300">
              {selectedEmails.length} invite{selectedEmails.length === 1 ? '' : 's'} queued.
            </p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-10 flex items-center border-b border-slate-100 bg-white/80 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <button
          onClick={() => navigate(paths.onboardingRules)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Back to rules"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="ml-2 flex-1 text-lg font-bold leading-tight">Invite Family</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <section className="flex flex-col gap-3 p-4 px-6">
          <div className="flex items-end justify-between gap-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">Onboarding Progress</p>
            <p className="text-sm font-bold text-primary">4 of 4</p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-primary" style={{ width: '100%' }} />
          </div>
        </section>

        <section className="px-6 pt-2 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">Send invites?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Your family setup is ready. Choose whether to send invitations to the emails you entered for family members.
          </p>
        </section>

        {draft && (
          <section className="mx-6 mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Family Draft</p>
            <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{draft.familyName}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Owner: {draft.account?.name} - {draft.account?.email}
            </p>
          </section>
        )}

        <section className="px-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider">Entered Emails</h3>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
              {selectedEmails.length} Selected
            </span>
          </div>

          {inviteCandidates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
              <span className="material-symbols-outlined text-3xl text-slate-300">mail</span>
              <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">No member emails entered</p>
              <p className="mt-1 text-xs font-medium text-slate-400">You can finish setup now and add invites later.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inviteCandidates.map((member) => {
                const checked = selectedEmails.includes(member.email);
                return (
                  <button
                    key={`${member.name}-${member.email}`}
                    onClick={() => toggleEmail(member.email)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                      checked
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-800'
                    }`}
                  >
                    <span className={`material-symbols-outlined ${checked ? 'text-primary' : 'text-slate-300'}`}>
                      {checked ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900 dark:text-slate-100">{member.name}</span>
                      <span className="block truncate text-xs font-medium text-slate-500">{member.email} - {member.role}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(paths.dashboard)}
            className="flex-1 rounded-xl bg-slate-100 px-4 py-4 font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            Skip
          </button>
          <button
            onClick={sendInvites}
            disabled={selectedEmails.length === 0}
            className="flex-[2] rounded-xl bg-primary px-4 py-4 font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
          >
            Send Invites
          </button>
        </div>
      </footer>
    </div>
  );
}
