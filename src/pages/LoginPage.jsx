import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../config/paths';
import useAuth from '../context/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate(paths.dashboard);
  };

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl overflow-hidden">

        {/* Header / Logo Section */}
        <div className="pt-10 pb-6 px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl">home</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Family Hub</h1>
          <p className="text-slate-500 mt-2 text-base">Connect and coordinate with your loved ones securely.</p>
        </div>

        <div className="px-8 pb-10">
          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 outline-none"
                  placeholder="name@family.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button type="button" className="text-sm font-semibold text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center px-1">
              <input
                className="w-4 h-4 text-primary bg-slate-50 border-slate-300 rounded focus:ring-primary"
                id="remember"
                type="checkbox"
              />
              <label className="ml-2 text-sm text-slate-600" htmlFor="remember">Keep me logged in</label>
            </div>

            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              type="submit"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <img
                alt="Google"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpymxVOR8meoWuw417uCcTm72oNiYEQCPb0SbfGK3EJUOgRjEs6sDy5OSOmEvYyH3rGY83kQBvMUKr_cU-FONlwNEgqZG1pvaFsux15i8NGwSq4YL1soyvB53Gi0cIo6ocLHrvDblpWMOzf7tEid3JI_gQhTdoyaUzzPRbs5E5cFkErbfGKhlhfHNdHjWF8KJKrovsWbQMJCUVrF40dMCenzdcKGrqULplogdDs_Z8D-ronUvX_4r9HGPr5mwIWkcHn7N4BDE1jww"
              />
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">ios</span>
              <span className="text-sm font-semibold">Apple</span>
            </button>
          </div>

          {/* Create Account */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">New to Family Hub?</p>
            <button
              type="button"
              onClick={() => navigate(paths.onboardingValues)}
              className="mt-3 w-full py-3 px-4 border-2 border-primary/20 text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors"
            >
              Create Family Account
            </button>
          </div>
        </div>

        {/* Illustration Footer (hidden on mobile) */}
        <div className="hidden sm:block h-32 bg-primary/5 border-t border-slate-100">
          <div className="w-full h-full bg-cover opacity-40 mix-blend-multiply"></div>
        </div>
      </div>
    </div>
  );
}
