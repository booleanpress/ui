"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  // boolean-ui patch: the BooleanPress look — 6px radius, a 1px edge, 0.375rem by 0.625rem padding, a 1rem icon 0.5rem
  // from the text, and a faint shadow tinted with the variant's hue (stock: rounded-lg, px-4 py-3, a 0.75rem gap).
  "group/alert relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-md border px-2.5 py-1.5 text-sm/normal has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-2 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        // boolean-ui patch: each variant is a subtle fill, a matching edge and strong text in one hue; default is the
        // neutral secondary look (stock: default on the card surface, destructive as red text only). The status
        // variants (success, warning, info) are additions.
        default:
          "border-border bg-secondary text-secondary-foreground shadow-[0_4px_8px_0_color-mix(in_srgb,var(--color-muted-foreground)_4%,transparent)]",
        success:
          "border-success-border bg-success-subtle text-success-strong shadow-[0_4px_8px_0_color-mix(in_srgb,var(--color-success)_4%,transparent)]",
        warning:
          "border-warning-border bg-warning-subtle text-warning-strong shadow-[0_4px_8px_0_color-mix(in_srgb,var(--color-warning)_4%,transparent)]",
        info: "border-info-border bg-info-subtle text-info-strong shadow-[0_4px_8px_0_color-mix(in_srgb,var(--color-info)_4%,transparent)]",
        destructive:
          "border-destructive-border bg-destructive-subtle text-destructive-strong shadow-[0_4px_8px_0_color-mix(in_srgb,var(--color-destructive)_4%,transparent)]",
      },
      // boolean-ui patch: sizes, an addition — `sm` 0.25rem by 0.5rem padding, 12px text and a 14px icon; `lg`
      // 0.5rem by 0.75rem, 16px text and an 18px icon.
      size: {
        sm: "px-2 py-1 text-xs/normal has-[>svg]:grid-cols-[calc(var(--spacing)*3.5)_1fr] [&>svg]:size-3.5",
        default: "",
        lg: "px-3 py-2 text-base/normal has-[>svg]:grid-cols-[calc(var(--spacing)*4.5)_1fr] [&>svg]:size-4.5 [&>svg]:translate-y-0.75",
      },
      // boolean-ui patch: appearances, an addition — `outline` keeps the edge, in the strong colour, on no fill;
      // `simple` is the coloured text and icon alone, with no fill, edge, shadow or padding.
      appearance: {
        default: "",
        outline: "bg-transparent",
        simple: "border-0 bg-transparent p-0 shadow-none",
      },
    },
    compoundVariants: [
      { appearance: "outline", variant: "default", className: "border-muted-foreground text-muted-foreground" },
      { appearance: "outline", variant: "success", className: "border-success-strong" },
      { appearance: "outline", variant: "warning", className: "border-warning-strong" },
      { appearance: "outline", variant: "info", className: "border-info-strong" },
      { appearance: "outline", variant: "destructive", className: "border-destructive-strong" },
      { appearance: "simple", variant: "default", className: "text-muted-foreground" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      appearance: "default",
    },
  }
)

/** @since 0.1.1 */
function Alert({
  className,
  variant,
  size = "default",
  appearance = "default",
  duration,
  onDismiss,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    /**
     * Removes the alert after this many milliseconds and calls `onDismiss`. The count pauses while the pointer is
     * over the alert or focus is inside it. @since 0.1.1
     */
    duration?: number
    /** Called when `duration` runs out, as the alert removes itself. @since 0.1.1 */
    onDismiss?: () => void
  }) {
  const [dismissed, setDismissed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const paused = hovered || focused
  const remaining = React.useRef(duration)
  const dismissRef = React.useRef(onDismiss)

  React.useEffect(() => {
    dismissRef.current = onDismiss
  })

  // A new duration starts the count again.
  React.useEffect(() => {
    remaining.current = duration
  }, [duration])

  // boolean-ui patch: auto-dismissal, an addition. The count runs only while nothing holds the alert: entering it
  // with the pointer, or moving focus into it, stops the timer and keeps the time left; leaving starts it again.
  React.useEffect(() => {
    if (duration == null || !Number.isFinite(duration) || dismissed || paused) return
    const started = Date.now()
    const timer = window.setTimeout(() => {
      setDismissed(true)
      dismissRef.current?.()
    }, Math.max(0, remaining.current ?? duration))
    return () => {
      window.clearTimeout(timer)
      remaining.current = Math.max(0, (remaining.current ?? duration) - (Date.now() - started))
    }
  }, [duration, dismissed, paused])

  if (dismissed) return null

  return (
    <div
      data-slot="alert"
      data-size={size}
      data-appearance={appearance}
      role="alert"
      className={cn(alertVariants({ variant, size, appearance }), className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        setHovered(true)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        setHovered(false)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        setFocused(true)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      // boolean-ui patch: medium weight at the normal tracking (stock: tracking-tight).
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      // boolean-ui patch: the description keeps the alert's own colour, at the normal line height (stock: muted text,
      // leading-relaxed paragraphs), and the alert's size.
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm/normal group-data-[size=lg]/alert:text-base/normal group-data-[size=sm]/alert:text-xs/normal",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
