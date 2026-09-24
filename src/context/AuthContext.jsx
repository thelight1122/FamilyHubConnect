import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from './auth-context';
import { runtimeConfig } from '../config/runtime';
import { supabase } from '../lib/supabase';

const getRoleFromUser = (user, fallbackRole = 'adult') =>
  user?.user_metadata?.family_role === 'child' ? 'child' : fallbackRole;

const getDisplayName = (role, user) =>
  user?.user_metadata?.display_name || user?.email || (role === 'adult' ? 'Adult' : 'Child');

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('fhc_logged_in') === 'true');
  const [role, setRole] = useState(() => localStorage.getItem('fhc_user_role') || null);
  const [sessionUser, setSessionUser] = useState(null);
  const [authReady, setAuthReady] = useState(runtimeConfig.authMode !== 'supabase');

  useEffect(() => {
    if (runtimeConfig.authMode !== 'supabase' || !supabase) return undefined;

    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const user = data.session?.user ?? null;
      const nextRole = getRoleFromUser(user, localStorage.getItem('fhc_user_role') || 'adult');

      setSessionUser(user);
      setRole(user ? nextRole : null);
      setIsLoggedIn(Boolean(user));
      setAuthReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      const nextRole = getRoleFromUser(user, localStorage.getItem('fhc_user_role') || 'adult');

      setSessionUser(user);
      setRole(user ? nextRole : null);
      setIsLoggedIn(Boolean(user));
      setAuthReady(true);

      if (user) {
        localStorage.setItem('fhc_user_role', nextRole);
      } else {
        localStorage.removeItem('fhc_logged_in');
        localStorage.removeItem('fhc_user_role');
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const currentUser = useMemo(() => {
    if (!isLoggedIn) return null;

    return {
      id: sessionUser?.id ?? 'user-1',
      email: sessionUser?.email ?? null,
      name: getDisplayName(role, sessionUser),
      role: role,
      avatar: sessionUser?.user_metadata?.avatar_url ?? '',
    };
  }, [isLoggedIn, role, sessionUser]);

  const login = useCallback(async ({ email, password, role: selectedRole = 'adult' } = {}) => {
    if (runtimeConfig.authMode === 'supabase' && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { ok: false, message: error.message };
      }

      const nextRole = getRoleFromUser(data.user, selectedRole);
      localStorage.setItem('fhc_user_role', nextRole);
      localStorage.removeItem('fhc_logged_in');
      setSessionUser(data.user);
      setRole(nextRole);
      setIsLoggedIn(Boolean(data.user));
      return { ok: Boolean(data.user) };
    }

    if (!runtimeConfig.mockAuthEnabled) {
      return { ok: false, message: 'Sign-in is not configured for this deployment yet.' };
    }

    localStorage.setItem('fhc_logged_in', 'true'); 
    localStorage.setItem('fhc_user_role', selectedRole);
    setSessionUser(null);
    setRole(selectedRole);
    setIsLoggedIn(true); 
    return { ok: true };
  }, []);
  
  const logout = useCallback(async () => { 
    if (runtimeConfig.authMode === 'supabase' && supabase) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem('fhc_logged_in'); 
    localStorage.removeItem('fhc_user_role');
    setSessionUser(null);
    setRole(null);
    setIsLoggedIn(false); 
  }, []);

  const contextValue = useMemo(() => ({
    authReady,
    authMode: runtimeConfig.authMode,
    isLoggedIn, 
    login, 
    logout, 
    currentUser, 
    role,
    mockAuthEnabled: runtimeConfig.mockAuthEnabled,
    supabaseAuthEnabled: runtimeConfig.authMode === 'supabase',
  }), [authReady, isLoggedIn, login, logout, currentUser, role]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
