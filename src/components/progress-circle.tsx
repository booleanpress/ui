"use client"
// ProgressCircle: built on the Radix Progress primitive, drawn as an SVG ring that fills with the value.

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Progress as ProgressPrimitive } from "radix-ui"

import { useUiLocale } from "@booleanpress/ui/provider"

const RINGS = {
  sm: { box: 24, stroke: 3 },
  default: { box: 40, stroke: 4 },
  lg: { box: 64, stroke: 6 },
} as const

const progressCircleVariants = cva(
  "group/progress-circle relative inline-flex shrink-0 items-center justify-center data-[size=default]:size-10 data-[size=lg]:size-16 data-[size=sm]:size-6",
  {
    variants: {
      variant: {
        default: "text-primary",
        success: "text-success",
        info: "text-info",
        warning: "text-warning",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Props of `ProgressCircle`. A name is required: `aria-label`, or `aria-labelledby` pointing at visible text.
 *
 * @since 0.1.0
 */
type ProgressCircleProps = Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "children"> & {
  /** The ring's size: `sm` 24 px, `default` 40 px, `lg` 64 px. */
  size?: "sm" | "default" | "lg"
  /** The colour of the filled arc: the primary colour, or a status colour. */
  variant?: "default" | "success" | "info" | "warning" | "destructive"
  /** The ring's thickness in pixels at its own size. 3, 4 and 6 px for `sm`, `default` and `lg`. */
  strokeWidth?: number
  /** Writes the value in the middle: `getValueLabel`'s text, a percentage by default. Not drawn at `sm`. */
  showValue?: boolean
} & ({ "aria-label": string; "aria-labelledby"?: string } | { "aria-labelledby": string; "aria-label"?: string })

/** @since 0.1.0 */
function ProgressCircle({
  className,
  value,
  max = 100,
  size = "default",
  variant = "default",
  strokeWidth,
  showValue = false,
  getValueLabel,
  ...props
}: ProgressCircleProps) {
  const { locale } = useUiLocale()
  // A `max` that is not a positive number falls back to 100, and a value outside 0 to `max` is clamped to it, so Radix
  // neither logs an error nor reads a full or empty ring as indeterminate.
  const top = Number.isFinite(max) && max > 0 ? max : 100
  const indeterminate = value == null || Number.isNaN(value)
  const current = indeterminate ? null : Math.min(top, Math.max(0, value))
  const percent = current === null ? 0 : (current / top) * 100
  const valueLabel = React.useCallback(
    (current: number, top: number) =>
      getValueLabel
        ? getValueLabel(current, top)
        : new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(current / top),
    [getValueLabel, locale]
  )

  const { box, stroke: defaultStroke } = RINGS[size]
  const stroke = strokeWidth ?? defaultStroke
  const radius = (box - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <ProgressPrimitive.Root
      data-slot="progress-circle"
      data-size={size}
      data-variant={variant}
      value={current}
      max={top}
      getValueLabel={valueLabel}
      className={cn(progressCircleVariants({ variant }), className)}
      {...props}
    >
      {/* Starts at the top and fills clockwise, counter-clockwise on a right-to-left page (flipped before the quarter
          turn); while indeterminate a quarter of the ring turns, and it rests under reduced motion. */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${box} ${box}`}
        fill="none"
        className={cn("size-full -rotate-90 rtl:-scale-y-100", indeterminate && "animate-spin")}
      >
        <circle
          data-slot="progress-circle-track"
          cx={box / 2}
          cy={box / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          data-slot="progress-circle-range"
          cx={box / 2}
          cy={box / 2}
          r={radius}
          strokeWidth={stroke}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={indeterminate ? `${circumference / 4} ${circumference}` : circumference}
          strokeDashoffset={indeterminate ? 0 : circumference * (1 - percent / 100)}
          className={cn(!indeterminate && "transition-[stroke-dashoffset]", !indeterminate && percent === 0 && "opacity-0")}
        />
      </svg>
      {showValue && size !== "sm" && !indeterminate ? (
        <span
          aria-hidden="true"
          data-slot="progress-circle-value"
          className="absolute inset-0 flex items-center justify-center text-[0.625rem] leading-none font-semibold text-foreground tabular-nums group-data-[size=lg]/progress-circle:text-xs group-data-[size=lg]/progress-circle:font-medium"
        >
          {valueLabel(current ?? 0, top)}
        </span>
      ) : null}
    </ProgressPrimitive.Root>
  )
}

export { ProgressCircle }
export type { ProgressCircleProps }
