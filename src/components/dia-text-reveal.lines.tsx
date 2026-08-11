'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '../lib/utils.js';

type ExitingLineProps = {
  text: string;
  textColor: string;
  duration: number;
  fallDuration: number;
  opacityEase: (t: number) => number;
  wrap?: boolean;
  onDone: () => void;
};

type HeightClipperProps = {
  height?: number;
  delay: number;
  children: ReactNode;
};

type WidthReservationProps = { texts: string[] };

export function HeightClipper({ height, delay, children }: HeightClipperProps) {
  return (
    <motion.span
      className="block w-full overflow-hidden"
      animate={height === undefined ? {} : { height }}
      transition={{
        height: { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay },
      }}
    >
      {children}
    </motion.span>
  );
}

export function ExitingLine({ text, textColor, duration, fallDuration, opacityEase, wrap = false, onDone }: ExitingLineProps) {
  return (
    <motion.span
      aria-hidden={true}
      className={cn(
        wrap
          ? 'pointer-events-none absolute top-0 left-0 w-full'
          : 'pointer-events-none absolute top-0 left-1/2 whitespace-nowrap',
      )}
      style={{ color: textColor }}
      initial={wrap ? { opacity: 1, y: 0 } : { opacity: 1, x: '-50%', y: 0 }}
      animate={wrap ? { opacity: 0, y: 14 } : { opacity: 0, x: '-50%', y: 14 }}
      transition={{
        opacity: { duration, ease: opacityEase },
        y: { duration: fallDuration, ease: [0.22, 0.61, 0.36, 1] },
      }}
      onAnimationComplete={onDone}
    >
      {text}
    </motion.span>
  );
}

export function WidthReservation({ texts }: WidthReservationProps) {
  return (
    <span aria-hidden={true} className="invisible block h-0 overflow-hidden">
      {texts.map((t) => (
        <span key={t} className="block">
          {t}
        </span>
      ))}
    </span>
  );
}
