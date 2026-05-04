"use client";

import { useEffect, useRef, useState } from "react";

type TaskSchedulingIllustrationProps = {
  isActive?: boolean;
  replayKey?: string | number;
  onSequenceComplete?: () => void;
};

type LaneConfig = {
  id: string;
  label: string;
  icon: string;
  accent: string;
  statusBg: string;
  top: string;
  fill: string;
  future: string;
  futureBorder: string;
  markerOne: number;
  markerTwo: number;
  markerOneTone: string;
  markerTwoTone: string;
  milestone: string;
  milestone2: string;
  start: number;
  end: number;
};

type LaneWindow = {
  start: number;
  end: number;
};

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];

const lanes: LaneConfig[] = [
  {
    id: "ui-refresh",
    label: "UI Refresh",
    icon: "✎",
    accent: "text-[#f97316]",
    statusBg: "bg-[#f59e0b]/18",
    top: "top-[44px]",
    fill: "bg-foreground/[0.03]",
    future: "bg-[#f97316]/10",
    futureBorder: "border-[#f97316]/35",
    markerOne: 0.32,
    markerTwo: 0.68,
    markerOneTone: "bg-foreground/40 border-foreground/30",
    markerTwoTone: "bg-background border-[#ff5c64]",
    milestone: "Core screens",
    milestone2: "Polish",
    start: 2,
    end: 7,
  },
  {
    id: "split-fares",
    label: "Split fares",
    icon: "◫",
    accent: "text-[#16a34a]",
    statusBg: "bg-[#16a34a]/14",
    top: "top-[108px]",
    fill: "bg-foreground/[0.03]",
    future: "bg-[#0ea5e9]/08",
    futureBorder: "border-[#0ea5e9]/30",
    markerOne: 0.22,
    markerTwo: 0.72,
    markerOneTone: "bg-foreground/35 border-foreground/30",
    markerTwoTone: "bg-background border-[#7dd3fc]",
    milestone: "Internal",
    milestone2: "Public beta",
    start: 1,
    end: 7,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function TaskSchedulingIllustration({
  isActive = true,
  replayKey = 0,
  onSequenceComplete,
}: TaskSchedulingIllustrationProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const laneDragRef = useRef<{ laneId: string; edge: "start" | "end" } | null>(
    null,
  );
  const timelineScaleRef = useRef<{
    startX: number;
    startMonthWidth: number;
  } | null>(null);
  const [monthWidth, setMonthWidth] = useState(72);
  const [laneWindows, setLaneWindows] = useState<Record<string, LaneWindow>>(
    () =>
      Object.fromEntries(
        lanes.map((lane) => [lane.id, { start: lane.start, end: lane.end }]),
      ),
  );

  const timelineWidth = monthWidth * months.length;

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = window.setTimeout(() => {
      onSequenceComplete?.();
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isActive, onSequenceComplete, replayKey]);

  useEffect(() => {
    function monthFromClientX(clientX: number) {
      const rect = timelineRef.current?.getBoundingClientRect();

      if (!rect || rect.width <= 0) {
        return 0;
      }

      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return clamp(Math.round(ratio * months.length), 0, months.length);
    }

    function handlePointerMove(event: PointerEvent) {
      const scaleDrag = timelineScaleRef.current;

      if (scaleDrag) {
        const deltaX = event.clientX - scaleDrag.startX;
        setMonthWidth(
          clamp(Math.round(scaleDrag.startMonthWidth + deltaX), 72, 210),
        );
        return;
      }

      const laneDrag = laneDragRef.current;

      if (!laneDrag) {
        return;
      }

      const snappedMonth = monthFromClientX(event.clientX);

      setLaneWindows((current) => {
        const active = current[laneDrag.laneId];

        if (!active) {
          return current;
        }

        if (laneDrag.edge === "start") {
          return {
            ...current,
            [laneDrag.laneId]: {
              start: clamp(
                Math.min(snappedMonth, active.end - 1),
                0,
                months.length - 1,
              ),
              end: active.end,
            },
          };
        }

        return {
          ...current,
          [laneDrag.laneId]: {
            start: active.start,
            end: clamp(
              Math.max(snappedMonth, active.start + 1),
              1,
              months.length,
            ),
          },
        };
      });
    }

    function handlePointerUp() {
      laneDragRef.current = null;
      timelineScaleRef.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div className="relative h-full select-none p-3">
      <div className="relative h-full rounded-md border border-foreground/15 bg-[rgba(255,255,255,0.72)] p-1 dark:bg-[rgba(18,18,18,0.78)]">
        <div className="relative h-full overflow-x-auto overflow-y-hidden rounded-[6px] border border-foreground/10 bg-[rgba(248,250,252,0.9)] w-full dark:bg-[rgba(14,14,14,0.88)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-10 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-10 bg-gradient-to-l from-background/95 via-background/70 to-transparent" />

          <div
            ref={timelineRef}
            className="relative h-full"
            style={{ width: `${timelineWidth}px`, minWidth: "100%" }}
          >
            <button
              type="button"
              aria-label="Resize timeline month scale"
              className="absolute inset-x-0 top-0 z-40 h-7 cursor-ew-resize border-b border-transparent"
              onPointerDown={(event) => {
                event.preventDefault();
                timelineScaleRef.current = {
                  startX: event.clientX,
                  startMonthWidth: monthWidth,
                };
              }}
            />

            <div className="absolute inset-y-0 left-0 right-0 grid grid-cols-8">
              {months.map((month, index) => (
                <div key={month} className="relative">
                  <div className="absolute left-0 right-0 top-0 h-7 border-b border-foreground/10 px-2 -translate-y-1 text-muted-foreground">
                    <span className="inline-block pt-2 tracking-wide">
                      {month}
                    </span>
                  </div>

                  {index < months.length - 1 ? (
                    <span className="pointer-events-none absolute bottom-0 right-0 top-7 w-px bg-[repeating-linear-gradient(to_bottom,rgba(120,130,150,0.32)_0_2px,transparent_2px_5px)]" />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 top-7 bg-[linear-gradient(to_bottom,transparent_0%,transparent_16%,rgba(120,130,150,0.04)_16%,rgba(120,130,150,0.04)_17%,transparent_17%,transparent_100%)]" />

            {lanes.map((lane) => {
              const window = laneWindows[lane.id];
              const left = `${(window.start / months.length) * 100}%`;
              const width = `${((window.end - window.start) / months.length) * 100}%`;

              return (
                <div
                  key={lane.id}
                  className={`absolute ${lane.top}`}
                  style={{ left, width }}
                >
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-foreground/90">
                    <span className="text-[12px] text-foreground/70">
                      {lane.icon}
                    </span>
                    <span className="tracking-[-0.01em]">{lane.label}</span>
                  </div>

                  <div className="group relative h-8 rounded-[4px] border border-foreground/14 bg-background/70">
                    <div
                      className="absolute inset-[1px] rounded-[4px]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(-45deg, rgba(251,146,60,0.84) 0 1.5px, rgba(249,115,22,0.18) 1.5px 3.5px, transparent 3.5px 5px)",
                        backgroundColor: "rgba(251,146,60,0.18)",
                        boxShadow: "inset 0 0 0 1px rgba(251,146,60,0.22)",
                        WebkitMaskImage:
                          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 14%, rgba(0,0,0,0.48) 40%, rgba(0,0,0,0.84) 72%, rgba(0,0,0,1) 100%)",
                        maskImage:
                          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 14%, rgba(0,0,0,0.48) 40%, rgba(0,0,0,0.84) 72%, rgba(0,0,0,1) 100%)",
                      }}
                    />
                    <div className="absolute inset-y-[7px] left-2 right-2 rounded-full bg-foreground/[0.04]" />
                    <div
                      className={`absolute inset-y-0 left-0 rounded-l-[4px] ${lane.fill}`}
                    />
                    <div
                      className={`absolute inset-y-0 right-0 w-[28%] rounded-r-[4px] border-l ${lane.future} ${lane.futureBorder} border-dashed`}
                    />

                    <button
                      type="button"
                      aria-label={`Resize ${lane.label} start`}
                      className="absolute inset-y-0 left-0 z-20 w-3 cursor-ew-resize"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        laneDragRef.current = {
                          laneId: lane.id,
                          edge: "start",
                        };
                      }}
                    />
                    <button
                      type="button"
                      aria-label={`Resize ${lane.label} end`}
                      className="absolute inset-y-0 right-0 z-20 w-3 cursor-ew-resize"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        laneDragRef.current = { laneId: lane.id, edge: "end" };
                      }}
                    />

                    <span className="pointer-events-none absolute left-1 top-1/2 z-20 h-3 w-px -translate-y-1/2 bg-foreground/18 opacity-60 transition-opacity group-hover:opacity-100" />
                    <span className="pointer-events-none absolute left-2 top-1/2 z-20 h-3 w-px -translate-y-1/2 bg-foreground/12 opacity-40 transition-opacity group-hover:opacity-100" />
                    <span className="pointer-events-none absolute right-1 top-1/2 z-20 h-3 w-px -translate-y-1/2 bg-foreground/18 opacity-60 transition-opacity group-hover:opacity-100" />
                    <span className="pointer-events-none absolute right-2 top-1/2 z-20 h-3 w-px -translate-y-1/2 bg-foreground/12 opacity-40 transition-opacity group-hover:opacity-100" />

                    <span
                      className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border ${lane.markerOneTone}`}
                      style={{ left: `${lane.markerOne * 100}%` }}
                    />
                    <span
                      className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-[1.5px] ${lane.markerTwoTone}`}
                      style={{ left: `${lane.markerTwo * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
