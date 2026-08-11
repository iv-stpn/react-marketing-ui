import type { InputHTMLAttributes, RefObject } from 'react';
import { cn } from '../lib/utils.js';

/**
 * Physically-recessed input: the inverse read of GlossyButton.
 * The illusion is built entirely from `box-shadow` layers (no wrapper div).
 *
 * Server-renderable: no browser APIs are used.
 */
export function ElevatedInput({
  className,
  type = 'text',
  ref,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  ref?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        // Layout & shape
        'relative w-full overflow-hidden rounded-lg',
        // Typography
        'text-(--color-foreground) text-sm placeholder:text-(--color-muted-foreground)',
        // Sizing
        'h-9 px-3',
        // Reset native input chrome
        'appearance-none border-none outline-none',

        // Background — a barely-there top darkening that reads as cavity depth.
        'bg-[linear-gradient(to_bottom,oklch(0_0_0/0.04),transparent)]',
        'dark:bg-[linear-gradient(to_bottom,oklch(1_0_0/0.04),transparent)]',

        // Shadow stack — light mode
        'shadow-[inset_0_1px_0_0_oklch(1_0_0/0.08),inset_0_2px_2px_-1px_oklch(0_0_0/0.08),inset_0_4px_4px_-2px_oklch(0_0_0/0.08),0_1px_0_0_oklch(0_0_0/0.12),inset_0_0_0_1px_oklch(0_0_0/0.16)]',
        // Shadow stack — dark mode
        'dark:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.1),inset_0_2px_2px_-1px_oklch(0_0_0/0.28),inset_0_4px_4px_-2px_oklch(0_0_0/0.22),0_1px_0_0_oklch(0_0_0/0.36),inset_0_0_0_1px_oklch(1_0_0/0.16)]',

        // Focus
        'focus-visible:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.08),inset_0_2px_2px_-1px_oklch(0_0_0/0.04),inset_0_4px_4px_-2px_oklch(0_0_0/0.04),0_0_0_3px_oklch(0_0_0/0.08),inset_0_0_0_1.5px_oklch(0_0_0/0.36)]',
        'dark:focus-visible:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.12),inset_0_2px_2px_-1px_oklch(0_0_0/0.16),inset_0_4px_4px_-2px_oklch(0_0_0/0.12),0_0_0_3px_oklch(1_0_0/0.08),inset_0_0_0_1.5px_oklch(1_0_0/0.28)]',

        'transition-shadow duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
