import { useState, useCallback } from 'react';

export default function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, duration = 2200) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  }, []);

  return [toast, showToast];
}
