import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils.js';

/**
 * Physically-lit button: a domed, back-lit key built from one effect layer.
 *
 * The geometry lives in a single `box-shadow` list. The recipe
 * lives in `glossy-button.css`. Every colour is a `--btn-*` primitive.
 *
 * Server-renderable: every state is pure CSS.
 */

const glossLayer = cn(
  'pointer-events-none absolute inset-0 z-[-1] rounded-[inherit]',
  '[background-color:var(--btn-face)] [box-shadow:var(--shadow-button)]',
  'transition-shadow duration-150',
  'group-active/glossy:[box-shadow:var(--shadow-button-pressed)]',
  'group-disabled/glossy:[box-shadow:var(--shadow-button-pressed)]',
  "before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:[background-image:var(--gradient-button)]",
  "after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:opacity-0",
  'after:[background-color:var(--btn-tint-hover)] after:transition-opacity after:duration-150 after:[will-change:opacity]',
  'group-hover/glossy:after:opacity-100',
  'group-active/glossy:after:[background-color:var(--btn-tint-active)]',
  'group-disabled/glossy:after:hidden [@media(hover:none)]:after:hidden',
);

const glossyButtonVariants = cva(
  cn(
    'glossy group/glossy relative isolate inline-flex cursor-pointer select-none items-center justify-center gap-1 whitespace-nowrap rounded-md font-normal',
    '[color:var(--btn-fg)]',
    'disabled:cursor-default disabled:opacity-50',
    '[@media(hover:none)]:active:opacity-80',
  ),
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-sm',
        md: 'h-9 px-5 text-[17px]',
        lg: 'h-11 px-6 text-[17px]',
      },
      variant: {
        neutral: '',
        accent: 'glossy-accent',
        destructive: 'glossy-destructive',
        special: 'glossy-special',
        positive: 'glossy-positive',
        attention: 'glossy-attention',
        highlight: 'glossy-highlight',
        inverse: 'glossy-inverse',
      },
    },
    defaultVariants: { size: 'md', variant: 'neutral' },
  },
);

export type GlossyButtonProps = VariantProps<typeof glossyButtonVariants> & {
  /** Renders as a native <button> or <a> depending on the type. */
  actionOrLink: string | (() => void);
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

export function GlossyButton({
  size,
  variant,
  actionOrLink,
  children,
  disabled,
  className,
  'aria-label': ariaLabel,
}: GlossyButtonProps) {
  const content = (
    <>
      <span data-fx-layer="gloss" aria-hidden={true} className={glossLayer} />
      <span className="px-0.5">{children}</span>
    </>
  );

  const buttonClassName = cn(glossyButtonVariants({ size, variant }), className);

  if (typeof actionOrLink === 'string')
    return (
      <a href={actionOrLink} className={cn(buttonClassName, 'no-underline')} aria-label={ariaLabel}>
        {content}
      </a>
    );

  return (
    <button type="button" className={buttonClassName} onClick={actionOrLink} disabled={disabled} aria-label={ariaLabel}>
      {content}
    </button>
  );
}

export { glossyButtonVariants };
