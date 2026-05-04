"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Typewriter } from "@/components/ui/typewriter";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type TeamTone = "default" | "warning" | "info";
type TypingPhase = "typing" | "highlight" | "revealed";

const PHASE_DELAY_MS = 3000;

export type DataAnalysisRow = {
  id: string;
  name: string;
  team: string;
  email: string;
  checked?: boolean;
  teamTone?: TeamTone;
};

export const defaultDataAnalysisRows: DataAnalysisRow[] = [
  {
    id: "row-revenue",
    name: "Q2 Revenue",
    team: "P&L",
    email: "$1,284,500",
    teamTone: "info",
  },
  {
    id: "row-cogs",
    name: "Cost of Goods",
    team: "P&L",
    email: "$462,300",
    teamTone: "info",
  },
  {
    id: "row-gross-profit",
    name: "Gross Profit",
    team: "P&L",
    email: "$822,200",
    teamTone: "info",
  },
  {
    id: "row-opex",
    name: "Operating Expense",
    team: "OPEX",
    email: "$318,900",
    checked: true,
    teamTone: "warning",
  },
  {
    id: "row-operating-income",
    name: "Operating Income",
    team: "P&L",
    email: "$503,300",
    teamTone: "info",
  },
  {
    id: "row-adjustments",
    name: "Adjustments",
    team: "Other",
    email: "$125,100",
  },
  {
    id: "row-total",
    name: "Total",
    team: "Summary",
    email: "$378,200",
    teamTone: "warning",
  },
];

type DataAnalysisAiTableProps = {
  rows?: DataAnalysisRow[];
  typingRowId?: string;
  replayKey?: string | number;
  disableAnimation?: boolean;
  onTypingEnd?: (rowId: string) => void;
};

function teamPillClass(tone?: TeamTone) {
  if (tone === "warning") {
    return "bg-[#fde6d8] text-[#c2410c] dark:bg-[#3a2318] dark:text-[#fdba74]";
  }

  if (tone === "info") {
    return "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#93c5fd]";
  }

  return "bg-[#eceef1] text-foreground/80 dark:bg-[#232326] dark:text-foreground/85";
}

function ledgerPillClass(ledger: string, tone?: TeamTone) {
  const normalized = ledger.toLowerCase();

  if (normalized === "sales") {
    return "bg-[#fee2e2] text-[#b91c1c] dark:bg-[#3f1d1d] dark:text-[#fca5a5]";
  }

  if (normalized === "summary") {
    return "bg-[#fef3c7] text-[#92400e] dark:bg-[#3a2f16] dark:text-[#fcd34d]";
  }

  if (normalized === "opex") {
    return "bg-[#ffedd5] text-[#c2410c] dark:bg-[#3a2417] dark:text-[#fdba74]";
  }

  if (normalized === "p&l" || normalized === "pnl") {
    return "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#93c5fd]";
  }

  if (normalized === "other") {
    return "bg-[#e0e7ff] text-[#4338ca] dark:bg-[#1f2440] dark:text-[#a5b4fc]";
  }

  return teamPillClass(tone);
}

