import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type * as React from 'react';
import { cn } from '../lib/utils.js';

type AccordionVariant =
  | 'default'
  | 'split'
  | 'outline'
  | 'nested'
  | 'isolated-bordered'
  | 'isolated-filled'
  | 'isolated-filled-bordered';

function Accordion({
  className,
  multiple = false,
  variant = 'default',
  ...props
}: BaseAccordion.Root.Props & { variant?: AccordionVariant }) {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      data-variant={variant}
      multiple={multiple}
      className={cn(
        'group flex w-full flex-col',
        variant === 'split' && 'space-y-2',
        variant === 'outline' && 'overflow-hidden rounded-lg border bg-(--color-surface)',
        variant === 'nested' && 'rounded-lg border bg-(--color-muted) p-1',
        className,
      )}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: BaseAccordion.Item.Props) {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cn(
        'transition-[margin,border-radius,border] duration-250 ease-out-expo',
        'group-data-[variant=default]:border-(--color-border) group-data-[variant=default]:border-b group-data-[variant=default]:last:border-b-0',
        'group-data-[variant=split]:overflow-hidden group-data-[variant=split]:rounded-lg group-data-[variant=split]:border group-data-[variant=split]:border-(--color-border) group-data-[variant=split]:bg-(--color-surface)',
        'group-data-[variant=outline]:border-(--color-border) group-data-[variant=outline]:border-b group-data-[variant=outline]:last:border-b-0',
        'group-data-[variant=nested]:mt-0.5 group-data-[variant=nested]:first:mt-0',
        'group-data-[variant=isolated-bordered]:overflow-hidden group-data-[variant=isolated-bordered]:border group-data-[variant=isolated-bordered]:border-(--color-border) group-data-[variant=isolated-bordered]:bg-(--color-surface)',
        'group-data-[variant=isolated-bordered]:relative group-data-[variant=isolated-bordered]:not-first:not-data-open:not-[[data-open]+&]:-mt-px',
        'group-data-[variant=isolated-bordered]:data-open:mt-2 group-data-[variant=isolated-bordered]:data-open:mb-2 group-data-[variant=isolated-bordered]:data-open:rounded-lg',
        'group-data-[variant=isolated-bordered]:first:rounded-t-lg group-data-[variant=isolated-bordered]:data-open:first:mt-0',
        'group-data-[variant=isolated-bordered]:last:rounded-b-lg group-data-[variant=isolated-bordered]:data-open:last:mb-0',
        'group-data-[variant=isolated-bordered]:[[data-open]+&]:rounded-t-lg',
        'group-data-[variant=isolated-bordered]:[&:has(+_[data-open])]:rounded-b-lg',
        'group-data-[variant=isolated-filled]:overflow-hidden group-data-[variant=isolated-filled]:bg-(--color-muted)',
        'group-data-[variant=isolated-filled]:data-open:my-2 group-data-[variant=isolated-filled]:data-open:rounded-lg',
        'group-data-[variant=isolated-filled]:first:rounded-t-lg group-data-[variant=isolated-filled]:data-open:first:mt-0',
        'group-data-[variant=isolated-filled]:last:rounded-b-lg group-data-[variant=isolated-filled]:data-open:last:mb-0',
        'group-data-[variant=isolated-filled]:[[data-open]+&]:rounded-t-lg',
        'group-data-[variant=isolated-filled]:[&:has(+_[data-open])]:rounded-b-lg',
        'group-data-[variant=isolated-filled-bordered]:overflow-hidden group-data-[variant=isolated-filled-bordered]:bg-(--color-muted)',
        'group-data-[variant=isolated-filled-bordered]:not-last:border-(--color-border) group-data-[variant=isolated-filled-bordered]:not-last:border-b',
        'group-data-[variant=isolated-filled-bordered]:[&:has(+_[data-open])]:border-transparent',
        'group-data-[variant=isolated-filled-bordered]:data-open:border-transparent',
        'group-data-[variant=isolated-filled-bordered]:data-open:my-2 group-data-[variant=isolated-filled-bordered]:data-open:rounded-lg',
        'group-data-[variant=isolated-filled-bordered]:first:rounded-t-lg group-data-[variant=isolated-filled-bordered]:data-open:first:mt-0',
        'group-data-[variant=isolated-filled-bordered]:last:rounded-b-lg group-data-[variant=isolated-filled-bordered]:data-open:last:mb-0',
        'group-data-[variant=isolated-filled-bordered]:[[data-open]+&]:rounded-t-lg',
        'group-data-[variant=isolated-filled-bordered]:[&:has(+_[data-open])]:rounded-b-lg',
        className,
      )}
      {...props}
    />
  );
}

