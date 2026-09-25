import { useEffect, useState } from 'react';
import { signedMediaUrls } from '../lib/media';

// Signed links for a page's media paths, refreshed when the paths change.
export default function useSignedUrls(paths: (string | null | undefined)[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const key = paths.filter(Boolean).sort().join('|');

  useEffect(() => {
    let active = true;
    signedMediaUrls(key ? key.split('|') : []).then((next) => {
      if (active) setUrls(next);
    });
    return () => {
      active = false;
    };
  }, [key]);

  return urls;
}
