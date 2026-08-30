'use client';

import { ActionSwapRollIcon, ActionSwapRollText } from './action-swap.js';
import { Button } from './button.js';

/*
 * Controlled theme toggle: the parent owns the current theme and the flip
 * handler, so there's no next-themes, no hydration detection, and no
 * pre-hydration CSS fallback — the theme is always known and the roll renders
 * directly on first paint.
 */

// Icon-only (navbar / footer) sits on the `sm` height; the labeled row (mobile
// drawer) on `md`. The `w-8 p-0` / `gap-2 px-3 text-[13px]` overrides turn the
// shared <Button> sizes into the toggle's square and labeled geometries.
const ICON_LAYOUT = 'w-8 p-0';
const LABELED_LAYOUT = 'gap-2 px-3 text-[13px]';

/** Sun glyph — the icon shown while dark, i.e. the theme you switch *to*. */
function SunIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="3" x2="12" y2="1" />
      <line x1="12" y1="23" x2="12" y2="21" />
      <line x1="3" y1="12" x2="1" y2="12" />
      <line x1="23" y1="12" x2="21" y2="12" />
      <line x1="5" y1="5" x2="3.5" y2="3.5" />
      <line x1="20.5" y1="20.5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="20.5" y2="3.5" />
      <line x1="4.5" y1="20.5" x2="3" y2="19" />
    </svg>
  );
}

/** Moon glyph — the icon shown while light, i.e. the theme you switch *to*. */
function MoonIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
  );
}

export type ThemeToggleProps = {
  /** Current theme — drives which icon/label the roll shows. */
  theme: 'light' | 'dark';
  /** Flip handler; the parent persists the new theme. */
  onToggle: () => void;
  /** Render the labeled row (mobile drawer) instead of the icon-only square. */
  showLabel?: boolean;
};

export function ThemeToggle({ theme, onToggle, showLabel = false }: ThemeToggleProps) {
  const size = showLabel ? 'md' : 'sm';
  const layoutClassName = showLabel ? LABELED_LAYOUT : ICON_LAYOUT;

  // The icon shows the theme you are switching *to*, matching the label.
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Button
      variant="filled"
      size={size}
      actionOrLink={onToggle}
      className={layoutClassName}
      // The visible label rolls, so mid-swap both strings are briefly in the
      // tree. Naming the button explicitly keeps it unambiguous either way.
      aria-label={label}
    >
      <ActionSwapRollIcon value={theme} className="h-4 w-4">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </ActionSwapRollIcon>
      {showLabel ? <ActionSwapRollText value={theme}>{label}</ActionSwapRollText> : null}
    </Button>
  );
}
