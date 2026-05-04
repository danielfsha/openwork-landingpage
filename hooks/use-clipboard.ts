"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseClipboardOptions = {
  resetAfterMs?: number;
};

export function useClipboard(options: UseClipboardOptions = {}) {
  const { resetAfterMs = 1800 } = options;
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      const text = value ?? "";

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setCopied(true);

        if (timeoutRef.current != null) {
          window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          setCopied(false);
        }, resetAfterMs);

        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetAfterMs],
  );

  return { copied, copy };
}
