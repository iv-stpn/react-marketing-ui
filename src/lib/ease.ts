/**
 * Easing curves shared across landing-ui components.
 */

/** Smooth deceleration — matches the former CSS `ease-out-expo`. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Gentle overshoot — bounce-like settle for spring alternatives. */
export const easeOutBack = [0.34, 1.56, 0.64, 1] as const;

// ── Content-swap tokens (action-swap) ─────────────────────────────────────
// Values mirror beui.dev's `lib/ease.ts` so vendored action-swap primitives
// keep their upstream timing.

/** Strong ease-out — the default `ease-out` reads weak at these durations. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** CSS string form of {@link EASE_OUT} for inline style transitions. */
export const EASE_OUT_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** Content swaps — label/icon slots trading places inside a control. */
export const SPRING_SWAP = { type: 'spring', stiffness: 460, damping: 30, mass: 0.55 } as const;
