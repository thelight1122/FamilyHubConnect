import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paths } from '../config/paths';
import useAuth from '../context/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Where to go after signing in, e.g. back to an invite link. Only same-site paths.
  const next = searchParams.get('next')?.startsWith('/') ? searchParams.get('next') : null;
  const { login, authMode, mockAuthEnabled, supabaseAuthEnabled } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('adult'); // 'adult' or 'child'
  const [authMessage, setAuthMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthMessage(null);

    const result = await login({ email, password, role: selectedRole });
    setIsSubmitting(false);

    if (!result.ok) {
      setAuthMessage(result.message ?? 'Sign-in is not configured for this deployment yet.');
      return;
    }

    navigate(next ?? paths.dashboard);
  };

  return (
    <div className="bg-mesh-gradient min-h-screen flex items-center justify-center p-6 font-display">
      <div className="max-w-[440px] w-full animate-page-fade-in">
        
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-20 bg-white shadow-lifted rounded-[2rem] mb-6 transform hover:rotate-6 transition-transform">
            <span className="material-symbols-outlined text-primary text-4xl filled-icon">family_home</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Family Hub</h1>
          <p className="text-slate-500 font-medium">Your family headquarters, simplified.</p>
        </div>

        {/* glass-card Container */}
        <div className="glass-card rounded-[2.5rem] p-8 shadow-lifted">
          
          {/* Role Selector Tabs */}
          <div className="flex gap-3 mb-8 p-1.5 bg-slate-100/50 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedRole('adult')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                selectedRole === 'adult' 
                  ? 'bg-white text-primary shadow-sm scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-xl">shield_person</span>
              <span>Adult</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('child')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                selectedRole === 'child' 
                  ? 'bg-white text-primary shadow-sm scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-xl">face</span>
              <span>Child</span>
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {authMode === 'unconfigured' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800" role="status">
                Production authentication is not configured.
              </div>
            )}

            {mockAuthEnabled && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800" role="status">
                Local preview mode accepts any password.
              </div>
            )}

            {authMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800" role="alert">
                {authMessage}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors text-xl">mail</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 placeholder:text-slate-300 outline-none font-medium"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot password?</button>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors text-xl">lock</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 placeholder:text-slate-300 outline-none font-medium"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-lifted shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              type="submit"
            >
              {isSubmitting ? 'Signing In...' : `Sign In as ${selectedRole === 'adult' ? 'Adult' : 'Child'}`}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          Don't have an account? <button className="text-primary font-bold hover:underline" onClick={() => navigate(supabaseAuthEnabled && next ? `${paths.signup}?next=${encodeURIComponent(next)}` : paths.onboardingSetup)}>Create Family Account</button>
        </p>
      </div>
    </div>
  );
}
