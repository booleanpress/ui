"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { Button } from "@/components/button"
import { useReturnFocus, type ReturnFocusTarget } from "@/lib/return-focus"

/** @since 0.1.0 */
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/** @since 0.1.0 */
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

/** @since 0.1.0 */
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/** @since 0.1.0 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
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
 * The confirmation's panel, with its backdrop. Focus starts on Cancel, the least destructive action.
 *
 * @since 0.1.0
 */
function AlertDialogContent({
  className,
  size = "default",
  returnFocusTo,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  /** `sm` is a narrow, centred confirmation. */
  size?: "default" | "sm"
  /**
   * Where focus goes on close when the element that opened the overlay no longer exists — for example after the
   * confirmed action deleted the row it sat in.
   */
  returnFocusTo?: ReturnFocusTarget
}) {
  const focusHandlers = useReturnFocus(returnFocusTo, { onOpenAutoFocus, onCloseAutoFocus })

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        {...focusHandlers}
        className={cn(
          // boolean-ui patch: the floating-surface tokens (stock: bg-background), and a height that stops below the
          // WordPress admin bar, centred in the area under it. The BooleanPress look: 12px radius, 1.125rem padding and
          // gap, the modal shadow (stock: rounded-lg, p-6, gap-4, shadow-lg).
          "group/alert-dialog-content fixed top-[calc(50%+var(--wp-admin--admin-bar--height,0px)/2)] start-[50%] z-50 grid max-h-[calc(100dvh-var(--wp-admin--admin-bar--height,0px)-2rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] rtl:-translate-x-[-50%] translate-y-[-50%] gap-4.5 overflow-y-auto rounded-xl border bg-popover p-4.5 text-popover-foreground shadow-xl duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

/** @since 0.1.0 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      // boolean-ui patch: logical alignment for RTL (stock: text-left). The BooleanPress look: the message sits
      // 1.125rem under the title, and an icon 0.875rem before the text (stock: gap-1.5, gap-x-6).
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-4.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-3.5 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-start sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      // boolean-ui patch: the BooleanPress look — 0.375rem between the buttons (stock: gap-2).
      className={cn(
        "flex flex-col-reverse gap-1.5 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      // boolean-ui patch: the BooleanPress look — 18 px semibold on a 27 px line.
      className={cn(
        "text-lg/normal font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      // boolean-ui patch: the BooleanPress look — 14 px on a 21 px line (stock: text-sm's 20 px line).
      className={cn("text-sm/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      // boolean-ui patch: the BooleanPress look — a bare 24 px icon in the text colour (stock: a 64 px muted tile with
      // a 32 px icon).
      className={cn(
        "inline-flex size-6 items-center justify-center text-foreground sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

/** @since 0.1.0 */
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
