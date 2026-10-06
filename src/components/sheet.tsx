"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { Button } from "@/components/button"
import { useReturnFocus, type ReturnFocusTarget } from "@/lib/return-focus"
import { useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.1 */
function Sheet({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

/** @since 0.1.1 */
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/** @since 0.1.1 */
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

/** @since 0.1.1 */
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/** @since 0.1.1 */
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      // boolean-ui patch: the BooleanPress look — the backdrop is the mask token, 40 % black, 60 % in dark (stock:
      // bg-black/50).
      className={cn(
        "fixed inset-0 z-50 bg-mask data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * A panel that slides in from an edge of the screen, with its backdrop and the close button.
 *
 * @since 0.1.1
 */
function SheetContent({
  className,
  children,
  side = "right",
  size = "default",
  showCloseButton = true,
  returnFocusTo,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  /** The screen edge it slides from. */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * `default`: a panel against its edge; `full`: it covers the whole window, still sliding from its edge.
   * @since 0.1.1
   */
  size?: "default" | "full"
  /** Render the × button. */
  showCloseButton?: boolean
  /**
   * Where focus goes on close when the element that opened the overlay no longer exists — for example after the
   * confirmed action deleted the row it sat in.
   */
  returnFocusTo?: ReturnFocusTarget
}) {
  const strings = useUiStrings()
  const focusHandlers = useReturnFocus(returnFocusTo, { onOpenAutoFocus, onCloseAutoFocus })

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        data-size={size}
        {...focusHandlers}
        className={cn(
          // boolean-ui patch: the floating-surface tokens (stock: bg-background). The BooleanPress look: no gap
          // between the parts, which carry their own 1.125rem padding, and the modal shadow (stock: gap-4, shadow-lg).
          "fixed z-50 flex flex-col bg-popover text-popover-foreground shadow-xl transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500",
          // boolean-ui patch: the panel slides from the edge it sits on in either direction (stock, after the RTL
          // migration, places "right" at the inline end but still slides it in from the physical right). The
          // BooleanPress look: side panels are at most 20rem wide (stock: sm:max-w-sm, 24rem).
          // boolean-ui patch: the panel starts below the WordPress admin bar, which would cover its title and ×, and a
          // top or bottom panel stops at the window's height, so a tall one scrolls its body instead of leaving the
          // window (stock: from the window's top edge, as tall as its content).
          side === "right" &&
          "end-0 top-[var(--wp-admin--admin-bar--height,0px)] bottom-0 h-auto w-3/4 border-s data-[state=closed]:slide-out-to-end data-[state=open]:slide-in-from-end sm:max-w-80",
          side === "left" &&
          "start-0 top-[var(--wp-admin--admin-bar--height,0px)] bottom-0 h-auto w-3/4 border-e data-[state=closed]:slide-out-to-start data-[state=open]:slide-in-from-start sm:max-w-80",
          side === "top" &&
          "inset-x-0 top-[var(--wp-admin--admin-bar--height,0px)] h-auto max-h-[calc(100dvh-var(--wp-admin--admin-bar--height,0px))] border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" &&
          "inset-x-0 bottom-0 h-auto max-h-[calc(100dvh-var(--wp-admin--admin-bar--height,0px))] border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          // boolean-ui patch: `size="full"` covers the window below the WordPress admin bar, edged all round (stock: no
          // full size).
          size === "full" &&
          "inset-x-0 top-[var(--wp-admin--admin-bar--height,0px)] bottom-0 h-auto max-h-none w-full border sm:max-w-none",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          // boolean-ui patch: the system's 36 px ghost icon button (stock: a bare 16 px icon), at the inline end,
          // centred on the title's first line, named from the provider (PATCHES.md §1, rows 1–2). The BooleanPress
          // look: round, in the text button's colours, with a 14 px icon.
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute end-4.5 top-4.5 rounded-full text-muted-foreground hover:bg-subtle hover:text-muted-foreground active:bg-accent [&_svg:not([class*='size-'])]:size-3.5"
            >
              <XIcon />
              <span className="sr-only">{strings.close}</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/** @since 0.1.1 */
function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      // boolean-ui patch: room for the × so a long title wraps before it. The BooleanPress look: 1.125rem padding,
      // and beside the × the title's first line is padded to the button's 36 px, so the two share a centre line
      // (stock: p-4).
      className={cn(
        "flex flex-col gap-1.5 p-4.5 has-[~[data-slot=sheet-close]]:pe-15.5 has-[~[data-slot=sheet-close]]:*:data-[slot=sheet-title]:py-[0.28125rem]",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function SheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      // boolean-ui patch: the BooleanPress look — 1.125rem padding, 0.375rem between the buttons (stock: p-4, gap-2).
      className={cn("mt-auto flex flex-col gap-1.5 p-4.5", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      // boolean-ui patch: the BooleanPress look — 18 px semibold on a 27 px line (stock: 16 px).
      className={cn("text-lg/normal font-semibold text-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      // boolean-ui patch: the BooleanPress look — 14 px on a 21 px line (stock: text-sm's 20 px line).
      className={cn("text-sm/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
