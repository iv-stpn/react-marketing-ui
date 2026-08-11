/**
 * The moving gradient band that paints DiaTextReveal's glyphs, and the coverage math that
 * lets the outgoing line's fade track it exactly.
 *
 * The band moves by *sliding a static gradient*, not by rebuilding one per frame. Rebuilding
 * meant a JS callback, a style recalc, a fresh gradient rasterization and a
 * `background-clip: text` repaint on every frame — all main-thread-only work, so the sweep
 * stalled whenever the thread was contended (scrolling, WebGL render loops, React commits).
 * A fixed image offset by a CSS animation needs no script at all and lets the browser cache
 * the raster, which is what keeps the sweep moving while the page is being scrolled.
 */

import type { CSSProperties } from 'react';

/** Half-width of the colour band, in percent of the line. */
const BAND_HALF = 17;
/** Band centre at the start of a sweep — fully left of the line, so nothing is painted. */
const SWEEP_START = -BAND_HALF;
/** Band centre at the end of a sweep — fully right of the line, so everything is painted. */
const SWEEP_END = 100 + BAND_HALF;

/** Cubic in-out: the band accelerates in, then eases out. */
const sweepEaseFn = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Fraction of the line the sweep has painted at `progress` (0–1 of the sweep's duration).
 */
const coverageAt = (progress: number) => Math.min(1, (sweepEaseFn(progress) * (SWEEP_END - SWEEP_START)) / 100);

/**
 * Point in the sweep (0–1) at which the whole line is painted.
 */
const COVERAGE_SPAN = (() => {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (coverageAt(mid) < 1) lo = mid;
    else hi = mid;
  }
  return hi;
})();

const EXIT_FADE_BIAS = 0.4;

/** Easing for the outgoing line's fade, tracking how much of the incoming line is painted. */
const exitEase = (t: number) => coverageAt(t * COVERAGE_SPAN) ** EXIT_FADE_BIAS;

const makeExitEase = (leadFraction: number) => {
  if (leadFraction <= 0) return exitEase;
  if (leadFraction >= 1) return () => 0;
  return (t: number) => (t <= leadFraction ? 0 : exitEase((t - leadFraction) / (1 - leadFraction)));
};

/* ── Sliding-gradient geometry ───────────────────────────────────────── */

const SWEEP_SCALE = 3;
const BAND_HALF_IMAGE = BAND_HALF / SWEEP_SCALE;

const positionFor = (pos: number) => (pos - 50 * SWEEP_SCALE) / (1 - SWEEP_SCALE);

/** Position holding the band fully left of the line — nothing painted. */
const SWEEP_FROM = `${positionFor(SWEEP_START).toFixed(3)}%`;
/** Position holding the band fully right of the line — everything painted. */
const SWEEP_TO = `${positionFor(SWEEP_END).toFixed(3)}%`;
/** `background-size` for the oversized image the animation slides. */
const SWEEP_SIZE = `${SWEEP_SCALE * 100}% 100%`;

const EASE_SAMPLES = 24;
const sweepEaseCss = `linear(${Array.from({ length: EASE_SAMPLES + 1 }, (_, i) => sweepEaseFn(i / EASE_SAMPLES).toFixed(5)).join(
  ', ',
)})`;

function buildSweepGradient(colors: string[], textColor: string) {
  const bandStart = 50 - BAND_HALF_IMAGE;
  const bandEnd = 50 + BAND_HALF_IMAGE;
  const n = colors.length;

  const parts: string[] = [`${textColor} 0%`, `${textColor} ${bandStart.toFixed(3)}%`];
  for (const [i, c] of colors.entries()) {
    const pct = n === 1 ? 50 : bandStart + (i / (n - 1)) * BAND_HALF_IMAGE * 2;
    parts.push(`${c} ${pct.toFixed(3)}%`);
  }
  parts.push(`transparent ${bandEnd.toFixed(3)}%`, 'transparent 100%');

  return `linear-gradient(90deg, ${parts.join(', ')})`;
}

export type Sweep = { cycle: number; lead: boolean } | null;

type SweepStyleArgs = {
  colors: string[];
  textColor: string;
  duration: number;
  delay: number;
  sweep: Sweep;
  paused: boolean;
  reduced: boolean;
};

function buildSweepStyle({ colors, textColor, duration, delay, sweep, paused, reduced }: SweepStyleArgs) {
  return {
    color: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    backgroundImage: buildSweepGradient(colors, textColor),
    backgroundRepeat: 'no-repeat',
    backgroundSize: SWEEP_SIZE,
    backgroundPositionX: reduced ? SWEEP_TO : SWEEP_FROM,
    '--dia-sweep-from': SWEEP_FROM,
    '--dia-sweep-to': SWEEP_TO,
    ...(sweep !== null &&
      !reduced && {
        animationName: sweep.cycle % 2 === 0 ? 'dia-sweep-a' : 'dia-sweep-b',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: sweepEaseCss,
        animationFillMode: 'both',
        animationIterationCount: 1,
        animationPlayState: paused ? 'paused' : 'running',
      }),
  } satisfies CSSProperties & Record<`--${string}`, string>;
}

export { buildSweepStyle, COVERAGE_SPAN, makeExitEase };
