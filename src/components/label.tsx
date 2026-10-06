"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label as LabelPrimitive } from "radix-ui"

/** @since 0.1.1 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // boolean-ui patch: the BooleanPress look — 14px medium text on a 14px line in `--foreground`, an 8px gap to an icon,
        // 50% opacity when its control is disabled (stock: line height 1, an 8px gap, inherited colour, 50% opacity).
        "flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none group-data-disabled:pointer-events-none group-data-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
