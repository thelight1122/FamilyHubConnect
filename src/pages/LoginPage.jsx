import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../config/paths';
import useAuth from '../context/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('adult'); // 'adult' or 'child'

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    navigate(paths.dashboard);
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
                <button type="button" className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot?</button>
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
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-lifted shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              type="submit"
            >
              Sign In as {selectedRole === 'adult' ? 'Dad' : 'Leo'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/50"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
              <span className="bg-white/0 px-4 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm font-bold text-sm">
              <img src="https://lh3.googleusercontent.com/COxitqSgS1P-B82DcEM8hS6S9p2SJniD9egUyzL2TV/+O+3X7" className="w-5 h-5 grayscale opacity-70" alt="" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm font-bold text-sm">
              <span className="material-symbols-outlined text-xl">apple</span>
              Apple
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          Don't have an account? <button className="text-primary font-bold hover:underline" onClick={() => navigate(paths.onboardingValues)}>Start Hub</button>
        </p>
      </div>
    </div>
  );
}
