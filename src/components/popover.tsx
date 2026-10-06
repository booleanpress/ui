"use client"

import * as React from "react"
import { useKeepScrollFromDialogLock } from "@/lib/scroll-lock"
import { cn } from "@/lib/utils"
import { Popover as PopoverPrimitive } from "radix-ui"

/** @since 0.1.0 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/** @since 0.1.0 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/** @since 0.1.0 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ref,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  // boolean-ui patch: the wheel and touch scroll the content when the popover opens from a modal dialog or sheet, whose
  // scroll lock otherwise cancels them, the content being portalled out of the dialog (stock: they do nothing there).
  const contentRef = useKeepScrollFromDialogLock(ref)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={contentRef}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        // boolean-ui patch: the BooleanPress look — 8px radius, 1px edge, 16px padding, a soft 8px shadow at 5% (stock:
        // 6px radius, shadow-md).
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-lg border bg-popover p-4 text-popover-foreground shadow-[0_4px_8px_0_rgb(0_0_0/0.05)] outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

/** @since 0.1.0 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

/** @since 0.1.0 */
function PopoverHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      // boolean-ui patch: the BooleanPress look — 14 px on a 21 px line (stock: text-sm's 20 px line).
      className={cn("flex flex-col gap-1 text-sm/normal", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
