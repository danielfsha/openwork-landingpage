"use client";

import { useEffect, useRef } from "react";

import {
  DataAnalysisAiTable,
  defaultDataAnalysisRows,
} from "@/components/data-analysis-ai-table";

type DataAnalysisIllustrationProps = {
  isActive?: boolean;
  replayKey?: string | number;
  onSequenceComplete?: () => void;
};

export function DataAnalysisIllustration({
  isActive = true,
  replayKey = 0,
  onSequenceComplete,
}: DataAnalysisIllustrationProps) {
  const completionFiredRef = useRef(false);

  useEffect(() => {
    completionFiredRef.current = false;
  }, [replayKey, isActive]);

  return (
    <div className="h-full p-3">
      <div className="rounded-md border border-foreground/15 bg-[#f7f7f8] p-1 shadow-sm dark:bg-[#18181b]">
        <DataAnalysisAiTable
          rows={defaultDataAnalysisRows}
          typingRowId="row-total"
          replayKey={replayKey}
          disableAnimation={!isActive}
          onTypingEnd={() => {
            if (!isActive || completionFiredRef.current) {
              return;
            }

            completionFiredRef.current = true;
            window.setTimeout(() => {
              onSequenceComplete?.();
            }, 3200);
          }}
        />
      </div>
    </div>
  );
}
