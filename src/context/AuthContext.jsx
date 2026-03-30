import { useState } from 'react';
import AuthContext from './auth-context';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('fhc_logged_in') === 'true');
  const [role, setRole] = useState(() => localStorage.getItem('fhc_user_role') || null);

  // Mock currentUser. In production, this would be fetched from /api/auth/me
  const currentUser = isLoggedIn ? {
    id: 'user-1',
    name: role === 'adult' ? 'Dad' : 'Leo',
    role: role,
    avatar: role === 'adult' 
      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCHzAmckYooADZpKaH2UZzfS-q1we1IVKibAswbz2GMCsNkWOCwbFb85p5lZftGD2LGCIl29-GJpZt44noQOh9vBAbfzmv4zUaKL_HcppnWgZk8Vk5x6R0AM7re32czMSN1pcMhC-Enm6b2KfeRNpIzPC98jtFW-KnnNfRo8suf35W582jxWC6ZRSCZ3COV4I3qeCYkkJHneMKMpdmS-Qfz1hi3s9qqmX89lqrFrCO05b22THacaBuBsJnB7ydFmMKrclCY37_nZM' 
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtkM0Kz8TVPiuRxqDjNn33-crPQUMT3MkHVNxNXGTEuym3T1rpaZ12iCWtjA6xOer7eW1SGYP-xp4wmd09AHMyX6F_Zjta6d2wogH7HUdNLYdl3D6l9r9Ho2xr35rvUx4IuhDmtjgIme18QsfsA56SJYelHH_6h5B2xpAf76l8V3uAWCuqrZvikExrstN_Z3W7Ho6zueJpVqkKQet4Muw15unKvs_gE6Cu0eak-IOKitFMBNHw6ezgpvGqNaNBvEFFXQ_drOM49iM'
  } : null;

  const login = (selectedRole = 'adult') => { 
    localStorage.setItem('fhc_logged_in', 'true'); 
    localStorage.setItem('fhc_user_role', selectedRole);
    setRole(selectedRole);
    setIsLoggedIn(true); 
  };
  
  const logout = () => { 
    localStorage.removeItem('fhc_logged_in'); 
    localStorage.removeItem('fhc_user_role');
    setRole(null);
    setIsLoggedIn(false); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, currentUser, role }}>
      {children}
    </AuthContext.Provider>
  );
}
