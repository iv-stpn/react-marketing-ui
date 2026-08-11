'use client';

import { motion, useInView } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { easeOut } from '../lib/ease.js';

/** Holds an entrance back until an external cue is ready. */
type Gate = {
  /** While `false`, the entrance stays in its initial state even once in view. @defaultValue `true` */
  start?: boolean;
};

export type FadeInProps = Gate & {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
};

export type StaggerProps = Gate & {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
};

export type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
};

/** Shared viewport config so every entrance in this file triggers at the same threshold. */
const viewport = { once: true, margin: '-60px' } as const;

/** Rows in a grid can differ by a fraction of a pixel; treat near-equal tops as the same row. */
const ROW_TOLERANCE = 8;

/** Registers a newly visible item and receives back the delay it should animate with. */
type RegisterItem = (element: Element, reveal: (delay: number) => void) => void;

const StaggerContext = createContext<RegisterItem | null>(null);

/**
 * Wraps children in a framer-motion div that fades+slides up
 * when it enters the viewport.
 */
export function FadeIn({ children, className, delay = 0, duration = 1, yOffset = 20, start = true }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewport);
  const hidden = { opacity: 0, y: yOffset };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView && start ? { opacity: 1, y: 0 } : hidden}
      transition={{ duration, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Coordinates staggered entrances for the `<StaggerItem>`s inside it.
 *
 * Unlike framer-motion's `staggerChildren`, the cascade is driven by each
 * item's own visibility rather than the container's: items that scroll into
 * view together are batched into one frame, sorted top-to-bottom then
 * left-to-right, and given progressively later delays.
 *
 * While `start` is `false`, items that come into view queue up instead of
 * revealing, so the whole cascade lands as one batch when the cue arrives.
 */
export function Stagger({ children, className, staggerDelay = 0.15, baseDelay = 0, start = true }: StaggerProps) {
  const queue = useRef<{ element: Element; reveal: (delay: number) => void }[]>([]);
  const frame = useRef<number | null>(null);
  const started = useRef(start);
  started.current = start;

  const flush = useCallback(() => {
    frame.current = null;
    const batch = queue.current;
    queue.current = [];

    const positioned = batch.map((entry) => ({
      ...entry,
      rect: entry.element.getBoundingClientRect(),
    }));
    positioned.sort((a, b) =>
      Math.abs(a.rect.top - b.rect.top) > ROW_TOLERANCE ? a.rect.top - b.rect.top : a.rect.left - b.rect.left,
    );
    for (const [index, entry] of positioned.entries()) entry.reveal(baseDelay + index * staggerDelay);
  }, [baseDelay, staggerDelay]);

  const register = useCallback<RegisterItem>(
    (element, reveal) => {
      queue.current.push({ element, reveal });
      if (started.current) frame.current ??= requestAnimationFrame(flush);
    },
    [flush],
  );

  // biome-ignore lint/plugin: drains an imperative queue of pending reveals when the gate opens.
  useEffect(() => {
    if (start && queue.current.length > 0) frame.current ??= requestAnimationFrame(flush);
  }, [start, flush]);

  return (
    <StaggerContext value={register}>
      <div className={className}>{children}</div>
    </StaggerContext>
  );
}

/** Use inside <Stagger> to mark each animated child. */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const register = useContext(StaggerContext);
  const ref = useRef<HTMLDivElement>(null);
  const claimed = useRef(false);
  const [delay, setDelay] = useState<number | null>(null);

  const onViewportEnter = useCallback(() => {
    if (claimed.current) return;
    claimed.current = true;
    const element = ref.current;
    if (register && element) register(element, setDelay);
    else setDelay(0);
  }, [register]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={delay === null ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay ?? 0, ease: easeOut }}
      viewport={viewport}
      onViewportEnter={onViewportEnter}
    >
      {children}
    </motion.div>
  );
}
