import type { ReactNode } from 'react';
import { cn } from '../lib/utils.js';

export type FeatureCardProps = {
  /** Icon rendered in the elevated top-left box. Pass any ReactNode. */
  icon: ReactNode;
  title: string;
  body: string;
  /** Extra classes merged onto the card root. */
  className?: string;
};

/**
 * Shared marketing feature card: a soft-filled panel with an elevated icon box
 * above a title + body.
 */
export function FeatureCard({ icon, title, body, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between gap-6 rounded-[20px] bg-(--color-muted) p-6 lg:gap-8 lg:rounded-3xl lg:p-8 xl:gap-10 xl:p-10',
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-[10px] bg-(--color-surface) shadow-(--shadow-sm) lg:size-12 lg:rounded-md">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-[15px] text-(--color-foreground) lg:text-base">{title}</h3>
        <p className="text-(--color-muted-foreground) text-[13px] leading-relaxed lg:text-sm">{body}</p>
      </div>
    </div>
  );
}
