import { useState } from 'react';
import AuthContext from './auth-context';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('fhc_logged_in') === 'true');
  const [currentUser] = useState({
    name: 'Leo Thompson',
    role: 'child',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJLjl6Ef7bK-u_B2NcS7dt7erjVSdao2IuOgK27fYvgiRYQ1c6TSjOn2sdLMrDArlKAERFzjINx7uZP06Noe9OuWk9booq3wx_Ryr2CnXiJmlGeFfkTTvbnQ2nyIl1AS87YfbZI6bo_EWwXAAb_y-FPf38D3Wjt2L_CCENy3dwziFH1GbRkcUEW70bREGv3h0R9w_7URV-lb-elowFiRVjBwBTZCHCe2qrwSOOSwX374fPBHyuCHdlgpBTKVSwwDgPaoq16c8oURM',
  });

  const login = () => { localStorage.setItem('fhc_logged_in', 'true'); setIsLoggedIn(true); };
  const logout = () => { localStorage.removeItem('fhc_logged_in'); setIsLoggedIn(false); };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
