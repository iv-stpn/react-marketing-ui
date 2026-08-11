'use client';

import type { HTMLAttributes } from 'react';
import { cn, validCssVars } from '../lib/utils.js';

export interface ShineBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the border in pixels. @default 1 */
  borderWidth?: number;
  /** Duration of the animation in seconds. @default 14 */
  duration?: number;
  /** Color of the border — single color or array of colors. @default "#000000" */
  shineColor?: string | string[];
}

/**
 * An animated background-border effect that sits absolutely on top of
 * its positioned parent. Add `relative` to the parent container.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = '#000000',
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={validCssVars({
        '--border-width': `${borderWidth}px`,
        '--duration': `${duration}s`,
        backgroundImage: `radial-gradient(transparent,transparent, ${
          Array.isArray(shineColor) ? shineColor.join(',') : shineColor
        },transparent,transparent)`,
        backgroundSize: '300% 300%',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        padding: 'var(--border-width)',
        ...style,
      })}
      className={cn(
        'pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] motion-safe:animate-shine',
        className,
      )}
      {...props}
    />
  );
}
