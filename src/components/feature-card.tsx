import type { ReactNode } from 'react';
import { cn } from '../lib/utils.js';

export type FeatureCardProps = {
  /** Icon rendered in the elevated top-left box. Pass any ReactNode (e.g. an
   *  inlined SVG or an iconify <Icon icon={...} />). */
  icon: ReactNode;
  title: string;
  body: string;
  /** Icon colour class, e.g. `text-violet-500`. Defaults to the secondary foreground tone. */
  iconColor?: string;
  /** Extra classes merged onto the card root. */
  className?: string;
};

/**
 * Shared marketing feature card: a soft-filled panel with an elevated icon box
 * above a title + body. Used across the /security, /syncing, /web-access pages
 * and future copy pages.
 *
 * Geometry mirrors the design-system reference (p-6 → lg:p-8 → xl:p-10, icon box
 * size-10 → lg:size-12); the design tokens are mapped onto this library's own
 * variables so both themes stay in sync.
 */
export function FeatureCard({ icon, title, body, iconColor, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between gap-6 rounded-[20px] bg-(--muted) p-6 lg:gap-8 lg:rounded-3xl lg:p-8 xl:gap-10 xl:p-10',
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-[10px] bg-(--surface) shadow-(--shadow-sm) lg:size-12 lg:rounded-md">
        <span
          className={cn('flex h-5 w-5 items-center justify-center lg:h-6 lg:w-6', iconColor ?? 'text-(--foreground-secondary)')}
        >
          {icon}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-[15px] text-foreground lg:text-base">{title}</h3>
        <p className="text-(--foreground-secondary) text-[13px] leading-relaxed lg:text-sm">{body}</p>
      </div>
    </div>
  );
}
