import { useCallback, useEffect, useState } from 'react';
import { loadChildName, saveChildName } from '../lib/progress';

export function useChildName() {
  const [name, setName] = useState<string>(() => loadChildName());

  useEffect(() => {
    setName(loadChildName());
  }, []);

  const save = useCallback((n: string) => {
    const trimmed = n.trim();
    saveChildName(trimmed);
    setName(trimmed);
  }, []);

  return { name, displayName: name || 'you', save };
}
