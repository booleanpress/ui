"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator as SeparatorPrimitive } from "radix-ui"

type SeparatorVariant = "solid" | "dashed" | "dotted"
type SeparatorAlign = "start" | "center" | "end" | "top" | "bottom"

// boolean-ui patch: a dashed or dotted line is a 1px border in the line's colour instead of a 1px fill (stock: solid
// only).
const BROKEN_LINE: Record<SeparatorVariant, string> = {
  solid: "",
  dashed: "border-dashed",
  dotted: "border-dotted",
}

function lineClasses(orientation: "horizontal" | "vertical", variant: SeparatorVariant) {
  if (variant === "solid") return orientation === "horizontal" ? "h-px bg-border" : "w-px bg-border"
  return cn(orientation === "horizontal" ? "h-0 border-t" : "w-0 border-s", "border-border", BROKEN_LINE[variant])
}

/** @since 0.1.1 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "solid",
  align = "center",
  children,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  /** The line's style: `solid` (default), `dashed` or `dotted`. @since 0.1.1 */
  variant?: SeparatorVariant
  /**
   * Where the content sits along the line: `start`, `center` (default) or `end`; on a vertical line `top` and `bottom`
   * mean the same as `start` and `end`. @since 0.1.1
   */
  align?: SeparatorAlign
}) {
  const contentId = React.useId()

  if (children === undefined || children === null || children === false) {
    return (
      <SeparatorPrimitive.Root
        data-slot="separator"
        data-variant={variant}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          // boolean-ui patch: a dashed or dotted line (stock: solid only).
          variant !== "solid" &&
            cn(
              "bg-transparent data-[orientation=horizontal]:h-0 data-[orientation=horizontal]:border-t data-[orientation=vertical]:w-0 data-[orientation=vertical]:border-s",
              BROKEN_LINE[variant]
            ),
          className
        )}
        {...props}
      />
    )
  }

  // boolean-ui patch: content inside the line — a 14px line before it (start), after it (end) or lines filling both
  // sides (center), 6px from the text (6px and 6px on a vertical line). A real separator is named by its content
  // (stock: no content).
  const at = align === "top" ? "start" : align === "bottom" ? "end" : align
  const horizontal = orientation === "horizontal"
  const short = horizontal ? "w-3.5 flex-none" : "h-1.5 flex-none"

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      data-variant={variant}
      data-align={at}
      decorative={decorative}
      orientation={orientation}
      aria-labelledby={decorative ? undefined : contentId}
      className={cn("flex shrink-0 items-center text-foreground", horizontal ? "w-full" : "h-full flex-col", className)}
      {...props}
    >
      <span
        aria-hidden
        data-slot="separator-line"
        className={cn(lineClasses(orientation, variant), at === "start" ? short : "flex-1")}
      />
      <span
        id={contentId}
        data-slot="separator-content"
        className={cn("shrink-0", horizontal ? "px-1.5" : "py-1.5")}
      >
        {children}
      </span>
      <span
        aria-hidden
        data-slot="separator-line"
        className={cn(lineClasses(orientation, variant), at === "end" ? short : "flex-1")}
      />
    </SeparatorPrimitive.Root>
  )
}

export { Separator }
