"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseFeatureSequenceOptions = {
  count: number;
  pauseMs?: number;
};

type UseFeatureSequenceResult = {
  activeIndex: number;
  activationId: number;
  isPaused: boolean;
  completeActive: (index: number) => void;
};

export function useFeatureSequence({
  count,
  pauseMs = 900,
}: UseFeatureSequenceOptions): UseFeatureSequenceResult {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activationId, setActivationId] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const completedActivationRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | undefined>(undefined);

  const completeActive = useCallback(
    (index: number) => {
      if (count <= 1 || index !== activeIndex || isPaused) {
        return;
      }

      if (completedActivationRef.current === activationId) {
        return;
      }

      completedActivationRef.current = activationId;
      setIsPaused(true);

      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
      }

      pauseTimerRef.current = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % count);
        setActivationId((current) => current + 1);
        setIsPaused(false);
      }, pauseMs);
    },
    [activeIndex, activationId, count, isPaused, pauseMs],
  );

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  return {
    activeIndex,
    activationId,
    isPaused,
    completeActive,
  };
}
