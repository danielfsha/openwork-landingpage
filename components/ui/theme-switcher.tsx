"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, AppWindowMac } from "lucide-react";
import { useTheme } from "next-themes";

import { useRelativeIndicatorRect } from "../../hooks/use-relative-indicator-rect";

interface THEME {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// system, light and dark
const MAIN_STEPS: THEME[] = [
  { id: "system", label: "System", icon: <AppWindowMac size={14} /> },
  { id: "light", label: "Light", icon: <SunIcon size={14} /> },
  { id: "dark", label: "Dark", icon: <MoonIcon size={14} /> },
];

const INDICATOR_TRANSITION = {
  type: "spring",
  bounce: 0.15,
  duration: 0.25,
} as const;

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { activeRect, containerRef, itemRefs } = useRelativeIndicatorRect<
    string,
    HTMLDivElement,
    HTMLButtonElement
  >({
    activeKey: mounted ? (theme ?? "system") : "system",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentStepId = mounted ? (theme ?? "system") : "system";

  return (
    <div
      ref={containerRef}
      className="relative flex items-center overflow-hidden rounded-full border bg-card"
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
          onClick={() => setTheme(tab.id)}
          className={`relative z-10 flex items-center rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors duration-300 ${tab.id === currentStepId && "text-primary-foreground"}`}
          aria-pressed={tab.id === currentStepId}
          type="button"
        >
          {tab.icon}
        </button>
      ))}
      <motion.div
        layoutId="tab-indicator"
        initial={false}
        animate={activeRect}
        transition={INDICATOR_TRANSITION}
        className="absolute z-0 rounded-full bg-primary"
      />
    </div>
  );
};
