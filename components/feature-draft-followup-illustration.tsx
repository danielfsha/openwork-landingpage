"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PromptInput } from "@/components/ui/prompt-input";
import { TextShimmer } from "./ui/text-shimmer";
import { Typewriter } from "./ui/typewriter";

const PROMPT_TEXT =
  "Analyze the latest account context, draft a follow-up for Acme Corp, and reschedule the next touchpoint. Then sync everything to CRM.";

const PROCESSING_STEP_MS = 1800;
const PROCESSING_FINAL_HOLD_MS = 1200;

type StatusLine = {
  prefix: string;
  tone: string;
  integration: {
    name: string;
    iconSrc: string;
  };
};

const STATUS_LINES = [
  {
    prefix: "Reviewing founder notes in",
    tone: "text-foreground",
    integration: {
      name: "Notion",
      iconSrc: "/icons/notion.svg",
    },
  },
  {
    prefix: "Checking the latest thread in",
    tone: "text-foreground",
    integration: {
      name: "Gmail",
      iconSrc: "/icons/gmail.svg",
    },
  },
  {
    prefix: "Queueing a reminder in",
    tone: "text-foreground",
    integration: {
      name: "Google Calendar",
      iconSrc: "/icons/google-calendar.svg",
    },
  },
  {
    prefix: "Syncing the final draft to",
    tone: "text-foreground",
    integration: {
      name: "HubSpot",
      iconSrc: "/icons/hubspot.svg",
    },
  },
] as const satisfies readonly StatusLine[];

type ComposerPhase = "compose" | "sending" | "processing";

type DraftFollowupIllustrationProps = {
  isActive?: boolean;
  replayKey?: string | number;
  onSequenceComplete?: () => void;
};

export function DraftFollowupIllustration({
  isActive = true,
  replayKey = 0,
  onSequenceComplete,
}: DraftFollowupIllustrationProps) {
  const [phase, setPhase] = useState<ComposerPhase>("compose");
  const [typedDone, setTypedDone] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setPhase("compose");
    setTypedDone(false);
    setLineIndex(0);
  }, [replayKey]);

  useEffect(() => {
    if (!isActive || !typedDone || phase !== "compose") {
      return;
    }

    const sendTimer = window.setTimeout(() => {
      setPhase("sending");
    }, 650);

    return () => {
      window.clearTimeout(sendTimer);
    };
  }, [typedDone, phase, isActive]);

  useEffect(() => {
    if (!isActive || phase !== "sending") {
      return;
    }

    const transitionTimer = window.setTimeout(() => {
      setPhase("processing");
    }, 700);

    return () => {
      window.clearTimeout(transitionTimer);
    };
  }, [phase, isActive]);

  useEffect(() => {
    if (!isActive || phase !== "processing") {
      return;
    }

    const isLastLine = lineIndex >= STATUS_LINES.length - 1;
    const timer = window.setTimeout(
      () => {
        if (isLastLine) {
          onSequenceComplete?.();
          return;
        }

        setLineIndex((current) => current + 1);
      },
      isLastLine ? PROCESSING_FINAL_HOLD_MS : PROCESSING_STEP_MS,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [isActive, phase, lineIndex, onSequenceComplete]);

  const handleTypingComplete = useCallback(() => {
    if (!isActive) {
      return;
    }

    setTypedDone(true);
  }, [isActive]);

  const activeLine = STATUS_LINES[lineIndex];

  if (!isActive) {
    return (
      <div className="h-full w-full p-3 flex-1 md:flex-none">
        <div className="h-full w-full">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-full">
              <PromptInput
                workspaceIconSrc="/icons/notion.svg"
                workspaceIconAlt="Workspace"
                title="Working with Notion & HubSpot"
                subtitle="Focused on Acme follow-up"
                stopLabel="Stop"
                sendState="send"
              >
                <p className="text-[13px] leading-5 font-normal text-foreground/80">
                  {PROMPT_TEXT}
                </p>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-3 flex-1 md:flex-none">
      <div className="h-full w-full">
        <AnimatePresence mode="wait">
          {phase !== "processing" ? (
            <div
              key="composer"
              className="flex h-full w-full items-center justify-center"
            >
              <div className="w-full">
                <PromptInput
                  workspaceIconSrc="/icons/notion.svg"
                  workspaceIconAlt="Workspace"
                  title="Working with Notion & HubSpot"
                  subtitle="Focused on Acme follow-up"
                  stopLabel="Stop"
                  sendState={phase === "sending" ? "stop" : "send"}
                >
                  <Typewriter
                    text={PROMPT_TEXT}
                    speedMs={19}
                    startDelayMs={260}
                    showCaret={phase !== "sending"}
                    onComplete={handleTypingComplete}
                    className="text-[13px] leading-5 font-normal text-foreground/80"
                  />
                </PromptInput>
              </div>
            </div>
          ) : (
            <motion.div
              key="processing"
              className="flex h-full w-full items-center justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="relative h-full rounded-md border border-foreground/15 bg-[rgba(255,255,255,0.72)] p-1 dark:bg-[rgba(18,18,18,0.78)] w-full">
                <div className="relative h-full overflow-x-auto overflow-y-hidden rounded-[6px] border border-foreground/10 bg-[rgba(248,250,252,0.9)] w-full dark:bg-[rgba(14,14,14,0.88)] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lineIndex}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium tracking-[0.01em] ${activeLine.tone}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <TextShimmer
                        duration={2.5}
                        className="[--base-color:#71717a] [--base-gradient-color:#ffffff]"
                      >
                        {activeLine.prefix}
                      </TextShimmer>

                      <span className="inline-flex size-4 items-center justify-center overflow-hidden rounded-[4px]">
                        <Image
                          src={activeLine.integration.iconSrc}
                          alt={activeLine.integration.name}
                          width={16}
                          height={16}
                          className="size-4"
                        />
                      </span>

                      <span className="text-foreground/90">
                        {activeLine.integration.name}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
