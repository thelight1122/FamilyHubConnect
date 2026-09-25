import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { paths } from '../config/paths';
import useAuth from '../context/useAuth';
import { acceptInvite } from '../hooks/useInvites';

// Where an invite link lands: sign in (or create an account), then accept.
export default function JoinPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authReady, isLoggedIn, currentUser, setFamilyRole, supabaseAuthEnabled } = useAuth();
  const [code, setCode] = useState(searchParams.get('code') ?? '');
  const [message, setMessage] = useState(null);
  const [joined, setJoined] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const here = `${paths.join}?code=${encodeURIComponent(code.trim())}`;
  const nextParam = `?next=${encodeURIComponent(here)}`;

  const accept = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const result = await acceptInvite(code);
    if (result.ok) {
      await setFamilyRole(result.role);
      setJoined(result);
    } else {
      setMessage(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-mesh-gradient min-h-screen flex items-center justify-center p-6 font-display">
      <div className="max-w-[440px] w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-16 bg-white shadow-lifted rounded-[1.5rem] mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">family_restroom</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Join your family</h1>
        </div>

        {!supabaseAuthEnabled ? (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">Invites need a live Supabase project. This is the prototype.</p>
        ) : joined ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm" role="status">
            <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
            <h2 className="mt-2 text-lg font-bold">Welcome to {joined.familyName}, {joined.displayName}!</h2>
            <button onClick={() => navigate(paths.dashboard)} className="mt-4 w-full rounded-2xl bg-primary py-3 font-bold text-white">
              Go to your family
            </button>
          </div>
        ) : !authReady ? null : !isLoggedIn ? (
          <div className="space-y-3 rounded-[2rem] bg-white/80 p-6 shadow-lifted">
            <p className="text-sm font-medium text-slate-600">
              Invite code <span className="font-mono font-bold tracking-widest">{code || '—'}</span>. Create an account or sign in, and you'll come straight back here.
            </p>
            <Link to={`${paths.signup}${nextParam}`} className="block w-full rounded-2xl bg-primary py-3.5 text-center font-black text-white">
              Create account
            </Link>
            <Link to={`${paths.login}${nextParam}`} className="block w-full rounded-2xl border border-slate-200 bg-white py-3.5 text-center font-bold text-slate-700">
              I already have an account
            </Link>
          </div>
        ) : (
          <form onSubmit={accept} className="space-y-4 rounded-[2rem] bg-white/80 p-6 shadow-lifted">
            <p className="text-sm font-medium text-slate-600">Signed in as {currentUser?.email ?? currentUser?.name}.</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Invite code"
              aria-label="Invite code"
              autoComplete="off"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-center font-mono text-lg font-bold tracking-[0.3em] outline-none focus:border-primary"
            />
            {message && <p className="text-sm font-semibold text-rose-600" role="alert">{message}</p>}
            <button type="submit" disabled={isSubmitting || !code.trim()} className="w-full rounded-2xl bg-primary py-4 font-black text-white disabled:opacity-60">
              {isSubmitting ? 'Joining…' : 'Accept invite'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
