import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-dvh w-full max-w-md mx-auto bg-background-light flex flex-col">
      {/* Top logo section */}
      <div className="pt-16 pb-8 px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-primary" style={{fontSize:'56px'}}>home_heart</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Family Hub</h1>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">Connect and coordinate with your loved ones securely.</p>
      </div>
      {/* Login card */}
      <div className="flex-1 bg-white rounded-t-3xl px-8 pt-8 pb-10 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
              <input defaultValue="david@thompson.family" type="email" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 placeholder:text-slate-400" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <button type="button" className="text-sm text-primary font-medium">Forgot Password?</button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
              <input defaultValue="••••••••" type="password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900" />
            </div>
          </div>
          <button type="submit" className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20">
            Sign In
          </button>
        </form>
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="space-y-3">
          <button className="w-full h-12 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>
          <button className="w-full h-12 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 814 1000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 268.8-317.7 99.6 0 162.4 55 212.7 55 47.4 0 121.2-57.8 232.9-57.8zM545.7 0C591.9 0 662 26.3 702.8 70.4c35.7 39.4 63.4 99.5 63.4 162.5 0 8.3-.6 16.3-1.9 24.3-2.9 16.3-12.1 30.8-23.5 40.2-3.4 2.6-5.1 5.2-5.1 5.2l-44.4 21.3c-14.6 7.1-22.4 1.9-22.4-8.3 0-2.6.3-5.2 1.3-7.7 15.7-41.7 32-71.3 32-112 0-105.3-71.5-163.7-145.5-163.7-11.5 0-23.2 1.3-34.4 3.8-8.9 2-17.4 4.5-25.5 7.7-6.4 2.6-9.6.3-8.9-6.4.6-5.8 2.6-11.5 6.4-17.9C544.5 1.9 545 .6 545.7 0z"/></svg>
            Continue with Apple
          </button>
        </div>
        <p className="text-center text-sm text-slate-500 mt-8">
          New family?{' '}
          <button onClick={() => navigate('/onboarding/values')} className="text-primary font-bold hover:underline">
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}
