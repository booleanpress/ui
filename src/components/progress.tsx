"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Progress as ProgressPrimitive } from "radix-ui"

import { useUiLocale } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
function Progress({
  className,
  value,
  max = 100,
  size = "default",
  steps,
  showValue = false,
  getValueLabel,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** The bar's height: `sm` 8 px, `default` 18 px, `lg` 24 px. @since 0.1.0 */
  size?: "sm" | "default" | "lg"
  /** Draws the bar in this many equal segments, such as the steps of a setup. @since 0.1.0 */
  steps?: number
  /**
   * Writes the value inside the filled part: `getValueLabel`'s text, a percentage by default. Not drawn at `sm`, in
   * segments or while indeterminate. @since 0.1.0
   */
  showValue?: boolean
}) {
  const { locale } = useUiLocale()
  // boolean-ui patch: a `max` that is not a positive number falls back to 100, and a value outside 0 to `max` is clamped
  // to it, so Radix neither logs an error nor reads a full or empty bar as indeterminate (stock passes them through).
  const top = Number.isFinite(max) && max > 0 ? max : 100
  const indeterminate = value == null || Number.isNaN(value)
  const current = indeterminate ? null : Math.min(top, Math.max(0, value))
  const percent = current === null ? 0 : (current / top) * 100
  // boolean-ui patch: the value's text is a percentage in the provider's locale, unless the app passes its own; it is
  // both aria-valuetext and the label drawn inside the bar (stock: Radix's English "60%", read aloud only).
  const valueLabel = React.useCallback(
    (current: number, top: number) =>
      getValueLabel
        ? getValueLabel(current, top)
        : new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(current / top),
    [getValueLabel, locale]
  )
  const segments = steps && steps > 1 && !indeterminate ? Math.round(steps) : 0

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      // boolean-ui patch: `value` reaches the Radix root too, so it emits aria-valuenow and data-state (stock keeps it
      // for the indicator only, and the bar reads as indeterminate).
      value={current}
      max={top}
      getValueLabel={valueLabel}
      // boolean-ui patch: the BooleanPress bar — 18px tall, 6px radius, a light slate track (stock: 8px, a pill, the
      // primary colour at 20%); 8px at `sm` and 24px at `lg`. Mirrored on a right-to-left page, so the fill grows from
      // the inline start. In segments, each segment carries its own track.
      className={cn(
        "group/progress relative h-4.5 w-full overflow-hidden rounded-md bg-border rtl:-scale-x-100 data-[size=lg]:h-6 data-[size=sm]:h-2",
        segments > 0 && "flex gap-1 rounded-none bg-transparent",
        className
      )}
      {...props}
    >
      {segments > 0 ? (
        // boolean-ui patch: the bar in equal segments, an addition; each fills in turn from the same value.
        Array.from({ length: segments }, (_, index) => {
          const fill = Math.min(1, Math.max(0, (percent - (index * 100) / segments) / (100 / segments)))
          return (
            <div
              key={index}
              data-slot="progress-step"
              data-state={fill >= 1 ? "complete" : fill > 0 ? "partial" : "empty"}
              className="h-full flex-1 overflow-hidden rounded-md bg-border"
            >
              <div
                data-slot="progress-step-indicator"
                className="h-full w-full bg-primary transition-all"
                style={{ transform: `translateX(-${(1 - fill) * 100}%)` }}
              />
            </div>
          )
        })
      ) : indeterminate ? (
        // boolean-ui patch: with no value, a bar slides across the track, an addition (stock draws nothing). It moves
        // with transform only, on tw-animate's `enter` keyframes; under reduced motion it rests, centred.
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="absolute inset-y-0 left-0 w-2/5 translate-x-[250%] animate-[enter_2s_var(--bui-ease-standard)_infinite] bg-primary [--tw-enter-translate-x:-350%] motion-reduce:translate-x-3/4"
        />
      ) : (
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full w-full flex-1 overflow-hidden bg-primary transition-all"
          style={{ transform: `translateX(-${100 - percent}%)` }}
        >
          {showValue && size !== "sm" ? (
            // boolean-ui patch: the value inside the filled part, an addition: 10px semibold (12px at `lg`), centred on
            // the fill by a transform that follows the fill's own, and turned back the right way on a mirrored bar.
            <span
              aria-hidden="true"
              data-slot="progress-value"
              className="flex h-full w-full items-center justify-center text-[0.625rem] leading-none font-semibold whitespace-nowrap text-primary-foreground tabular-nums transition-transform group-data-[size=lg]/progress:text-xs"
              style={{ transform: `translateX(${(100 - percent) / 2}%)` }}
            >
              <span className="rtl:-scale-x-100">{valueLabel(current ?? 0, top)}</span>
            </span>
          ) : null}
        </ProgressPrimitive.Indicator>
      )}
    </ProgressPrimitive.Root>
  )
}

export { Progress }
