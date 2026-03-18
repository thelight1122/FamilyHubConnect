import { useState } from 'react';
import AuthContext from './auth-context';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('fhc_logged_in') === 'true');
  // TODO: fetch from /api/auth/me after login
  const [currentUser] = useState(null);

  const login = () => { localStorage.setItem('fhc_logged_in', 'true'); setIsLoggedIn(true); };
  const logout = () => { localStorage.removeItem('fhc_logged_in'); setIsLoggedIn(false); };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
