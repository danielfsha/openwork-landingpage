"use client";

import Image from "next/image";
import { ArrowUp, Focus, Globe, Plus, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SendState = "send" | "stop";

function StopRectIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="8" rx="1.25" fill="currentColor" />
    </svg>
  );
}

type PromptInputProps = {
  className?: string;
  workspaceIconSrc?: string;
  workspaceIconAlt?: string;
  title?: string;
  subtitle?: string;
  stopLabel?: string;
  sendState?: SendState;
  bodyClassName?: string;
  children: React.ReactNode;
};

export function PromptInput({
  className,
  workspaceIconSrc = "/icons/notion.svg",
  workspaceIconAlt = "Workspace",
  title = "Working with Notion & HubSpot",
  subtitle = "Focused on Acme follow-up",
  stopLabel = "Stop",
  sendState = "send",
  bodyClassName,
  children,
}: PromptInputProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card text-sm text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="relative flex min-h-12 items-center justify-between gap-2 border m-1 border-border/80 bg-background px-3 py-2 rounded-sm rounded-t-2xl overflow-hidden">
        {/* shading */}
        <div
          className="absolute inset-[0px] rounded-[4px] z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(251,146,60,0.3) 0 1.5px, rgba(249,115,22,0.08) 1.5px 3.5px, transparent 3.5px 5px)",
            backgroundColor: "rgba(251,146,60,0.08)",
            boxShadow: "inset 0 0 0 1px rgba(251,146,60,0.12)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 14%, rgba(0,0,0,1) 100%)",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 14%, rgba(0,0,0,1) 100%)",
          }}
        />

        <div className="flex items-center gap-2 relative z-10">
          <span className="inline-flex size-7 items-center justify-center overflow-hidden rounded-md border border-border/80 bg-muted/40">
            <Image
              src={workspaceIconSrc}
              alt={workspaceIconAlt}
              width={16}
              height={16}
              className="size-4"
            />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] text-foreground">{title}</p>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Stop label button - now above hatching with z-20 */}
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="rounded-full z-20 bg-background/95 backdrop-blur-sm border-border/80"
        >
          {stopLabel}
        </Button>
      </div>

      <div
        className={cn(
          "relative flex min-h-[74px] items-start gap-2 bg-background px-3 py-3",
          bodyClassName,
        )}
      >
        <div className="min-w-0 flex-1 leading-relaxed">{children}</div>
      </div>

      {/* bottom */}
      <div className="flex min-h-10 items-center justify-between border-t border-border/80 bg-background p-1">
        <div className="inline-flex items-center gap-1 text-muted-foreground">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Add"
            className="rounded-full"
          >
            <Plus size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Web"
            className="rounded-full"
          >
            <Globe size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Focus"
            className="rounded-full"
          >
            <Focus size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Settings"
            className="rounded-full"
          >
            <SlidersHorizontal size={14} />
          </Button>
        </div>

        <div>
          <Button
            type="button"
            size="icon-lg"
            aria-label="Send"
            className="rounded-full"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={sendState}
                initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 400,
                  mass: 0.5,
                }}
                className="inline-flex"
              >
                {sendState === "stop" ? (
                  <StopRectIcon size={14} />
                ) : (
                  <ArrowUp size={14} />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  );
}
