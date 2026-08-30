import type { ReactNode } from 'react';

import { cn } from '../lib/utils.js';

// ── Non-exported helpers ──────────────────────────────────────────────────────

/** Downward chevron (rotated square, two borders) placed at the end of a line. */
const downChevronClass =
  'absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-(--foreground-muted)';

const rightChevronClass =
  'absolute right-0 top-1/2 size-2 translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-r border-(--foreground-muted)';

const leftChevronClass =
  'absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 -rotate-45 border-t border-l border-(--foreground-muted)';

/** Micro label chip that masks the line it sits on. */
const microLabelClass =
  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-(--border) bg-(--muted) px-1.5 py-px font-mono text-[8.5px] leading-tight text-(--foreground-secondary)';

// ── Exports ───────────────────────────────────────────────────────────────────

type ArrowRightProps = { label?: string; className?: string };

/** Horizontal connector (left → right) between two snake cells. */
export function ArrowRight({ label, className }: ArrowRightProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <span className="h-px w-full bg-(--foreground-muted)" />
      <span className={rightChevronClass} />
      {label ? <span className={microLabelClass}>{label}</span> : null}
    </div>
  );
}

type ArrowLeftProps = { label?: string; className?: string };

/** Horizontal connector (right → left) between two snake cells. */
export function ArrowLeft({ label, className }: ArrowLeftProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <span className="h-px w-full bg-(--foreground-muted)" />
      <span className={leftChevronClass} />
      {label ? <span className={microLabelClass}>{label}</span> : null}
    </div>
  );
}

type TurnDownProps = { className?: string };

/** Short vertical connector used when the snake drops to the next row. */
export function TurnDown({ className }: TurnDownProps) {
  return (
    <div className={cn('relative h-4', className)}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-(--foreground-muted)" />
      <span className={downChevronClass} />
    </div>
  );
}

type SplitArrowProps = { leftLabel?: string; rightLabel?: string; className?: string };

/** One-to-two branch connector: spine down, horizontal arm, drops at 25% / 75%. */
export function SplitArrow({ leftLabel, rightLabel, className }: SplitArrowProps) {
  return (
    <div className={cn('relative h-12', className)}>
      <span className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-[25%] right-[25%] top-1/2 h-px -translate-y-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-[25%] top-1/2 h-1/2 w-px -translate-x-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-[75%] top-1/2 h-1/2 w-px -translate-x-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-[25%] top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-(--foreground-muted)" />
      <span className="absolute left-[75%] top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-(--foreground-muted)" />
      {leftLabel ? (
        <span className="absolute left-[30%] top-1/2 -translate-y-1/2 rounded-full border border-(--border) bg-(--muted) px-2 py-0.5 font-mono text-[10px] text-(--foreground-secondary)">
          {leftLabel}
        </span>
      ) : null}
      {rightLabel ? (
        <span className="absolute right-[30%] top-1/2 -translate-y-1/2 rounded-full border border-(--border) bg-(--muted) px-2 py-0.5 font-mono text-[10px] text-(--foreground-secondary)">
          {rightLabel}
        </span>
      ) : null}
    </div>
  );
}

type JoinArrowProps = { className?: string };

/** Two-to-one join connector: risers at 25% / 75%, horizontal arm, spine down. */
export function JoinArrow({ className }: JoinArrowProps) {
  return (
    <div className={cn('relative h-12', className)}>
      <span className="absolute left-[25%] top-0 h-1/2 w-px -translate-x-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-[75%] top-0 h-1/2 w-px -translate-x-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-[25%] right-[25%] top-1/2 h-px -translate-y-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-1/2 top-1/2 h-1/2 w-px -translate-x-1/2 bg-(--foreground-muted)" />
      <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-(--foreground-muted)" />
    </div>
  );
}

type FlowNodeProps = {
  icon?: ReactNode;
  /**
   * Accepted for API compatibility with the site's icon-based version; the icon is now a
   * caller-supplied ReactNode that carries its own sizing/color classes, so this is unused.
   */
  iconClass?: string;
  chipClass?: string;
  title: string;
  body?: string;
  tag?: string;
  children?: ReactNode;
  className?: string;
};

/** A compact rounded node: icon chip, one-line title, one-line sub, optional children. */
export function FlowNode({ icon, chipClass, title, body, tag, children, className }: FlowNodeProps) {
  return (
    <div className={cn('flex h-full flex-col rounded-[12px] border border-(--border) bg-(--surface) p-2.5', className)}>
      <div className="flex items-start gap-2">
        {icon ? (
          <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-[8px]', chipClass ?? 'bg-(--muted)')}>
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <p className="font-semibold text-[11px] leading-snug text-foreground sm:text-[12px]">{title}</p>
            {tag ? (
              <span className="rounded-full border border-(--border) px-1.5 py-px font-mono text-[8.5px] text-(--foreground-muted)">
                {tag}
              </span>
            ) : null}
          </div>
          {body ? <p className="mt-0.5 text-[9.5px] leading-snug text-(--foreground-secondary) sm:text-[10px]">{body}</p> : null}
        </div>
      </div>
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}

type FlowPillProps = { title: string; className?: string };

/** A start/end pill: centered, fits content, sits on the flowchart spine. */
export function FlowPill({ title, className }: FlowPillProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-fit max-w-full items-center justify-center rounded-full border border-(--border) bg-(--surface) px-4 py-2 text-center',
        className,
      )}
    >
      <p className="text-[12px] font-semibold leading-snug text-foreground">{title}</p>
    </div>
  );
}

type FlowDiamondProps = { label: string; sub?: string; className?: string };

/** A compact decision diamond (clip-path, straight text inside). */
export function FlowDiamond({ label, sub, className }: FlowDiamondProps) {
  return (
    <div className={cn('relative h-14 w-36 justify-self-center sm:h-16 sm:w-44', className)}>
      <div className="absolute inset-0 bg-(--border-hi) [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" />
      <div className="absolute inset-[1px] flex flex-col items-center justify-center gap-0.5 bg-(--surface) px-6 text-center [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]">
        <p className="text-[11px] font-semibold leading-tight text-foreground sm:text-[12px]">{label}</p>
        {sub ? <p className="text-[8.5px] leading-tight text-(--foreground-muted)">{sub}</p> : null}
      </div>
    </div>
  );
}
