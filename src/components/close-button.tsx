"use client"

// CloseButton: built on Button. The round × that Dialog and Sheet put in their corner, named from the provider's `close`
// string, for any panel, card or banner that can be dismissed.

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/button"
import { useControlSize, useUiStrings, type ControlSize } from "@booleanpress/ui/provider"

const SIZES = { sm: "icon-sm", default: "icon", lg: "icon-lg" } as const

/** @since 0.1.1 */
function CloseButton({
  className,
  size,
  label,
  type = "button",
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "variant" | "severity" | "rounded"> & {
  /** 28 px `sm`, 36 px `default`, 42 px `lg`. The provider's `controlSize` when left out. */
  size?: ControlSize
  /** Its accessible name, when "Close" is not precise enough ("Dismiss the notice"). The provider's `close` string by default. */
  label?: string
}) {
  const strings = useUiStrings()
  const resolved = useControlSize(size)

  return (
    <Button
      data-slot="close-button"
      type={type}
      variant="ghost"
      size={SIZES[resolved]}
      rounded
      aria-label={label ?? strings.close}
      // The look of Dialog's and Sheet's ×: round, muted grey, the faintest surface on hover and the hovered surface
      // when pressed; a 12 px icon in `sm`, 14 px by default, 16 px in `lg`.
      className={cn(
        "text-muted-foreground hover:bg-subtle hover:text-muted-foreground active:bg-accent [&_svg:not([class*='size-'])]:size-3.5",
        resolved === "sm" && "[&_svg:not([class*='size-'])]:size-3",
        resolved === "lg" && "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </Button>
  )
}

export { CloseButton }
