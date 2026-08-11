"use client";

import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query, returning `true` when it matches.
 *
 * The default return before hydration is `false`; pass `defaultState`
 * to set a different initial value (e.g. `true` for dark-mode queries
 * whose SSR default is dark).
 */
export function useMediaQuery(
  query: string,
  defaultState = false,
): boolean {
  const [matches, setMatches] = useState(defaultState);

  // biome-ignore lint/plugin: subscribes to a matchMedia listener — an imperative side effect with no derived-state equivalent.
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
