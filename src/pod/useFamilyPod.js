import { useContext } from 'react';
import { FamilyPodContext } from './familyPodContextValue';

export function useFamilyPod() {
  const context = useContext(FamilyPodContext);

  if (!context) {
    throw new Error('useFamilyPod must be used within FamilyPodProvider');
  }

  return context;
}
