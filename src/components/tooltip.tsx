"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { useUiConfig } from "@booleanpress/ui/provider"

/** @since 0.1.1 */
function TooltipProvider({
  delayDuration,
  skipDelayDuration,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  // boolean-ui patch: the provider's timing by default (stock: 0 ms, which strobes tooltips across a row of icons).
  // BooleanUIProvider already renders one at the root; this is for a subtree that needs its own timing.
  const config = useUiConfig()

  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration ?? config.tooltipDelay}
      skipDelayDuration={skipDelayDuration ?? config.tooltipSkipDelay}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/** @since 0.1.1 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/** @since 0.1.1 */
function TooltipContent({
  className,
  sideOffset = 0,
  arrow = true,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  /** Draws the small arrow that points at the trigger. `true` by default. @since 0.1.1 */
  arrow?: boolean
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        // boolean-ui patch: the BooleanPress look — a dark slate label in both themes (the text colour's slate in
        // light, the edge colour's slate in dark), white 12 px text on an 18 px line, 0.375rem 0.625rem padding, 6px
        // radius, the overlay shadow, at most 12.5rem wide (stock: bg-foreground text-background, px-3, no shadow).
        className={cn(
          "z-50 w-fit max-w-50 origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-2.5 py-1.5 text-xs/normal font-normal text-balance break-words text-background shadow-md dark:bg-secondary-hover dark:text-foreground fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {/* boolean-ui patch: the arrow takes the label's fill in both themes, and `arrow={false}` leaves it out (stock
            always draws it). */}
        {arrow ? (
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground dark:bg-secondary-hover dark:fill-secondary-hover"
          />
        ) : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