function AnimatedRow({
  row,
  isActive,
  replayKey,
  disableAnimation,
  onTypingEnd,
}: {
  row: DataAnalysisRow;
  isActive: boolean;
  replayKey: string | number;
  disableAnimation: boolean;
  onTypingEnd?: (rowId: string) => void;
}) {
  const [phase, setPhase] = useState<TypingPhase>("typing");
  const [typeReplayKey, setTypeReplayKey] = useState(0);

  const callbackRef = useRef(onTypingEnd);
  const revealTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = onTypingEnd;
  }, [onTypingEnd]);

  useEffect(() => {
    if (disableAnimation) {
      setPhase("revealed");
      return;
    }

    if (!isActive) {
      setPhase("revealed");
      return;
    }

    setPhase("typing");
    setTypeReplayKey((current) => current + 1);

    return () => {
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
      }
    };
  }, [row.id, isActive, replayKey, disableAnimation]);

  function handleTypingComplete() {
    if (disableAnimation || !isActive || phase !== "typing") {
      return;
    }

    setPhase("highlight");
    callbackRef.current?.(row.id);

    if (revealTimeoutRef.current) {
      window.clearTimeout(revealTimeoutRef.current);
    }

    revealTimeoutRef.current = window.setTimeout(() => {
      setPhase("revealed");
    }, PHASE_DELAY_MS);
  }

  return (
    <>
      {/* Checkbox */}
      <TableCell className="h-8 min-h-8 max-h-8 w-8 px-2 py-1 text-center align-middle">
        <Checkbox defaultChecked={row.checked} />
      </TableCell>

      {/* Name */}
      <TableCell className="h-8 min-h-8 max-h-8 border-l border-foreground/10 px-2 py-1 align-middle">
        <span className="inline-block w-full truncate align-middle text-foreground/90 leading-none">
          {!disableAnimation && isActive && phase === "typing" ? (
            <Typewriter
              text={row.name}
              speedMs={88}
              replayKey={`${row.id}-${replayKey}-${typeReplayKey}`}
              onComplete={handleTypingComplete}
              className="block w-full truncate text-foreground/90"
            />
          ) : (
            row.name
          )}
        </span>
      </TableCell>

      {/* Team + Email section */}
      <TableCell
        colSpan={2}
        className="relative h-8 min-h-8 max-h-8 border-l border-foreground/10 px-0 py-0 align-middle"
      >
        {disableAnimation ? (
          <div className="grid h-full grid-cols-[84px_112px] items-center px-2">
            <div>
              <span
                className={cn(
                  "inline-flex h-4 items-center rounded-full px-1.5 py-0 text-[9px] leading-none",
                  ledgerPillClass(row.team, row.teamTone),
                )}
              >
                {row.team}
              </span>
            </div>

            <div className="text-right">
              <span className="inline-block max-w-[96px] truncate leading-none text-muted-foreground">
                {row.email}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* THIS is the correct overlay:
            starts top-left
            full row height
            full width of BOTH columns
        */}
            <AnimatePresence initial={false}>
              {isActive && phase === "highlight" && (
                <motion.div
                  key="highlight-overlay"
                  className="pointer-events-none absolute inset-0 z-20 border border-[#f97316]"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.40) 52%, rgba(249,115,22,0) 100%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    opacity: 1,
                    backgroundPositionX: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                  }}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 grid h-full grid-cols-[84px_112px] items-center px-2">
              {/* TEAM */}
              <div>
                <AnimatePresence mode="wait" initial={false}>
                  {isActive && phase !== "revealed" ? (
                    <motion.div
                      key="team-loading"
                      initial={{ opacity: 0, filter: "blur(6px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.25 }}
                    >
                      <Skeleton className="h-4 w-14 rounded-full" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="team-value"
                      className={cn(
                        "inline-flex h-4 items-center rounded-full px-1.5 py-0 text-[9px] leading-none",
                        ledgerPillClass(row.team, row.teamTone),
                      )}
                      initial={{ opacity: 0, filter: "blur(8px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {row.team}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* EMAIL */}
              <div className="text-right">
                <AnimatePresence mode="wait" initial={false}>
                  {isActive && phase !== "revealed" ? (
                    <motion.div
                      key="email-loading"
                      className="flex justify-end"
                      initial={{ opacity: 0, filter: "blur(6px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.25 }}
                    >
                      <Skeleton className="h-4 w-20 rounded-none" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="email-value"
                      className="inline-block max-w-[96px] truncate leading-none text-muted-foreground"
                      initial={{ opacity: 0, filter: "blur(8px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {row.email}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </TableCell>
    </>
  );
}

export function DataAnalysisAiTable({
  rows = defaultDataAnalysisRows,
  typingRowId = "row-total",
  replayKey = 0,
  disableAnimation = false,
  onTypingEnd,
}: DataAnalysisAiTableProps) {
  const activeRow = useMemo(
    () =>
      disableAnimation ? undefined : rows.find((row) => row.id === typingRowId),
    [rows, typingRowId, disableAnimation],
  );

  return (
    <div className="relative overflow-x-auto overflow-y-hidden rounded-none border border-foreground/10 bg-[#fcfcfd] dark:bg-[#111214]">
      <Table className="w-full min-w-0 table-fixed">
        <TableHeader>
          <TableRow className="h-8 min-h-8 max-h-8 border-b border-foreground/10 bg-[#f1f3f5] hover:bg-[#f1f3f5] dark:bg-[#191a1d] dark:hover:bg-[#191a1d]">
            <TableHead className="h-8 w-8 px-2 text-center">
              <Checkbox />
            </TableHead>

            <TableHead className="h-8 w-[44%] border-l border-foreground/10 px-2">
              Metric
            </TableHead>

            <TableHead className="h-8 w-[24%] border-l border-foreground/10 px-2">
              Ledger
            </TableHead>

            <TableHead className="h-8 w-[32%] border-l border-foreground/10 px-3 text-right">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;
            const isActive = row.id === activeRow?.id;

            return (
              <TableRow
                key={row.id}
                className={cn(
                  "h-8 min-h-8 max-h-8 bg-[#fcfcfd] dark:bg-[#111214]",
                  index % 2 !== 0 && "bg-[#f3f4f6] dark:bg-[#18181b]",
                  !isLast && "border-b border-foreground/10",
                )}
              >
                <AnimatedRow
                  row={row}
                  isActive={isActive}
                  replayKey={replayKey}
                  disableAnimation={disableAnimation}
                  onTypingEnd={onTypingEnd}
                />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background/95 via-background/70 to-transparent" />
    </div>
  );
}
