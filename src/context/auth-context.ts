import { createContext } from 'react';
import type { AuthMode } from '../config/runtime';

export type FamilyRole = 'adult' | 'child';

export interface CurrentUser {
  id: string;
  email: string | null;
  name: string;
  role: FamilyRole | null;
  avatar: string;
}

export interface LoginResult {
  ok: boolean;
  message?: string;
}

// The value AuthProvider (AuthContext.jsx) supplies.
export interface AuthContextValue {
  authReady: boolean;
  authMode: AuthMode;
  isLoggedIn: boolean;
  login: (credentials?: { email?: string; password?: string; role?: FamilyRole }) => Promise<LoginResult>;
  logout: () => Promise<void>;
  currentUser: CurrentUser | null;
  role: FamilyRole | null;
  mockAuthEnabled: boolean;
  supabaseAuthEnabled: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export default AuthContext;
