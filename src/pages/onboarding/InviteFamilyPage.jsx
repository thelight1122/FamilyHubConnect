import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { paths } from '../../config/paths';
import useAuth from '../../context/useAuth';
import { clearDraft, readDraft } from './draft';
import { finishOnboarding } from '../../lib/onboarding';
import { inviteLink } from '../../hooks/useInvites';

export default function InviteFamilyPage() {
  const navigate = useNavigate();
  const { supabaseAuthEnabled } = useAuth();
  const draft = readDraft();
  // With a live project the last step creates the real family; the prototype keeps its preview.
  if (supabaseAuthEnabled) return <LiveFinish draft={draft} />;
  return <PrototypeInvite draft={draft} navigate={navigate} />;
}

function PrototypeInvite({ draft, navigate }) {
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

function LiveFinish({ draft }) {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, authReady } = useAuth();
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(null);

  const finish = async () => {
    setIsSubmitting(true);
    setResult(await finishOnboarding(draft ?? {}, currentUser.id, currentUser.name));
    setIsSubmitting(false);
  };

  const share = async (invite) => {
    const url = inviteLink(invite.code);
    try {
      if (navigator.share) await navigator.share({ title: 'Join our family on Family Hub', text: `${invite.name}, here's your invite.`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(invite.code);
      }
    } catch {
      // Cancelled or unavailable; the link is on screen.
    }
  };

  const done = () => {
    clearDraft();
    navigate(paths.dashboard);
  };

  return (
    <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white shadow-2xl overflow-x-hidden font-display text-slate-900">
      <header className="sticky top-0 z-10 flex items-center border-b border-slate-100 bg-white/80 p-4 backdrop-blur-md">
        <button onClick={() => navigate(paths.onboardingRules)} aria-label="Back to rules" className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="ml-2 flex-1 text-lg font-bold">Finish Setup</h1>
      </header>

      <main className="flex-1 space-y-6 p-6 pb-32">
        <section>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">4 of 4</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">{result?.ok ? 'Your family is ready' : 'Create your family'}</h2>
        </section>

        {!draft?.familyName ? (
          <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm font-semibold text-slate-500">
            Start from the first step. <Link to={paths.onboardingSetup} className="text-primary font-bold">Set up your family</Link>
          </p>
        ) : !authReady ? null : !isLoggedIn ? (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            Sign in to finish. <Link to={`${paths.login}?next=${encodeURIComponent(paths.onboardingInvite)}`} className="font-bold underline">Sign in</Link>
          </p>
        ) : result?.ok ? (
          <section className="space-y-3" aria-label="Invites to share">
            <p className="text-sm text-slate-600">
              {result.familyName} is set up, and its constitution starts with your values and rules.
              {result.invites.length ? ' Share each invite with the person it is for: every code works once and expires in 7 days.' : ''}
            </p>
            {result.invites.map((invite) => (
              <div key={invite.code} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm font-bold">{invite.name} <span className="text-xs font-medium capitalize text-slate-400">· {invite.role}</span></p>
                <p className="mt-1 font-mono text-lg font-black tracking-[0.25em]" data-testid={`invite-code-${invite.name}`}>{invite.code}</p>
                <p className="break-all text-xs text-slate-500">{inviteLink(invite.code)}</p>
                <button onClick={() => share(invite)} className="mt-2 w-full rounded-xl bg-primary/10 py-2 text-sm font-bold text-primary">
                  {copied === invite.code ? 'Link copied' : 'Share invite link'}
                </button>
              </div>
            ))}
          </section>
        ) : (
          <section className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-lg font-black">{draft.familyName}</h3>
            <p className="text-sm text-slate-600"><strong>Values:</strong> {draft.values?.length ? draft.values.join(', ') : 'none chosen'}</p>
            <p className="text-sm text-slate-600"><strong>Rules:</strong> {draft.rules?.length ? draft.rules.join('; ') : 'none chosen'}</p>
            <p className="text-sm text-slate-600">
              <strong>Invites for:</strong> {draft.members?.filter((m) => m.name).map((m) => `${m.name} (${m.role})`).join(', ') || 'no one yet'}
            </p>
            {result && !result.ok && <p className="text-sm font-semibold text-rose-600" role="alert">{result.message} Nothing is lost: try again.</p>}
          </section>
        )}
      </main>

      {draft?.familyName && isLoggedIn && (
        <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-md">
          {result?.ok ? (
            <button onClick={done} className="w-full rounded-xl bg-primary py-4 font-bold text-white">Go to your family</button>
          ) : (
            <button onClick={finish} disabled={isSubmitting} className="w-full rounded-xl bg-primary py-4 font-bold text-white disabled:opacity-60">
              {isSubmitting ? 'Setting up…' : 'Create family'}
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
