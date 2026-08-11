'use client';

import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils.js';

/* ── Tabs ───────────────────────────────────────────────────────────────
 * A segmented control whose active pill slides between tabs and, while an
 * inactive tab is hovered, stretches ("pulls") toward the cursor for a
 * magnetic feel. A clipped, inverted duplicate of the labels stays glued to
 * the base labels underneath, so text flips colour exactly as the pill
 * passes over it — including the partial reveal during the pull.
 *
 * Single-select only: it switches one value, so the buttons carry
 * `aria-pressed` rather than the tab/tabpanel roles, which would promise
 * associated panels and arrow-key navigation this control doesn't provide.
 */

/** One segment. `id` is the value handed back to `onChange`. */
export type Tab<T extends string = string> = {
  id: T;
  label: string;
  badge?: string;
};

// How far the pill reaches toward the hovered tab (fraction of the gap).
const PULL = 0.035;

type Rect = { left: number; width: number };

// Target pill rect: the active tab at rest, or stretched toward a hovered
// neighbour so its leading edge reaches partway across the gap.
function pillTarget(activeIdx: number, hoverIdx: number | null, rects: Rect[], pull: number): Rect {
  const active = rects[activeIdx];
  if (!active) throw new Error(`No rect at index ${activeIdx}`);
  if (hoverIdx === null || hoverIdx === activeIdx) return active;

  const hover = rects[hoverIdx];
  if (!hover) return active;
  const activeRight = active.left + active.width;
  const hoverRight = hover.left + hover.width;

  const left = Math.min(active.left, active.left + (hover.left - active.left) * pull);
  const right = Math.max(activeRight, activeRight + (hoverRight - activeRight) * pull);
  return { left, width: right - left };
}

// Shared box so the base labels and the inverted duplicate measure identically.
const labelBox = 'flex items-center gap-2.5 px-5 py-1.5 font-semibold text-[13px]';
const badgeBox = 'font-bold text-(--color-accent-brand-soft) text-[11px] whitespace-nowrap';

export type TabsProps<T extends string> = {
  tabs: readonly Tab<T>[];
  value: T;
  onChange: (v: T) => void;
  /** Accessible name for the group, e.g. "Billing period". */
  label: string;
  className?: string;
};

export function Tabs<T extends string>({ tabs, value, onChange, label, className }: TabsProps<T>) {
  const reduced = useReducedMotion();
  const pull = reduced ? 0 : PULL;

  const trackRef = useRef<HTMLDivElement>(null);

  const [rects, setRects] = useState<Rect[]>([]);
  const [trackWidth, setTrackWidth] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const foundIdx = tabs.findIndex((t) => t.id === value);
  const activeIdx = foundIdx === -1 ? 0 : foundIdx;

  const springConfig = reduced ? { stiffness: 700, damping: 60 } : { stiffness: 420, damping: 34, mass: 0.7 };
  const pillLeft = useSpring(0, springConfig);
  const pillWidth = useSpring(0, springConfig);
  const innerX = useTransform(pillLeft, (v) => -v);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setTrackWidth(track.offsetWidth);
    const btns = track.querySelectorAll<HTMLButtonElement>('button[data-index]');
    setRects(
      Array.from(btns, (el) => ({
        left: el.offsetLeft,
        width: el.offsetWidth,
      })),
    );
  }, []);

  // biome-ignore lint/plugin: measures live DOM layout under a ResizeObserver — post-render measurement, no render-time equivalent.
  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure]);

  // biome-ignore lint/plugin: imperatively drives the pill's spring motion values toward a layout-derived target.
  useEffect(() => {
    if (rects.length !== tabs.length) return;
    const target = pillTarget(activeIdx, hovered, rects, pull);
    if (ready) {
      pillLeft.set(target.left);
      pillWidth.set(target.width);
    } else {
      pillLeft.jump(target.left);
      pillWidth.jump(target.width);
      setReady(true);
    }
  }, [rects, tabs.length, activeIdx, hovered, pull, ready, pillLeft, pillWidth]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => onChange(tabs[Number(e.currentTarget.dataset.index)]!.id),
    [onChange, tabs],
  );
  const handleEnter = useCallback((e: MouseEvent<HTMLButtonElement>) => setHovered(Number(e.currentTarget.dataset.index)), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  return (
    <fieldset
      aria-label={label}
      className={cn('inline-flex items-center rounded-full border border-(--color-border) bg-(--color-surface) p-1', className)}
    >
      <div ref={trackRef} className="relative inline-flex items-center">
        {/* Base labels — muted at rest; hidden wherever the opaque pill sits over them. */}
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            data-index={i}
            onClick={handleClick}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            aria-pressed={value === tab.id}
            className={cn(labelBox, 'text-(--color-muted-foreground) hover:text-(--color-foreground)')}
          >
            {tab.label}
            {tab.badge ? <span className={badgeBox}>{tab.badge}</span> : null}
          </button>
        ))}

        {/* Sliding, pulling pill carrying a clipped inverted copy of the labels. */}
        <motion.div
          aria-hidden={true}
          className="pointer-events-none absolute inset-y-0 select-none overflow-hidden rounded-full bg-(--color-foreground)"
          style={{ left: pillLeft, width: pillWidth, opacity: ready ? 1 : 0 }}
        >
          <motion.div className="absolute inset-y-0 left-0 flex items-center" style={{ width: trackWidth, x: innerX }}>
            {tabs.map((tab) => (
              <span key={tab.id} className={cn(labelBox, 'text-(--color-surface)')}>
                {tab.label}
                {tab.badge ? <span className={badgeBox}>{tab.badge}</span> : null}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </fieldset>
  );
}
