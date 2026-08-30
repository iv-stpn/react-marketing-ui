import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils.js';

/**
 * Shared marketing-site button styles.
 *
 * The `transition` in the base string matches the former `.button-transition`
 * utility — a pure-CSS morph so the component stays server-renderable.
 */
const buttonVariants = cva(
  'group inline-flex items-center justify-center gap-1.5 font-medium [transition:opacity_.24s_80ms,transform_.15s_cubic-bezier(.4,0,.2,1),box-shadow_.15s_cubic-bezier(.4,0,.2,1),filter_.15s_cubic-bezier(.4,0,.2,1)] disabled:[transition:opacity_.1s]',
  {
    variants: {
      variant: {
        filled: 'bg-(--foreground) text-(--primary-foreground) shadow-elevated-3 hover:opacity-90',
        bordered: 'border border-(--border-hi) bg-surface-3 text-foreground shadow-elevated-3 hover:bg-(--muted)',
        ghost: 'text-(--foreground-secondary) hover:bg-(--surface-hover) hover:text-(--foreground)',
      },
      size: {
        sm: 'h-8 px-3.5 text-[15px]',
        md: 'h-9 px-5 text-[17px]',
        lg: 'h-11 px-6 text-[17px]',
        icon: 'size-11',
      },
      shape: {
        rounded: 'rounded-interactive',
        pill: 'rounded-full',
      },
    },
    // Pill is the house standard — every CTA is fully rounded.
    defaultVariants: { variant: 'filled', size: 'md', shape: 'pill' },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants> & {
  showArrow?: boolean;
  /**
   * Set when `actionOrLink` is an off-site URL — renders the anchor with
   * `target="_blank"` and `rel="noopener noreferrer"`.
   */
  external?: boolean;
  /** Hover tooltip on the rendered anchor/button. */
  title?: string;
  /**
   * String  → renders as a plain anchor <a href={...}>.
   * Function → renders as a <button type="button" onClick={...}>.
   */
  actionOrLink: string | (() => void);
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
};

/**
 * Shared marketing-site button.
 *
 * variant="filled"   → primary CTA  (inverse theming: bg-(--foreground) + text-(--primary-foreground)
 *                     + shadow-elevated-3 — flips with the theme so it pops against any surface)
 * variant="bordered" → elevated surface + border (bg-surface-3 + shadow-elevated-3 + border)
 * variant="ghost"    → transparent, muted text that gains a surface on hover
 * size="sm"          → h-8,  px-3.5, text-[15px]   (navbar / compact)
 * size="md"          → h-9,  px-5,   text-[17px]   (default)
 * size="lg"          → h-11, px-6,   text-[17px]   (hero CTAs)
 * size="icon"        → size-11 square              (icon-only buttons)
 * shape="pill"       → fully rounded (rounded-full); pill is the default
 * showArrow          → chevron right at rest, morphs to arrow-right on hover
 *
 * Server-renderable: the arrow morph is pure CSS (group-hover), so no client
 * state or animation library is needed. When `actionOrLink` is a function the
 * component renders a <button>; passing a function requires a client-component
 * parent (functions can't cross the server→client boundary), which is inherent
 * to any onClick prop and unchanged by this component being server-capable.
 */
export function Button({
  variant,
  size,
  shape,
  showArrow = false,
  external = false,
  title,
  actionOrLink,
  children,
  className,
  'aria-label': ariaLabel,
  'aria-expanded': ariaExpanded,
}: ButtonProps) {
  const buttonClassName = cn(buttonVariants({ variant, size, shape }), className);

  /*
   * Single SVG that morphs from  ›  to  →  on hover — pure CSS, no JS.
   * The shaft draws in from the left (stroke-dashoffset 9 → 0) and the arrowhead
   * nudges right. Draw-in is slower (.22s) than the reverse (.08s), matching the
   * asymmetric timing of the former framer-motion version. ease = cubic-bezier(.22,1,.36,1).
   */
  const arrowSlot = showArrow && (
    <svg
      viewBox="0 0 14 14"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
      className="shrink-0"
    >
      {/* Shaft — draws in from the left */}
      <line
        x1="0"
        y1="7"
        x2="9"
        y2="7"
        strokeDasharray="9"
        className="[stroke-dashoffset:9] [transition:stroke-dashoffset_.08s_cubic-bezier(.22,1,.36,1)] group-hover:[stroke-dashoffset:0] group-hover:[transition-duration:.22s]"
      />
      {/* Arrowhead — nudges right so the shaft "connects" underneath */}
      <path
        d="M5 3l4 4-4 4"
        className="[transform:translateX(0)] [transition:transform_.22s_cubic-bezier(.22,1,.36,1)] group-hover:[transform:translateX(2px)]"
      />
    </svg>
  );

  if (typeof actionOrLink === 'string')
    return (
      <a
        href={actionOrLink}
        className={cn(buttonClassName, 'no-underline')}
        aria-label={ariaLabel}
        title={title}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {arrowSlot}
      </a>
    );

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={actionOrLink}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      title={title}
    >
      {children}
      {arrowSlot}
    </button>
  );
}
