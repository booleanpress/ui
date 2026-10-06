import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

/** @since 0.1.0 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

/** @since 0.1.0 */
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
const navigationMenuTriggerStyle = cva(
  // boolean-ui patch: the BooleanPress look — 0.25rem 0.625rem padding, 14 px medium on a 21 px line, 6px radius, no
  // fill at rest, the hovered-surface fill on hover, focus and while open; 14 px icons 8px from the label; keyboard
  // focus adds a 1px `--ring` outline 2px away; a row, also on a link (stock: 36px tall, 16px side padding, the page
  // fill, a 3px ring, 50% fill while open, 50% opacity disabled, a link's column kept).
  "group inline-flex w-max flex-row items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm/normal font-medium outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:opacity-60 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
)

/** @since 0.1.0 */
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {/* boolean-ui patch: no chevron, as the visual target; `aria-expanded` states it (stock: a turning 12px chevron). */}
      {children}
    </NavigationMenuPrimitive.Trigger>
  )
}

/** @since 0.1.0 */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      // boolean-ui patch: the theme's overlay motion.
      data-bui-motion="overlay"
      // boolean-ui patch: the BooleanPress look — 0.25rem padding and 2px between links, as a menu; without the
      // viewport, 4px under its trigger with the overlay shadow; the theme sets the motion's timing (stock: 8px
      // padding, 6px away, shadow, 200ms).
      className={cn(
        "start-0 top-0 w-full p-1 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-md **:data-[slot=navigation-menu-link]:focus:outline-none group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      // boolean-ui patch: the wrapper carries a data-slot (stock: none).
      data-slot="navigation-menu-viewport-wrapper"
      className={cn(
        "absolute start-0 top-full isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        // boolean-ui patch: the theme's overlay motion.
        data-bui-motion="overlay"
        // boolean-ui patch: the BooleanPress look — 4px under the triggers, 6px radius, 1px edge, the overlay shadow
        // (stock: 6px away, shadow).
        className={cn(
          "origin-top-center relative mt-1 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

/** @since 0.1.0 */
function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      // boolean-ui patch: the BooleanPress look — a menu row: 0.25rem 0.625rem padding, 14 px on a 21 px line, 4px
      // radius, the hovered-surface fill on hover and focus; 14 px icons in the light icon grey that darken on focus;
      // keyboard focus outside a panel adds a 1px `--ring` outline 2px away (stock: 8px padding, 16 px icons, a 3px
      // ring).
      className={cn(
        "flex flex-col gap-1 rounded-sm px-2.5 py-1 text-sm/normal outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:focus:bg-accent [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover hover:[&_svg:not([class*='text-'])]:text-muted-foreground focus:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

/**
 * A second level inside a panel: a nested list whose items open their own content, one at a time, as tabs do.
 *
 * @since 0.1.0
 */
// boolean-ui patch: Radix's Sub part, which stock does not export.
function NavigationMenuSub({
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Sub>) {
  return <NavigationMenuPrimitive.Sub data-slot="navigation-menu-sub" {...props} />
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavigationMenuSub,
  navigationMenuTriggerStyle,
}
