import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import useAuth from '../../context/useAuth';
import { readDraft, saveDraft } from './draft';

const blankMember = () => ({
  id: crypto.randomUUID(),
  name: '',
  email: '',
  role: 'adult',
});

export default function OnboardingSetupPage() {
  const navigate = useNavigate();
  const { supabaseAuthEnabled, isLoggedIn, currentUser, signUp } = useAuth();
  // Live and already signed in: the account exists, so skip the login fields.
  const signedIn = supabaseAuthEnabled && isLoggedIn;
  const needsAccount = supabaseAuthEnabled && !isLoggedIn;
  const saved = readDraft();
  const [account, setAccount] = useState({ name: saved?.account?.name ?? '', email: saved?.account?.email ?? '' });
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState(saved?.familyName ?? '');
  const [members, setMembers] = useState(() =>
    saved?.members?.length ? saved.members.map((member) => ({ ...member, id: crypto.randomUUID() })) : [blankMember()]
  );
  const [message, setMessage] = useState(null);
  const [confirmSent, setConfirmSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = useMemo(() => {
    const accountReady = signedIn || (account.name.trim() && account.email.trim() && (!needsAccount || password.length >= 8));
    const membersReady = members.every((member) => member.name.trim());
    return Boolean(accountReady && familyName.trim() && membersReady);
  }, [account, familyName, members, needsAccount, password, signedIn]);

  const updateMember = (id, patch) => {
    setMembers((current) => current.map((member) => (
      member.id === id ? { ...member, ...patch } : member
    )));
  };

  const addMember = () => setMembers((current) => [...current, blankMember()]);

  const removeMember = (id) => {
    setMembers((current) => current.length === 1 ? current : current.filter((member) => member.id !== id));
  };

  const handleContinue = async () => {
    saveDraft({
      account: {
        name: signedIn ? currentUser?.name ?? account.name.trim() : account.name.trim(),
        email: signedIn ? currentUser?.email ?? account.email.trim() : account.email.trim(),
      },
      familyName: familyName.trim(),
      members: members.map((member) => ({
        name: member.name.trim(),
        email: member.email.trim(),
        role: member.role,
      })),
    });

    if (needsAccount) {
      setIsSubmitting(true);
      setMessage(null);
      const result = await signUp({
        email: account.email.trim(),
        password,
        displayName: account.name.trim(),
        redirectTo: `${window.location.origin}${paths.onboardingValues}`,
      });
      setIsSubmitting(false);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      if (result.needsConfirmation) {
        setConfirmSent(true);
        return;
      }
    }

    navigate(paths.onboardingValues);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-slate-900 shadow-xl overflow-x-hidden">
        <header className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <button
            onClick={() => navigate(paths.login)}
            className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to login"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Create Family Account</h1>
        </header>

        <main className="flex-1 overflow-y-auto pb-28">
          <section className="flex flex-col gap-3 p-4">
            <div className="flex gap-6 justify-between items-center">
              <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wider">Onboarding Progress</p>
              <p className="text-primary text-sm font-bold">1 of 4</p>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: '25%' }} />
            </div>
          </section>

          <section className="px-4 pt-4 pb-2">
            <h2 className="tracking-tight text-2xl font-bold leading-tight">Start with your household</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2">
              Enter your login details and the family members you want in the hub. Invites come after the family is set up.
            </p>
          </section>

          <section className="px-4 py-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Your Login</h3>
            {signedIn ? (
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                Signed in as {currentUser?.email ?? currentUser?.name}.
              </p>
            ) : (<>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Your name</span>
              <input
                value={account.name}
                onChange={(event) => setAccount((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Enter your name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Login email</span>
              <input
                type="email"
                value={account.email}
                onChange={(event) => setAccount((current) => ({ ...current, email: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                placeholder="you@example.com"
              />
            </label>
            {needsAccount && (
              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:bg-white"
                  placeholder="At least 8 characters"
                />
              </label>
            )}
            </>)}
            <label className="block">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Family name</span>
              <input
                value={familyName}
                onChange={(event) => setFamilyName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Enter family name"
              />
            </label>
          </section>

          <section className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Family Members</h3>
              <button
                onClick={addMember}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-black text-primary"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Member
              </button>
            </div>

            {members.map((member, index) => (
              <article key={member.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">Member {index + 1}</p>
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-xs font-bold text-rose-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Name</span>
                    <input
                      value={member.name}
                      onChange={(event) => updateMember(member.id, { name: event.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Family member name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Email for invite</span>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(event) => updateMember(member.id, { email: event.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:bg-white dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Optional invite email"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['adult', 'child'].map((role) => (
                      <button
                        key={role}
                        onClick={() => updateMember(member.id, { role })}
                        className={`rounded-xl border px-3 py-2 text-sm font-black capitalize transition-colors ${
                          member.role === role
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>

        <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-slate-100 bg-white/90 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
          {message && <p className="mb-2 text-sm font-semibold text-rose-600" role="alert">{message}</p>}
          {confirmSent && (
            <p className="mb-2 text-sm font-semibold text-slate-600" role="status">
              Check your email: open the confirmation link on this device to continue setting up {familyName}.
            </p>
          )}
          <button
            onClick={handleContinue}
            disabled={!canContinue || isSubmitting || confirmSent}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
          >
            Continue to Family Values
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

