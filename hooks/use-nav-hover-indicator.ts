import { useState } from "react";

import { useRelativeIndicatorRect } from "./use-relative-indicator-rect";

export function useNavHoverIndicator() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const {
    activeRect: hoverRect,
    containerRef: navContainerRef,
    itemRefs,
    measureActiveRect,
  } = useRelativeIndicatorRect<string, HTMLDivElement, HTMLElement>({
    activeKey: hoveredItem,
  });

  const handleMouseEnter = (key: string) => {
    setHoveredItem(key);
    measureActiveRect(key);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return {
    hoveredItem,
    hoverRect,
    navContainerRef,
    itemRefs,
    handleMouseEnter,
    handleMouseLeave,
  };
}