function AccordionHeader({ className, ...props }: BaseAccordion.Header.Props) {
  return <BaseAccordion.Header data-slot="accordion-header" className={cn('not-prose', className)} {...props} />;
}

interface AccordionTriggerProps extends BaseAccordion.Trigger.Props {
  showIndicator?: boolean;
  indicatorType?: 'chevron' | 'plus';
  indicatorPosition?: 'start' | 'end';
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
}

function AccordionTrigger({
  children,
  className,
  showIndicator = true,
  indicatorType = 'plus',
  indicatorPosition = 'end',
  icon,
  subtitle,
  ...props
}: AccordionTriggerProps) {
  const hasStartIndicator = showIndicator && indicatorPosition === 'start';
  const hasEndIndicator = showIndicator && indicatorPosition === 'end';

  const renderIndicator = () => {
    if (!showIndicator) return null;

    const indicatorIcon =
      indicatorType === 'chevron' ? (
        <ChevronIcon className="size-4 shrink-0 text-(--color-muted-foreground) transition-transform duration-200 ease-out-expo" />
      ) : (
        <PlusIcon className="size-4 shrink-0 text-(--color-muted-foreground) transition-transform duration-200 ease-out-expo" />
      );

    return (
      <span className="shrink-0 text-(--color-muted-foreground)" aria-hidden="true">
        {indicatorIcon}
      </span>
    );
  };

  return (
    <AccordionHeader>
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        data-has-icon={hasStartIndicator ? 'true' : undefined}
        className={cn(
          'group/trigger flex w-full cursor-pointer items-center justify-between gap-3 p-3.5 text-left font-medium text-sm outline-none disabled:pointer-events-none disabled:opacity-60',
          'group-data-[variant=default]:px-0',
          'group-data-[variant=split]:rounded-t-lg',
          'group-data-[variant=nested]:rounded-sm group-data-[variant=nested]:px-3 group-data-[variant=nested]:py-2.5 group-data-[variant=nested]:hover:bg-background',
          indicatorType === 'chevron' && '[&[data-panel-open]_svg]:rotate-180',
          indicatorType === 'plus' && '[&[data-panel-open]_svg]:rotate-90',
          className,
        )}
        {...props}
      >
        {hasStartIndicator ? renderIndicator() : null}

        {icon && !hasStartIndicator && (
          <span className="shrink-0 text-(--color-muted-foreground)" aria-hidden="true">
            {icon}
          </span>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="underline-offset-2 group-hover/trigger:underline">{children}</span>
          {subtitle ? <span className="text-(--color-muted-foreground) text-sm no-underline">{subtitle}</span> : null}
        </div>

        {hasEndIndicator ? renderIndicator() : null}
      </BaseAccordion.Trigger>
    </AccordionHeader>
  );
}

function AccordionContent({ children, className, ...props }: BaseAccordion.Panel.Props) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-content"
      className={cn(
        'h-(--accordion-panel-height) overflow-hidden text-sm transition-[height,opacity] duration-250 ease-out-expo data-ending-style:h-0 data-starting-style:h-0 data-ending-style:opacity-0 data-starting-style:opacity-0',
      )}
      {...props}
    >
      <div
        className={cn(
          'p-3.5 text-(--color-muted-foreground)',
          'group-data-[variant=default]:px-0 group-data-[variant=default]:pt-0',
          'group-data-[variant=split]:pt-0',
          'group-data-[variant=outline]:pt-0',
          'group-data-[variant=nested]:mt-1 group-data-[variant=nested]:mb-0.5 group-data-[variant=nested]:rounded-sm group-data-[variant=nested]:border group-data-[variant=nested]:bg-background group-data-[variant=nested]:p-3',
          'group-data-[variant=isolated-bordered]:pt-0',
          'group-data-[variant=isolated-filled]:pt-0',
          'group-data-[variant=isolated-filled-bordered]:pt-0',
          '[[data-slot=accordion-item]:has([data-has-icon])_&]:pl-[calc(1rem+0.75rem)]',
          className,
        )}
      >
        {children}
      </div>
    </BaseAccordion.Panel>
  );
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 12C2.75 11.3096 3.30964 10.75 4 10.75H20C20.6904 10.75 21.25 11.3096 21.25 12C21.25 12.6904 20.6904 13.25 20 13.25H4C3.30964 13.25 2.75 12.6904 2.75 12Z"
        fill="currentColor"
        className="in-data-panel-open:opacity-0 transition-opacity duration-200 ease-out-expo"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75C12.6904 2.75 13.25 3.30964 13.25 4V20C13.25 20.6904 12.6904 21.25 12 21.25C11.3096 21.25 10.75 20.6904 10.75 20V4C10.75 3.30964 11.3096 2.75 12 2.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger };
