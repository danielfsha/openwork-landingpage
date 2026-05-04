"use client";

import { StepId, motion } from "motion/react";
import { SunIcon, MoonIcon, AppWindowMac } from "lucide-react";

import { useRelativeIndicatorRect } from "../../hooks/use-relative-indicator-rect";

interface THEME {
  id: StepId;
  label: string;
  icon: React.ReactNode;
}

// system, light and dark
const MAIN_STEPS: THEME[] = [
  { id: "system" as StepId, label: "System", icon: <AppWindowMac /> },
  { id: "light" as StepId, label: "Light", icon: <SunIcon /> },
  { id: "dark" as StepId, label: "Dark", icon: <MoonIcon /> },
];

const INDICATOR_TRANSITION = {
  type: "spring",
  bounce: 0.15,
  duration: 0.25,
} as const;

export const Tabs: React.FC<{
  setCurrentStep: (stepId: StepId) => void;
  currentStepId: StepId;
}> = ({ setCurrentStep, currentStepId }) => {
  const { activeRect, containerRef, itemRefs } = useRelativeIndicatorRect<
    StepId,
    HTMLDivElement,
    HTMLButtonElement
  >({
    activeKey: currentStepId,
  });

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1 rounded-full border bg-[#f2f6fb]/[.4] p-1"
    >
      {MAIN_STEPS.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(tab.id, el);
              return;
            }

            itemRefs.current.delete(tab.id);
          }}
          onClick={() => setCurrentStep(tab.id)}
          className={`relative z-10 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors duration-300 ${
            currentStepId === tab.id ? "text-white" : "text-slate-700"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
      <motion.div
        layoutId="tab-indicator"
        initial={false}
        animate={activeRect}
        transition={INDICATOR_TRANSITION}
        className="absolute rounded-full bg-blue-500"
      />
    </div>
  );
};
