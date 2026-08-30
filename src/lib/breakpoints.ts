import { useCallback, useSyncExternalStore } from 'react';

/** Site breakpoints — `md` is 50rem here, not Tailwind's default 48rem. */
export const BREAKPOINTS = [
  ['xs', 30],
  ['sm', 40],
  ['md', 50],
  ['lg', 64],
  ['xl', 80],
  ['2xl', 96],
] as const;

/** `'base'` is the implicit below-`xs` band — the widths no `min-width` query claims. */
export type Breakpoint = 'base' | (typeof BREAKPOINTS)[number][0];

/**
 * The current breakpoint, read straight from `matchMedia`. Use this over
 * `useBreakpoint` inside effects that need the *live* band: through the
 * hydration pass the rendered value is still the server's `'base'`, which is a
 * change away from the truth and will read as one.
 */
export function getBreakpoint(): Breakpoint {
  let current: Breakpoint = 'base';
  for (const [name, rem] of BREAKPOINTS) {
    if (globalThis.matchMedia(`(min-width: ${rem}rem)`).matches) current = name;
  }
  return current;
}

/**
 * Call `listener` whenever the viewport crosses a breakpoint. Returns the
 * unsubscribe.
 *
 * The imperative counterpart to `useBreakpoint`, for work that has to land in
 * the *same frame* as the layout change. Media-query change events fire during
 * the rendering steps, before `requestAnimationFrame` and before paint, so a
 * listener that writes to the DOM here is painted with the new layout rather
 * than one frame behind it. Going through React state instead costs a render
 * round-trip — the scheduler runs the update in a later task, and the layout
 * effect lands after the browser has already painted.
 */
export function onBreakpointChange(listener: () => void): () => void {
  const queries = BREAKPOINTS.map(([, rem]) => globalThis.matchMedia(`(min-width: ${rem}rem)`));
  for (const query of queries) query.addEventListener('change', listener);
  return () => {
    for (const query of queries) query.removeEventListener('change', listener);
  };
}

function getBreakpointServer(): Breakpoint {
  return 'base';
}

/**
 * The widest breakpoint the viewport currently satisfies, re-rendering only when
 * it crosses from one band into another — not on every pixel of a resize.
 *
 * This is for work that has to be *redone* when the layout changes shape, like
 * re-measuring something positioned against text that the gutters just moved. It
 * is not for choosing what to render: the exported HTML has to be correct at
 * every width before JS runs, so layout belongs in CSS breakpoints, and this
 * returns `'base'` during SSR and the first client paint regardless of viewport.
 */
export function useBreakpoint(): Breakpoint {
  const subscribe = useCallback(onBreakpointChange, []);
  return useSyncExternalStore(subscribe, getBreakpoint, getBreakpointServer);
}
