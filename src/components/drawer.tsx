// Built on Base UI's Drawer (`@base-ui/react/drawer`), with shadcn's drawer API and look.
"use client"

import * as React from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "@/lib/utils"

import { useUiConfig } from "@booleanpress/ui/provider"

/**
 * The edge a drawer opens from. `left` and `right` are the reading direction's start and end: in a right-to-left page
 * `right` opens from the left edge, as Sheet does.
 *
 * @since 0.1.1
 */
type DrawerDirection = "top" | "right" | "bottom" | "left"

type WithStringClassName<T> = Omit<T, "className"> & { className?: string }

const DrawerContext = React.createContext<DrawerDirection>("bottom")

/** Base UI takes a `render` element where Radix takes `asChild`; this turns one into the other. */
function renderAsChild(asChild: boolean | undefined, children: React.ReactNode) {
  return asChild && React.isValidElement(children)
    ? { render: children as React.ReactElement<Record<string, unknown>> }
    : { children }
}

function swipeDirectionFor(direction: DrawerDirection, dir: "ltr" | "rtl") {
  if (direction === "top") return "up"
  if (direction === "bottom") return "down"
  const end = direction === "right"
  return end === (dir === "ltr") ? "right" : "left"
}

/**
 * A panel that slides in from an edge, most often the bottom, and closes when it is dragged back.
 *
 * @since 0.1.1
 */
function Drawer({
  direction = "bottom",
  swipeDirection,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  /** The edge it opens from; `left` and `right` follow the reading direction. */
  direction?: DrawerDirection
}) {
  const { dir } = useUiConfig()
  return (
    <DrawerContext.Provider value={direction}>
      {/* Base UI learns the provider's direction, so its own keys and swipes follow the reading direction. */}
      <DirectionProvider direction={dir}>
        <DrawerPrimitive.Root
          swipeDirection={swipeDirection ?? swipeDirectionFor(direction, dir)}
          onOpenChange={(open, eventDetails) => {
            // An Escape that a layer inside the drawer has already used (a Radix select, menu, popover or tooltip,
            // which marks it handled before Base UI sees it) closes only that layer, not the drawer as well.
            if (!open && eventDetails.reason === "escape-key" && eventDetails.event.defaultPrevented) {
              eventDetails.cancel()
              return
            }
            onOpenChange?.(open, eventDetails)
          }}
          {...props}
        />
      </DirectionProvider>
    </DrawerContext.Provider>
  )
}

/** @since 0.1.1 */
function DrawerTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger> & {
  /** Render the child element instead, with this part's behaviour merged onto it. */
  asChild?: boolean
}) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...renderAsChild(asChild, children)} {...props} />
}

/** @since 0.1.1 */
function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

/** @since 0.1.1 */
function DrawerClose({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close> & {
  /** Render the child element instead, with this part's behaviour merged onto it. */
  asChild?: boolean
}) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...renderAsChild(asChild, children)} {...props} />
}

/** @since 0.1.1 */
function DrawerOverlay({ className, ...props }: WithStringClassName<React.ComponentProps<typeof DrawerPrimitive.Backdrop>>) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      data-bui-motion="modal"
      // The mask token, fading in and out with the modal motion, and fading with the drag as the drawer is pulled away.
      className={cn(
        "fixed inset-0 z-50 bg-mask opacity-[calc(1-var(--drawer-swipe-progress,0))] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

const VIEWPORT_CLASSES: Record<DrawerDirection, string> = {
  bottom: "items-end justify-center",
  top: "items-start justify-center",
  right: "items-stretch justify-end",
  left: "items-stretch justify-start",
}

const POPUP_CLASSES: Record<DrawerDirection, string> = {
  bottom: "mt-24 max-h-[80vh] w-full rounded-t-xl border-t data-open:slide-in-from-bottom",
  top: "mb-24 max-h-[80vh] w-full rounded-b-xl border-b data-open:slide-in-from-top",
  right: "h-full w-3/4 border-s data-open:slide-in-from-end sm:max-w-80",
  left: "h-full w-3/4 border-e data-open:slide-in-from-start sm:max-w-80",
}

/**
 * The drawer's panel, with its backdrop; from the bottom it carries the handle bar.
 *
 * @since 0.1.1
 */
function DrawerContent({
  className,
  children,
  ...props
}: WithStringClassName<React.ComponentProps<typeof DrawerPrimitive.Popup>>) {
  const direction = React.useContext(DrawerContext)

  return (
    <DrawerPortal>
      <DrawerOverlay />
      {/* The panel's room starts below the WordPress admin bar, which would cover a drawer from the top or a side. */}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        className={cn(
          "fixed inset-x-0 top-[var(--wp-admin--admin-bar--height,0px)] bottom-0 z-50 flex",
          VIEWPORT_CLASSES[direction]
        )}
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          data-side={direction}
          data-bui-motion="modal"
          data-bui-portal=""
          // The card surface with the modal shadow, sliding in from its edge with the modal motion; it follows the
          // drag through `translate`, which the enter and exit animations (on `transform`) leave alone.
          className={cn(
            "group/drawer-content relative flex h-auto flex-col bg-card text-card-foreground shadow-xl outline-none [translate:var(--drawer-swipe-movement-x,0px)_var(--drawer-swipe-movement-y,0px)] transition-[translate] duration-(--bui-duration-base) ease-(--bui-ease-standard) data-open:animate-in data-closed:animate-out data-swiping:transition-none data-swiping:select-none",
            POPUP_CLASSES[direction],
            className
          )}
          {...props}
        >
          {direction === "bottom" && (
            <div
              aria-hidden="true"
              data-slot="drawer-handle"
              // The handle bar: 4 × 40 px.
              className="mx-auto mt-4 h-1 w-10 shrink-0 rounded-full bg-muted"
            />
          )}
          {children}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

/** @since 0.1.1 */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      // Centred in a drawer from the top or the bottom on narrow screens, at the start from 768 px; 1.125rem padding.
      className={cn(
        "flex flex-col gap-1.5 p-4.5 group-data-[side=bottom]/drawer-content:text-center group-data-[side=top]/drawer-content:text-center md:text-start md:group-data-[side=bottom]/drawer-content:text-start md:group-data-[side=top]/drawer-content:text-start",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-1.5 p-4.5", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function DrawerTitle({ className, ...props }: WithStringClassName<React.ComponentProps<typeof DrawerPrimitive.Title>>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-lg/normal font-semibold text-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function DrawerDescription({
  className,
  ...props
}: WithStringClassName<React.ComponentProps<typeof DrawerPrimitive.Description>>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  type DrawerDirection,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
