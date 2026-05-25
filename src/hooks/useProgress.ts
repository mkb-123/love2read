import { useCallback, useEffect, useState } from 'react';
import {
  loadProgress,
  markKnown,
  markSeen,
  resetProgress,
  saveProgress,
  type Progress,
} from '../lib/progress';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const seen = useCallback((id: string) => {
    setProgress((p) => markSeen(p, id));
  }, []);

  const known = useCallback((id: string) => {
    setProgress((p) => markKnown(p, id));
  }, []);

  const reset = useCallback(() => {
    resetProgress();
    setProgress({});
  }, []);

  return { progress, seen, known, reset };
}
