/**
 * Easing curves shared across landing-ui components.
 */

/** Smooth deceleration — matches the former CSS `ease-out-expo`. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Gentle overshoot — bounce-like settle for spring alternatives. */
export const easeOutBack = [0.34, 1.56, 0.64, 1] as const;
