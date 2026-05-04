"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type TypewriterProps = {
  text: string;
  className?: string;
  caretClassName?: string;
  speedMs?: number;
  startDelayMs?: number;
  loop?: boolean;
  loopDelayMs?: number;
  showCaret?: boolean;
  replayKey?: string | number;
  onComplete?: () => void;
};

export function Typewriter({
  text,
  className,
  caretClassName,
  speedMs = 36,
  startDelayMs = 0,
  loop = false,
  loopDelayMs = 1200,
  showCaret = true,
  replayKey,
  onComplete,
}: TypewriterProps) {
  const [length, setLength] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const done = useMemo(() => length >= text.length, [length, text.length]);

  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval> | undefined;
    let loopTimeout: ReturnType<typeof setTimeout> | undefined;

    setLength(0);

    const startTyping = () => {
      typingInterval = setInterval(() => {
        setLength((current) => {
          const next = current + 1;

          if (next >= text.length) {
            if (typingInterval) {
              clearInterval(typingInterval);
            }

            onCompleteRef.current?.();

            if (loop) {
              loopTimeout = setTimeout(() => {
                setLength(0);
                startTyping();
              }, loopDelayMs);
            }

            return text.length;
          }

          return next;
        });
      }, speedMs);
    };

    const startTimeout = setTimeout(startTyping, startDelayMs);

    return () => {
      if (typingInterval) {
        clearInterval(typingInterval);
      }
      if (startTimeout) {
        clearTimeout(startTimeout);
      }
      if (loopTimeout) {
        clearTimeout(loopTimeout);
      }
    };
  }, [text, speedMs, startDelayMs, loop, loopDelayMs, replayKey]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {text.slice(0, length)}
      {showCaret && (!done || loop) ? (
        <span
          className={cn(
            "ml-0.5 h-[1em] w-px animate-pulse bg-current align-[-1px]",
            caretClassName,
          )}
        />
      ) : null}
    </span>
  );
}
