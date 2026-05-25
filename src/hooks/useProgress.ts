import { useCallback, useEffect, useState } from 'react';
import {
  loadProgress,
  markCorrect,
  markSeen,
  markWrong,
  recordActiveDay,
  resetProgress,
  saveProgress,
  setBox,
} from '../lib/progress';
import type { Box, ProgressMap } from '../lib/types';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const correct = useCallback(
    (id: string, opts?: { elapsedMs?: number; weight?: 1 | 2 }) => {
      recordActiveDay();
      setProgress((p) => markCorrect(p, id, opts));
    },
    [],
  );

  const wrong = useCallback((id: string, opts?: { elapsedMs?: number }) => {
    recordActiveDay();
    setProgress((p) => markWrong(p, id, opts));
  }, []);

  const seen = useCallback((id: string) => {
    recordActiveDay();
    setProgress((p) => markSeen(p, id));
  }, []);

  const reset = useCallback(() => {
    resetProgress();
    setProgress({});
  }, []);

  const setManual = useCallback((id: string, box: Box) => {
    setProgress((p) => setBox(p, id, box));
  }, []);

  return { progress, correct, wrong, seen, reset, setManual };
}
