import type { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { cva } from 'class-variance-authority';
import type * as React from 'react';
import type { SurfaceLevel } from '../lib/surface.js';

type PositionerProps = React.ComponentProps<typeof NavigationMenuPrimitive.Positioner>;

export const navigationMenuTriggerStyle = cva(
  'box-border flex items-center justify-center gap-1.5 h-10 px-2.5 xs:px-3 m-0 rounded-md text-foreground font-medium !text-[15px] leading-6 select-none no-underline hover:text-foreground data-[popup-open]:bg-black/[0.07] dark:data-[popup-open]:bg-white/[0.07] data-[popup-open]:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring focus-visible:relative',
);

export const navigationMenuSubTriggerStyle = cva(
  'w-full text-left relative block rounded-md p-2.5 xs:p-3 no-underline text-inherit hover:bg-black/[0.07] dark:hover:bg-white/[0.07] hover:text-foreground active:bg-black/[0.11] dark:active:bg-white/[0.11] focus-visible:relative focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring data-[popup-open]:bg-black/[0.07] dark:data-[popup-open]:bg-white/[0.07] data-[popup-open]:text-foreground',
);

export interface NavigationMenuProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Root> {
  side?: PositionerProps['side'];
  sideOffset?: PositionerProps['sideOffset'];
  align?: PositionerProps['align'];
  alignOffset?: PositionerProps['alignOffset'];
  collisionPadding?: PositionerProps['collisionPadding'];
  collisionBoundary?: PositionerProps['collisionBoundary'];
  positionMethod?: PositionerProps['positionMethod'];
  arrow?: boolean;
  /** Surface elevation level (1-8) for the bar. Defaults to 2 — subtle toolbar above the page. */
  level?: SurfaceLevel;
  /** Shadow weight (1-8) for the bar. Defaults to 2. */
  shadowLevel?: SurfaceLevel;
}

export interface NavigationMenuLinkProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Link> {
  /**
   * When true, applies trigger button styling for top-level navigation links
   */
  standalone?: boolean;
}

export interface NavigationMenuViewportProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> {
  side?: PositionerProps['side'];
  sideOffset?: PositionerProps['sideOffset'];
  align?: PositionerProps['align'];
  alignOffset?: PositionerProps['alignOffset'];
  collisionPadding?: PositionerProps['collisionPadding'];
  collisionBoundary?: PositionerProps['collisionBoundary'];
  positionMethod?: PositionerProps['positionMethod'];
  arrow?: boolean;
}

export interface NavigationMenuSubProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Root> {
  side?: PositionerProps['side'];
  sideOffset?: PositionerProps['sideOffset'];
  align?: PositionerProps['align'];
  alignOffset?: PositionerProps['alignOffset'];
  arrow?: boolean;
}
