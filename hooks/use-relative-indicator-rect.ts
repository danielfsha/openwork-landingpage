import { useCallback, useLayoutEffect, useRef, useState } from "react";

type IndicatorRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const EMPTY_RECT: IndicatorRect = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
};

type UseRelativeIndicatorRectOptions<Key extends string> = {
  activeKey: Key | null;
};

export function useRelativeIndicatorRect<
  Key extends string,
  ContainerEl extends HTMLElement = HTMLDivElement,
  ItemEl extends HTMLElement = HTMLElement,
>({ activeKey }: UseRelativeIndicatorRectOptions<Key>) {
  const [activeRect, setActiveRect] = useState<IndicatorRect>(EMPTY_RECT);
  const containerRef = useRef<ContainerEl | null>(null);
  const itemRefs = useRef(new Map<Key, ItemEl>());

  const measureActiveRect = useCallback(
    (key: Key | null = activeKey) => {
      const container = containerRef.current;
      const item = key ? itemRefs.current.get(key) : null;

      if (!container || !item) {
        setActiveRect(EMPTY_RECT);
        return;
      }

      const itemRect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setActiveRect({
        top: itemRect.top - containerRect.top,
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
        height: itemRect.height,
      });
    },
    [activeKey],
  );

  useLayoutEffect(() => {
    measureActiveRect(activeKey);
  }, [activeKey, measureActiveRect]);

  useLayoutEffect(() => {
    if (!activeKey) {
      return;
    }

    const container = containerRef.current;
    const item = itemRefs.current.get(activeKey);

    if (!container || !item) {
      return;
    }

    const updateRect = () => {
      measureActiveRect(activeKey);
    };

    const observer = new ResizeObserver(updateRect);
    observer.observe(container);
    observer.observe(item);
    window.addEventListener("resize", updateRect);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRect);
    };
  }, [activeKey, measureActiveRect]);

  return {
    activeRect,
    containerRef,
    itemRefs,
    measureActiveRect,
  };
}
