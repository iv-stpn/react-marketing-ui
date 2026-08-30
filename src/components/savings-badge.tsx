import type * as React from 'react';
import { cn } from '../lib/utils.js';

/**
 * Soft emerald pill for money-saved callouts — the per-provider delta in the
 * estimate chart.
 *
 * The wording differs per call site, so the label stays in `children`; only the
 * pill treatment is shared.
 */
export function SavingsBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-numeric font-semibold text-[11px] text-emerald-500 tabular-nums',
        className,
      )}
      {...props}
    />
  );
}
