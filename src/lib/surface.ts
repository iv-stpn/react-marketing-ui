export type SurfaceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const SURFACE_BG: Record<SurfaceLevel, string> = {
  1: 'bg-surface-1',
  2: 'bg-surface-2',
  3: 'bg-surface-3',
  4: 'bg-surface-4',
  5: 'bg-surface-5',
  6: 'bg-surface-6',
  7: 'bg-surface-7',
  8: 'bg-surface-8',
};

const SURFACE_VAR: Record<SurfaceLevel, string> = {
  1: '[--popup-surface:var(--surface-1)]',
  2: '[--popup-surface:var(--surface-2)]',
  3: '[--popup-surface:var(--surface-3)]',
  4: '[--popup-surface:var(--surface-4)]',
  5: '[--popup-surface:var(--surface-5)]',
  6: '[--popup-surface:var(--surface-6)]',
  7: '[--popup-surface:var(--surface-7)]',
  8: '[--popup-surface:var(--surface-8)]',
};

/**
 * Drops + rim insets in a single `box-shadow` (no `::after`). Used by `solidSurface()`.
 * Literal Tailwind classes so the scanner picks them up.
 */
const SURFACE_SHADOW_COMBINED: Record<SurfaceLevel, string> = {
  1: 'shadow-elevated-1',
  2: 'shadow-elevated-2',
  3: 'shadow-elevated-3',
  4: 'shadow-elevated-4',
  5: 'shadow-elevated-5',
  6: 'shadow-elevated-6',
  7: 'shadow-elevated-7',
  8: 'shadow-elevated-8',
};

/**
 * Elevation for a free-floating surface: background, elevation variable, and the drop shadow with
 * its rim inset painted in the same `box-shadow` — which leaves `::after` free for other purposes.
 *
 * Suits containers with no opaque children near their edges. A child painted over the rim (a sticky
 * label, a pinned input, a dialog header) covers it, since nothing re-paints the rim above the
 * children.
 *
 * When `level !== shadowLevel` the rim color tracks `shadowLevel` — the two cannot be controlled
 * independently.
 */
export function solidSurface(level: SurfaceLevel, shadowLevel: SurfaceLevel = level): string {
  return `${SURFACE_BG[level]} ${SURFACE_SHADOW_COMBINED[shadowLevel]} ${SURFACE_VAR[level]}`;
}
