"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** delay in ms before the element animates in */
  delay?: number;
  /** re-trigger every time it scrolls into view */
  repeat?: boolean;
};

/**
 * Reveal-on-scroll wrapper. Adds `data-shown` once the element enters the
 * viewport; the actual transition lives in `.reveal` in globals.css.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  repeat = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (!repeat) observer.unobserve(entry.target);
        } else if (repeat) {
          setShown(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <Tag
      ref={ref as never}
      data-shown={shown}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
