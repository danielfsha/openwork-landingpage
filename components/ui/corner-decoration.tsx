import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cornerDecorationVariants = cva("absolute pointer-events-none", {
  variants: {
    variant: {
      default: "text-border",
      secondary: "text-border",
      muted: "text-border",
      accent: "text-border",
    },
    position: {
      "top-left": "top-0 left-0 -rotate-90",
      "top-right": "top-0 right-0 rotate-0",
      "bottom-right": "bottom-0 right-0 rotate-90",
      "bottom-left": "bottom-0 left-0 rotate-180",
    },
  },
  defaultVariants: {
    variant: "default",
    position: "top-left",
  },
});

interface CornerDecorationProps extends VariantProps<
  typeof cornerDecorationVariants
> {
  size?: number;
  color?: string;
  className?: string;
  offset?: number;
}

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export const CornerDecoration: React.FC<CornerDecorationProps> = ({
  position = "top-left",
  variant = "default",
  size = 11,
  color,
  className = "",
  offset = -1,
}) => {
  const offsetStyles = {
    "top-left": { top: offset, left: offset },
    "top-right": { top: offset, right: offset },
    "bottom-right": { bottom: offset, right: offset },
    "bottom-left": { bottom: offset, left: offset },
  };

  return (
    <div
      className={cn(cornerDecorationVariants({ variant, position }), className)}
      style={offsetStyles[position as keyof typeof offsetStyles]}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.99 0.999091V10.99H9.99091V6.99364C9.99091 3.68294 7.30706 0.999091 3.99636 0.999091H0L4.36717e-08 0L10.99 9.17105e-07V0.999091Z"
          fill={color || "currentColor"}
        />
      </svg>
    </div>
  );
};

interface DecoratedBoxProps extends VariantProps<
  typeof cornerDecorationVariants
> {
  children: React.ReactNode;
  corners?: CornerPosition[];
  cornerSize?: number;
  cornerColor?: string;
  className?: string;
  cornerOffset?: number;
}

export const DecoratedBox: React.FC<DecoratedBoxProps> = ({
  children,
  corners = ["top-left", "top-right", "bottom-left", "bottom-right"],
  cornerSize = 11,
  cornerColor,
  variant = "default",
  className = "",
  cornerOffset = -1,
}) => {
  return (
    <div className={cn("relative", className)}>
      {corners.map((corner) => (
        <CornerDecoration
          key={corner}
          position={corner}
          variant={variant}
          size={cornerSize}
          color={cornerColor}
          offset={cornerOffset}
        />
      ))}
      {children}
    </div>
  );
};

export { cornerDecorationVariants };
