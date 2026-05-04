import React from "react";
import { cn } from "@/lib/utils";
import { CornerDecoration } from "./corner-decoration";

interface SectionWrapperProps {
  children: React.ReactNode;
  position?: "top" | "middle" | "bottom";
  className?: string;
  as?: "section" | "div" | "header" | "footer";
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  position = "middle",
  className = "",
  as: Component = "section",
}) => {
  return (
    <Component className={cn("relative w-screen", className)}>
      {/* Top row */}
      {position === "top" && (<div className="flex w-full">
        <div className="w-6 lg:w-64 relative overflow-hidden">
          <CornerDecoration position="bottom-right" />
        </div>

        <div
          className={cn(
            "relative overflow-hidden flex-1",
            "border-l border-r border-foreground/10",
          )}
        >
          <CornerDecoration position="bottom-left" />
          <CornerDecoration position="bottom-right" />
          {children}
        </div>

        <div className="w-6 lg:w-64 relative overflow-hidden">
          <CornerDecoration position="bottom-left" />
        </div>
      </div>)}

      {/* middle row */}
      {position === "middle" && (<div className="flex w-full">
        <div className="w-6 lg:w-64 relative border-l border-b border-t border-foreground/10 overflow-hidden">
          <CornerDecoration position="top-right" />
          <CornerDecoration position="bottom-right" />
        </div>

        <div
          className={cn(
            "relative overflow-hidden flex-1",
            "border-l border-r border-t border-b border-foreground/10",
          )}
        >
          <CornerDecoration position="top-left" />
          <CornerDecoration position="top-right" />
          <CornerDecoration position="bottom-left" />
          <CornerDecoration position="bottom-right" />
          {children}
        </div>

        <div className="w-6 lg:w-64 relative border-b border-t border-r border-foreground/10 overflow-hidden">
          <CornerDecoration position="top-left" />
          <CornerDecoration position="bottom-left" />
        </div>
      </div>)}



      {/* Bottom row */}
      {position === "bottom" && (<div className="flex w-full">
        <div className="w-6 lg:w-64 relative overflow-hidden">
          <CornerDecoration position="top-right" />
        </div>

        <div
          className={cn(
            "relative overflow-hidden flex-1",
            "border-l border-r border-foreground/10",
          )}
        >
          <CornerDecoration position="top-left" />
          <CornerDecoration position="top-right" />
          {children}
        </div>

        <div className="w-6 lg:w-64 relative overflow-hidden">
          <CornerDecoration position="top-left" />
        </div>
      </div>)}
    </Component>
  );
};