import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import type * as React from 'react';
import { solidSurface } from '../lib/surface.js';
import { cn, validCssVars } from '../lib/utils.js';
import { ArrowSvg, ChevronDownIcon, ChevronRightIcon } from './navigation-menu-icons.js';
import {
  type NavigationMenuLinkProps,
  type NavigationMenuProps,
  type NavigationMenuSubProps,
  type NavigationMenuViewportProps,
  navigationMenuSubTriggerStyle,
  navigationMenuTriggerStyle,
} from './navigation-menu-styles.js';

function NavigationMenu({
  className,
  children,
  side,
  sideOffset = 10,
  align,
  alignOffset,
  collisionPadding = { top: 5, bottom: 5, left: 20, right: 20 },
  collisionBoundary,
  arrow = false,
  positionMethod = 'fixed',
  level = 2,
  shadowLevel = 2,
  ...props
}: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-level={level}
      className={cn('min-w-max rounded-md p-1 text-foreground', solidSurface(level, shadowLevel), className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        arrow={arrow}
        positionMethod={positionMethod}
      />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={cn('relative flex', className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" className={cn('relative', className)} {...props} />;
}

function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <NavigationMenuIcon />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuIcon({
  className,
  render = <ChevronDownIcon />,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      className={cn('transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180', className)}
      render={render}
      {...props}
    />
  );
}

function NavigationMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-sub-trigger"
      className={cn(navigationMenuSubTriggerStyle(), className)}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Icon
        className="absolute top-1/2 right-2.5 flex h-2.5 w-2.5 -translate-y-1/2 items-center justify-center transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180"
        render={<ChevronRightIcon />}
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'h-full w-[calc(100vw-2.5rem)] p-4 sm:w-max',
        // Transitions for opacity/transform/filter
        'transition-[opacity,transform,filter,scale,translate] duration-(--duration) ease-(--easing)',
        // Starting/ending opacity
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
        // Direction-aware slide (starting)
        'data-starting-style:data-[activation-direction=left]:-translate-x-1/2',
        'data-starting-style:data-[activation-direction=right]:translate-x-1/2',
        // Direction-aware slide (ending)
        'data-ending-style:data-[activation-direction=left]:translate-x-1/2',
        'data-ending-style:data-[activation-direction=right]:-translate-x-1/2',
        // Blur effect during transitions
        'data-ending-style:blur-[4px] data-starting-style:blur-[4px]',
        // scale effect during transitions
        'data-ending-style:scale-97 data-starting-style:scale-97',
        // Motion reduce support
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuLink({ className, standalone, ...props }: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        standalone
          ? navigationMenuTriggerStyle()
          : 'block rounded-md p-2.5 xs:p-3 text-inherit no-underline duration-150 hover:text-foreground hover:duration-0 focus-visible:relative focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-1',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuBackdrop({ ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Backdrop>) {
  return <NavigationMenuPrimitive.Backdrop data-slot="navigation-menu-backdrop" {...props} />;
}

function NavigationMenuPortal({ ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Portal>) {
  return <NavigationMenuPrimitive.Portal data-slot="navigation-menu-portal" {...props} />;
}

function NavigationMenuArrow({ ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Arrow>) {
  return (
    <NavigationMenuPrimitive.Arrow
      className="flex transition-[left] duration-[var(--duration)] ease-[var(--easing)] data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=top]:bottom-[-8px] data-[side=right]:left-[-13px] data-[side=left]:rotate-90 data-[side=right]:-rotate-90 data-[side=top]:rotate-180"
      {...props}
    >
      <ArrowSvg />
    </NavigationMenuPrimitive.Arrow>
  );
}

function NavigationMenuViewport({
  className,
  children,
  side,
  sideOffset,
  align,
  alignOffset,
  collisionPadding,
  collisionBoundary,
  arrow = false,
  positionMethod = 'fixed',
  ...props
}: NavigationMenuViewportProps) {
  return (
    <NavigationMenuPortal>
      <NavigationMenuPrimitive.Positioner
        data-slot="navigation-menu-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        positionMethod={positionMethod}
        className="z-50 box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:-top-2.5 data-[side=left]:before:top-0 data-[side=right]:before:top-0 data-[side=bottom]:before:right-0 data-[side=left]:before:-right-2.5 data-[side=top]:before:right-0 data-[side=left]:before:bottom-0 data-[side=right]:before:bottom-0 data-[side=top]:before:-bottom-2.5 data-[side=bottom]:before:left-0 data-[side=right]:before:-left-2.5 data-[side=top]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=top]:before:h-2.5 data-[side=left]:before:w-2.5 data-[side=right]:before:w-2.5"
        style={validCssVars({ '--duration': '0.35s', '--easing': 'cubic-bezier(0.22, 1, 0.36, 1)' })}
      >
        <NavigationMenuPrimitive.Popup
          data-slot="navigation-menu-content"
          className={cn(
            'relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden rounded-md text-foreground transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing) data-ending-style:scale-90 data-starting-style:scale-90 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150',
            solidSurface(3, 3),
          )}
        >
          {arrow ? <NavigationMenuArrow /> : null}
          <NavigationMenuPrimitive.Viewport
            data-slot="navigation-menu-viewport"
            className={cn('relative h-full w-full overflow-hidden', className)}
            {...props}
          >
            {children}
          </NavigationMenuPrimitive.Viewport>
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPortal>
  );
}

function NavigationMenuSub({
  className,
  children,
  orientation = 'vertical',
  side = 'right',
  sideOffset = 24,
  align = 'end',
  alignOffset = -24,
  arrow = false,
  ...props
}: NavigationMenuSubProps) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu-sub"
      className={cn('', className)}
      orientation={orientation}
      {...props}
    >
      {children}
      <NavigationMenuPortal>
        <NavigationMenuPrimitive.Positioner
          data-slot="navigation-menu-sub-positioner"
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          align={align}
          side={side}
          className="box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:-top-2.5 data-[side=left]:before:top-0 data-[side=right]:before:top-0 data-[side=bottom]:before:right-0 data-[side=left]:before:-right-2.5 data-[side=top]:before:right-0 data-[side=left]:before:bottom-0 data-[side=right]:before:bottom-0 data-[side=top]:before:-bottom-2.5 data-[side=bottom]:before:left-0 data-[side=right]:before:-left-2.5 data-[side=top]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=top]:before:h-2.5 data-[side=left]:before:w-2.5 data-[side=right]:before:w-2.5"
          style={validCssVars({ '--duration': '0.35s', '--easing': 'cubic-bezier(0.22, 1, 0.36, 1)' })}
        >
          <NavigationMenuPrimitive.Popup
            data-slot="navigation-menu-sub-content"
            className={cn(
              'relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden rounded-md text-foreground transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing) data-ending-style:scale-90 data-starting-style:scale-90 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150',
              solidSurface(5, 5),
            )}
          >
            {arrow ? <NavigationMenuArrow /> : null}
            <NavigationMenuPrimitive.Viewport
              data-slot="navigation-menu-sub-viewport"
              className="relative h-full w-full overflow-hidden"
            />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPortal>
    </NavigationMenuPrimitive.Root>
  );
}

export {
  NavigationMenu,
  NavigationMenuArrow,
  NavigationMenuBackdrop,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPortal,
  NavigationMenuSub,
  NavigationMenuSubTrigger,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
