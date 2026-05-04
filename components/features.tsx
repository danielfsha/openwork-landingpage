"use client";

import { useCallback, useEffect } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { useAnimate } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DraftFollowupIllustration } from "./feature-draft-followup-illustration";
import { DataAnalysisIllustration } from "./feature-data-analysis-illustration";
import { TaskSchedulingIllustration } from "./feature-task-scheduling-illustration";
import { useFeatureSequence } from "@/hooks/use-feature-sequence";

const featureCards = [
  {
    id: "01",
    title: "Data Analysis",
    description:
      "Analyze finance sheets from Excel or pasted ledgers to surface revenue, margin, and cash insights instantly.",
    backgroundImage: "/images/gradient-1.jpg",
  },
  {
    id: "02",
    title: "Draft follow-up and reschedule",
    description:
      "Use data analysis insights to draft a personalized follow-up, then reschedule the next touchpoint automatically.",
    backgroundImage: "/images/gradient-2.jpg",
  },

  {
    id: "03",
    title: "Task Scheduling",
    description:
      "Plan timelines, assign owners, and keep delivery on schedule with a clear project view.",
    backgroundImage: "/images/gradient-3.jpg",
  },
] as const;

function FeatureMediaFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[260px] overflow-hidden px-2 pt-4 md:h-full">
      {children}
    </div>
  );
}

function FeaturePreview({
  id,
  isActive,
  replayKey,
  onSequenceComplete,
}: {
  id: string;
  isActive: boolean;
  replayKey: string | number;
  onSequenceComplete: () => void;
}) {
  if (id === "01") {
    return (
      <DataAnalysisIllustration
        isActive={isActive}
        replayKey={replayKey}
        onSequenceComplete={onSequenceComplete}
      />
    );
  }

  if (id === "02") {
    return (
      <DraftFollowupIllustration
        isActive={isActive}
        replayKey={replayKey}
        onSequenceComplete={onSequenceComplete}
      />
    );
  }

  return (
    <TaskSchedulingIllustration
      isActive={isActive}
      replayKey={replayKey}
      onSequenceComplete={onSequenceComplete}
    />
  );
}

function HighlightChip({
  label,
  id,
  isActive,
}: {
  label: string;
  id: string;
  isActive: boolean;
}) {
  return (
    <span className="inline-flex items-start gap-[2px]" data-chip-id={id}>
      <span
        className={cn(
          "inline-flex items-center rounded-md px-2 py-[1px] text-[0.92em] leading-[1.05] font-medium",
          isActive
            ? // ? "bg-[#f97316]/20 text-[#f97316]"
              "bg-foreground/10 text-muted-foreground"
            : "",
        )}
      >
        {label}
      </span>
      {/* <sup
        className={cn(
          "-ml-[1px] text-[11px] leading-none",
          isActive ? "text-[#f97316]" : "text-muted-foreground",
        )}
      >
        {id}
      </sup> */}
    </span>
  );
}

export function Features() {
  const [scope, animate] = useAnimate();
  const {
    activeIndex: activeCardIndex,
    activationId,
    completeActive,
  } = useFeatureSequence({
    count: featureCards.length,
    pauseMs: 900,
  });

  const handleCardComplete = useCallback(
    (index: number) => {
      completeActive(index);
    },
    [completeActive],
  );

  useEffect(() => {
    const activeId = featureCards[activeCardIndex]?.id;

    if (!activeId) {
      return;
    }

    animate(
      `[data-chip-id='${activeId}']`,
      {
        opacity: [0.72, 1, 1],
        filter: ["blur(1px)", "blur(0px)"],
      },
      {
        duration: 0.52,
        ease: "easeOut",
      },
    );
  }, [activeCardIndex, animate]);

  return (
    <SectionWrapper position="middle">
      <section className="py-16 md:py-24">
      <div className="mx-auto">
        <h2
          ref={scope}
          className="max-w-4xl px-4 lg:px-12 text-[2rem] font-normal leading-[1.24] tracking-tight text-foreground"
        >
          <span className="">OpenWork </span>
          <HighlightChip
            label="drafts outreach"
            id="01"
            isActive={activeCardIndex === 0}
          />
          <span className="text-foreground"> from live workspace context,</span>
          <HighlightChip
            label="analyzes data"
            id="02"
            isActive={activeCardIndex === 1}
          />
          <span> to surface actionable insights, and</span>
          <HighlightChip
            label="schedules tasks"
            id="03"
            isActive={activeCardIndex === 2}
          />
          <span className="text-foreground">
            {" "}
            to coordinate work and deliver on time.
          </span>
        </h2>

        <div className="mt-12 grid items-stretch md:grid-cols-3">
          {featureCards.map((card, index) => {
            const isActive = index === activeCardIndex;

            return (
              <Card
                showCorners
                key={card.id}
                className={cn(
                  "h-full min-h-[440px] bg-cover bg-center bg-no-repeat md:min-h-[500px]",
                )}
                style={{ backgroundImage: `url('${card.backgroundImage}')` }}
              >
                <CardHeader className="px-0 pb-0 pt-4">
                  <div className="px-5 text-xs font-semibold tracking-[0.12em] text-black">
                    {card.id}
                  </div>
                  <CardTitle className="px-5 pt-3 text-[1.35rem] font-medium leading-[1.1] text-black">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="px-5 pb-5 pt-3 text-[1.02rem] leading-relaxed text-black">
                    {card.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 px-0 pb-0 pt-0">
                  <FeatureMediaFrame>
                    <FeaturePreview
                      id={card.id}
                      isActive={isActive}
                      replayKey={`${card.id}-${activationId}`}
                      onSequenceComplete={() => handleCardComplete(index)}
                    />
                  </FeatureMediaFrame>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
    </SectionWrapper>
  );
}
