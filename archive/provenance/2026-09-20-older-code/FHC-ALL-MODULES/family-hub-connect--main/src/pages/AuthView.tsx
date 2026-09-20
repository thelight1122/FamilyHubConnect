import React, { useState } from 'react';
import { useAppDispatch } from '../AppContext.tsx';

export default function AuthView() {
    const { onNavigate, addToast, handleLogin, handleSignup } = useAppDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuthAction = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await handleLogin(email, password);
            } else {
                const success = await handleSignup(email, password);
                if (success) {
                    addToast('Sign up successful! Please log in now to continue.', 'badge');
                    setIsLogin(true);
                }
            }
        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center font-bold text-2xl mb-20">{isLogin ? 'Login to Family Hub' : 'Create Your Account'}</h2>
                <form onSubmit={handleAuthAction}>
                    <div className="form-group">
                        <label htmlFor="authEmail">Email</label>
                        <input
                            id="authEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="authPassword">Password</label>
                        <input
                            id="authPassword"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn w-100"
                        disabled={loading}
                        aria-live="polite"
                    >
                        {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                    {error && <p className="ai-error" role="alert">{error}</p>}
                </form>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-100 text-center mt-20"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                >
                    {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}