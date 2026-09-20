import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { familyPod } from './familyPod';
import { FamilyPodContext } from './familyPodContextValue';
import { getOrbForRoute, standardOrbRegistry } from './orbRegistry';

export function FamilyPodProvider({ children }) {
  const { pathname } = useLocation();

  const value = useMemo(() => {
    const currentOrb = getOrbForRoute(pathname);

    return {
      pod: familyPod,
      orbs: standardOrbRegistry,
      currentOrb,
      currentRoute: pathname,
      assistantEnabled: false,
      assistantStatus: 'Orb boundaries and No-Model classifications must exist before model integration.',
    };
  }, [pathname]);

  return (
    <FamilyPodContext.Provider value={value}>
      {children}
    </FamilyPodContext.Provider>
  );
}
