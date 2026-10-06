"use client"

// IconButton: built on Button. A square button with an icon and no text, whose name is a required `label`, shown in a
// Tooltip as well when `tooltip` is set.

import * as React from "react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip"
import { useControlSize, type ControlSize } from "@booleanpress/ui/provider"

/**
 * The square sizes: 24, 28, 36 and 42 px.
 *
 * @since 0.1.0
 */
type IconButtonSize = "xs" | ControlSize

const ICON_SIZES = { xs: "icon-xs", sm: "icon-sm", default: "icon", lg: "icon-lg" } as const

/**
 * Props of `IconButton`: Button's, without `size` and `aria-label`, plus the required `label`.
 *
 * @since 0.1.0
 */
type IconButtonProps = Omit<React.ComponentProps<typeof Button>, "size" | "aria-label" | "aria-labelledby"> & {
  /** What the button does, in words: its accessible name, and the tooltip's text. Required. */
  label: string
  /** 24 px `xs`, 28 px `sm`, 36 px `default`, 42 px `lg`. The provider's `controlSize` when left out. */
  size?: IconButtonSize
  /** Shows `label` in a tooltip on hover and keyboard focus. */
  tooltip?: boolean
  /** The tooltip's side: `top` (default), `right`, `bottom` or `left`. */
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

/** @since 0.1.0 */
function IconButton({
  className,
  label,
  size,
  tooltip = false,
  tooltipSide = "top",
  variant = "ghost",
  "aria-describedby": describedBy,
  ...props
}: IconButtonProps) {
  const control = useControlSize(size === "xs" ? undefined : size)
  const resolved: IconButtonSize = size === "xs" ? "xs" : control

  const button = (
    <Button
      data-slot="icon-button"
      variant={variant}
      size={ICON_SIZES[resolved]}
      aria-describedby={describedBy}
      // The visual target's icon sizes: 12 px in `xs` and `sm`, 14 px by default, 16 px in `lg`.
      className={cn(
        resolved === "sm" && "[&_svg:not([class*='size-'])]:size-3",
        resolved === "lg" && "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
      // After the other props: `label` is the name, the same words as the tooltip.
      aria-label={label}
    />
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      {/* The tooltip repeats the name, so it is not added as a description too: a screen reader would read it twice.
          A description the consumer passed is kept. */}
      <TooltipTrigger asChild aria-describedby={describedBy}>
        {button}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{label}</TooltipContent>
    </Tooltip>
  )
}

export { IconButton, type IconButtonProps, type IconButtonSize }
