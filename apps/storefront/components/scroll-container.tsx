"use client";

import { cn } from "@commerce/ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

function useScrollOverflow(ref: React.RefObject<HTMLDivElement | null>) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [ref, update]);

  return { canScrollLeft, canScrollRight };
}

function ScrollButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-opacity hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-800",
        direction === "left" ? "left-0" : "right-0",
      )}
      aria-label={`Scroll ${direction}`}
    >
      {direction === "left" ? (
        <ChevronLeftIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      ) : (
        <ChevronRightIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      )}
    </button>
  );
}

interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
}

export function ScrollContainer({ children, className }: ScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight } = useScrollOverflow(scrollRef);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative min-w-0">
      {canScrollLeft && (
        <ScrollButton direction="left" onClick={() => scroll("left")} />
      )}

      <div
        ref={scrollRef}
        className={cn(
          "-mx-2 overflow-x-auto px-2 py-2 scrollbar-thin",
          className,
        )}
      >
        {children}
      </div>

      {canScrollRight && (
        <ScrollButton direction="right" onClick={() => scroll("right")} />
      )}
    </div>
  );
}
