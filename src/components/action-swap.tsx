'use client';
// Adapted from beui.dev/components/motion/action-swap (roll variant only).
// Upstream imports `motion/react`; this project is on framer-motion, and its
// blur/cascade animations and pre-styled <ActionSwapButton> are omitted — the
// button's variant classes reference `bg-card`/`bg-primary`, which this site
// doesn't define as --color-* tokens, so Tailwind would drop them silently.

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { EASE_OUT, EASE_OUT_CSS, SPRING_SWAP } from '../lib/ease.js';
import { cn } from '../lib/utils.js';

/** The outgoing half rolls out faster than the incoming half settles. */
const ROLL_EXIT_TRANSITION = { duration: 0.14, ease: EASE_OUT } as const;
const ROLL_BLUR = 'blur(3px)';

/** Rest state used under reduced motion — no travel, no blur. */
const AT_REST = { opacity: 1, y: 0, filter: 'blur(0px)' } as const;

/** Text travels in percentages so the roll scales with the line height. */
const TEXT_VARIANTS: Variants = {
  initial: { opacity: 0, y: '90%', filter: ROLL_BLUR },
  animate: { opacity: 1, y: '0%', filter: 'blur(0px)', transition: SPRING_SWAP },
  exit: { opacity: 0, y: '-90%', filter: ROLL_BLUR, transition: ROLL_EXIT_TRANSITION },
};

/** Icons travel in pixels — a glyph box has no line height to scale against. */
const ICON_VARIANTS: Variants = {
  initial: { opacity: 0, y: 12, filter: ROLL_BLUR },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: SPRING_SWAP },
  exit: { opacity: 0, y: -12, filter: ROLL_BLUR, transition: ROLL_EXIT_TRANSITION },
};

export type ActionSwapRollProps = {
  /** Identity of the current content — changing it triggers the roll. */
  value: string;
  children: ReactNode;
  className?: string;
};

/**
 * Rolls `children` up out of the box while the new content rolls in from below,
 * animating the box's width so labels of different lengths don't snap.
 *
 * The visible label is the accessible name, so for the duration of a swap both
 * the outgoing and incoming text are in the accessibility tree. Give the host
 * control an explicit `aria-label` when that ambiguity matters.
 */
export function ActionSwapRollText({ value, children, className }: ActionSwapRollProps) {
  const reduce = useReducedMotion() ?? false;
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();

  // Deliberately un-keyed: the invisible copy is re-measured after every render
  // so the box tracks content it can't diff (fonts finishing, text changing).
  useLayoutEffect(() => {
    const nextWidth = measureRef.current?.offsetWidth;
    if (!nextWidth) return;
    setWidth((current) => (current === nextWidth ? current : nextWidth));
  });

  return (
    <span
      className={cn('relative inline-block overflow-hidden whitespace-nowrap align-bottom', className)}
      style={{ width, transition: reduce ? undefined : `width 220ms ${EASE_OUT_CSS}` }}
    >
      {/* Width source: laid out in flow but never painted, so the absolutely
          positioned live copies below have something to size the box. */}
      <span ref={measureRef} aria-hidden={true} className="invisible inline-block whitespace-nowrap">
        {children}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          variants={TEXT_VARIANTS}
          initial={reduce ? false : 'initial'}
          animate={reduce ? AT_REST : 'animate'}
          exit={reduce ? undefined : 'exit'}
          className="absolute top-0 left-0 inline-block will-change-[opacity,filter,transform]"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Icon counterpart to {@link ActionSwapRollText}. `popLayout` pulls the outgoing
 * icon out of flow so the pair overlaps in one cell instead of sitting side by
 * side mid-swap. Always `aria-hidden` — icons here restate a visible label.
 */
export function ActionSwapRollIcon({ value, children, className }: ActionSwapRollProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <span className={cn('relative inline-grid shrink-0 place-items-center overflow-hidden', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          aria-hidden={true}
          variants={ICON_VARIANTS}
          initial={reduce ? false : 'initial'}
          animate={reduce ? AT_REST : 'animate'}
          exit={reduce ? undefined : 'exit'}
          className="col-start-1 row-start-1 inline-flex items-center justify-center will-change-[opacity,filter,transform]"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
