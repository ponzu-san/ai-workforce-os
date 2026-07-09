"use client";

import { useEffect, type RefObject } from "react";

function isElementHorizontallyVisible(
  container: HTMLElement,
  target: HTMLElement,
): boolean {
  const targetLeft = target.offsetLeft;
  const targetRight = targetLeft + target.clientWidth;
  const visibleLeft = container.scrollLeft;
  const visibleRight = visibleLeft + container.clientWidth;

  return targetLeft >= visibleLeft && targetRight <= visibleRight;
}

export function scrollElementIntoHorizontalView(
  container: HTMLElement,
  target: HTMLElement,
  behavior: ScrollBehavior = "smooth",
): void {
  if (isElementHorizontallyVisible(container, target)) return;

  const targetLeft =
    target.offsetLeft - container.clientWidth / 2 + target.clientWidth / 2;

  container.scrollTo({
    left: Math.max(0, targetLeft),
    behavior,
  });
}

export function useHorizontalScrollIntoView(
  containerRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  activeKey: string | number | null,
): void {
  useEffect(() => {
    if (activeKey === null) return;
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    scrollElementIntoHorizontalView(container, target);
  }, [activeKey, containerRef, targetRef]);
}
