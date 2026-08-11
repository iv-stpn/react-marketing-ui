'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useSyncExternalStore } from 'react';
import { cn } from '../lib/utils.js';

/* ── One-shot ticking store ─────────────────────────────── */

let tick = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (timer === null)
    timer = setInterval(() => {
      tick += 1;
      for (const l of listeners) l();
    }, ROTATE_MS);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => tick;
const getServerSnapshot = () => 0;

/* ── Component ──────────────────────────────────────────── */

const ROTATE_MS = 4000;

export type BadgeEntry = {
  icon: ReactNode;
  label: string;
};

export type RollingBadgeProps = {
  badges: BadgeEntry[];
  className?: string;
};

export function RollingBadge({ badges, className }: RollingBadgeProps) {
  const index = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) % badges.length;
  const badge = badges[index];

  if (badges.length === 0 || !badge) return null;

  return (
    <motion.div
      layout={true}
      className={cn(
        'relative inline-flex h-8 items-center overflow-hidden rounded-full border border-(--color-border) bg-background px-3.5 shadow-sm',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={index}
          layout="position"
          initial={{ y: '120%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-120%', opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 320,
            damping: 32,
          }}
          className="flex items-center gap-1.5 whitespace-nowrap font-medium text-[12.5px]"
        >
          <span className="h-3.5 w-3.5 shrink-0" aria-hidden={true}>
            {badge.icon}
          </span>
          {badge.label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
