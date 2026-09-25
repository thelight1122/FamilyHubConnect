import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { paths } from '../config/paths';
import useAuth from '../context/useAuth';

const inputClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

// Creates a live account. After an invite link this returns to /join; a new
// parent continues into the setup wizard.
export default function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next')?.startsWith('/') ? searchParams.get('next') : null;
  const { signUp, supabaseAuthEnabled } = useAuth();
  const [form, setForm] = useState({ displayName: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [confirmSent, setConfirmSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) {
      setMessage('Use at least 8 characters for the password.');
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    const result = await signUp({
      email: form.email.trim(),
      password: form.password,
      displayName: form.displayName.trim(),
      redirectTo: `${window.location.origin}${next ?? paths.onboardingSetup}`,
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
    navigate(next ?? paths.onboardingSetup);
  };

  const signInLink = `${paths.login}${next ? `?next=${encodeURIComponent(next)}` : ''}`;

  return (
    <div className="bg-mesh-gradient min-h-screen flex items-center justify-center p-6 font-display">
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-white shadow-lifted rounded-[1.5rem] mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {next?.startsWith(paths.join) ? 'Then you can accept your family invite.' : 'Then set up your family.'}
          </p>
        </div>

        {!supabaseAuthEnabled ? (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            Accounts need a live Supabase project. This is the prototype.
          </p>
        ) : confirmSent ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm" role="status">
            <span className="material-symbols-outlined text-4xl text-primary">mark_email_read</span>
            <h2 className="mt-2 text-lg font-bold">Check your email</h2>
            <p className="mt-1 text-sm text-slate-500">
              We sent a confirmation link to {form.email}. Open it on this device to continue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white/80 p-6 shadow-lifted">
            <input
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              placeholder="Your name"
              autoComplete="name"
              required
              className={inputClass}
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              autoComplete="email"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Password (8+ characters)"
              autoComplete="new-password"
              required
              className={inputClass}
            />
            {message && <p className="text-sm font-semibold text-rose-600" role="alert">{message}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-primary py-4 font-black text-white disabled:opacity-60">
              {isSubmitting ? 'Creating…' : 'Create account'}
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-slate-500 font-medium text-sm">
          Already have an account? <Link to={signInLink} className="text-primary font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
