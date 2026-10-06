"use client"

// MeterGroup: built on semantic HTML — a group of `role="meter"` segments sharing one track, with no primitive. A meter
// has no behaviour beyond its ARIA attributes, so Base UI's Meter would add a peer dependency and nothing for screen
// readers.
import * as React from "react"
import { cn } from "@/lib/utils"

import { useUiLocale } from "@booleanpress/ui/provider"

/** One segment of a `MeterGroup`. @since 0.1.1 */
interface MeterGroupItem {
  /** What the segment measures, such as "Attachments": its name for screen readers and its text in the legend. */
  label: string
  /** The amount, in the group's range from `min` to `max`. */
  value: number
  /** A CSS colour, such as `"var(--chart-2)"` or `"var(--success)"`. Defaults to the chart colours in turn. */
  color?: string
  /** An icon in the legend in place of the dot, drawn in the segment's colour. */
  icon?: React.ReactNode
}

/** Which way the track runs. @since 0.1.1 */
type MeterGroupOrientation = "horizontal" | "vertical"

/** A segment as the parts draw it: its colour, its share of the track and its value as text. */
interface MeterGroupSegment extends MeterGroupItem {
  color: string
  percent: number
  /** The length drawn on the track, in percent: its share, cut short where the segments before it fill the track. */
  length: number
  text: string
}

const MeterGroupContext = React.createContext<{
  segments: MeterGroupSegment[]
  min: number
  max: number
  orientation: MeterGroupOrientation
} | null>(null)

function useMeterGroup(part: string) {
  const context = React.useContext(MeterGroupContext)
  if (!context) throw new Error(`${part} must be used inside a MeterGroup.`)
  return context
}

/**
 * Several amounts that share one range, such as the parts of a storage quota: segments side by side on one track, each a
 * meter with its own label and value, and a legend. Name the group with `aria-label` or `aria-labelledby`.
 *
 * @since 0.1.1
 */
function MeterGroup({
  className,
  values,
  min = 0,
  max = 100,
  orientation = "horizontal",
  labelPosition = "end",
  labelOrientation,
  formatValue,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The segments, in order along the track. */
  values: MeterGroupItem[]
  /** The bottom of the range. */
  min?: number
  /** The top of the range: a segment's share of the track is its value over `max - min`. */
  max?: number
  /** `horizontal` lays the track across with the legend under it; `vertical` stands it up with the legend beside it. */
  orientation?: MeterGroupOrientation
  /** Where the built-in legend goes: after the track (`end`) or before it (`start`). */
  labelPosition?: "start" | "end"
  /** How the built-in legend lists its labels: in a row that wraps, or one under another. Follows `orientation` by default. */
  labelOrientation?: MeterGroupOrientation
  /** Writes a segment's value, for the legend and for screen readers. Defaults to its share as a percentage, in the provider's locale. */
  formatValue?: (value: number, percent: number) => string
}) {
  const { locale } = useUiLocale()
  const range = max - min || 1
  const percentFormat = React.useMemo(() => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }), [locale])
  // Segments that add up to more than the range would run past the end of the track: each is drawn no longer than the
  // room the ones before it leave, while its value and text stay its own.
  const segments: MeterGroupSegment[] = []
  for (const [index, item] of values.entries()) {
    const percent = Math.min(100, Math.max(0, (item.value / range) * 100))
    const drawn = segments.reduce((sum, segment) => sum + segment.length, 0)
    segments.push({
      ...item,
      color: item.color ?? `var(--chart-${(index % 5) + 1})`,
      percent,
      length: Math.max(0, Math.min(percent, 100 - drawn)),
      text: formatValue ? formatValue(item.value, percent) : percentFormat.format(percent / 100),
    })
  }
  const context = { segments, min, max, orientation }

  return (
    <MeterGroupContext.Provider value={context}>
      <div
        role="group"
        data-slot="meter-group"
        data-orientation={orientation}
        className={cn(
          "flex gap-3.5 text-sm/normal data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            {labelPosition === "start" ? <MeterGroupLegend orientation={labelOrientation} /> : null}
            <MeterGroupMeters />
            {labelPosition === "end" ? <MeterGroupLegend orientation={labelOrientation} /> : null}
          </>
        )}
      </div>
    </MeterGroupContext.Provider>
  )
}

/**
 * The track: a 6 px bar of the content edge colour holding one meter per segment, each as long as its share. Rendered by
 * `MeterGroup` unless you give it children.
 *
 * @since 0.1.1
 */
function MeterGroupMeters({ className, ...props }: Omit<React.ComponentProps<"div">, "children">) {
  const { segments, min, max, orientation } = useMeterGroup("MeterGroupMeters")
  const vertical = orientation === "vertical"

  return (
    <div
      data-slot="meter-group-meters"
      className={cn("flex shrink-0 rounded-md bg-border", vertical ? "h-full min-h-32 w-1.5 flex-col" : "h-1.5 w-full", className)}
      {...props}
    >
      {segments.map((segment, index) => (
        <div
          key={`${segment.label}-${index}`}
          role="meter"
          aria-label={segment.label}
          // Kept within the range, as ARIA requires; the text still says the real amount.
          aria-valuenow={Math.min(Math.max(segment.value, Math.min(min, max)), Math.max(min, max))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={segment.text}
          data-slot="meter-group-meter"
          // The first and last segments round the track's ends, as the visual target's meters do.
          className={cn(
            "shrink-0",
            vertical ? "w-full first:rounded-t-md last:rounded-b-md" : "h-full first:rounded-s-md last:rounded-e-md"
          )}
          style={{ [vertical ? "height" : "width"]: `${segment.length}%`, backgroundColor: segment.color }}
        />
      ))}
    </div>
  )
}

/**
 * The legend: each segment's dot (or icon) in its colour, its label and its value. Hidden from assistive technology,
 * which reads the same from the meters. Rendered by `MeterGroup` unless you give it children.
 *
 * @since 0.1.1
 */
function MeterGroupLegend({
  className,
  orientation,
  ...props
}: Omit<React.ComponentProps<"ol">, "children"> & {
  /** In a row that wraps (`horizontal`) or one under another (`vertical`). Follows the group's orientation by default. */
  orientation?: MeterGroupOrientation
}) {
  const group = useMeterGroup("MeterGroupLegend")
  const resolved = orientation ?? group.orientation

  return (
    <ol
      aria-hidden="true"
      data-slot="meter-group-legend"
      data-orientation={resolved}
      className={cn(
        "m-0 flex list-none flex-wrap p-0 data-[orientation=horizontal]:gap-3.5 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-1.5",
        className
      )}
      {...props}
    >
      {group.segments.map((segment, index) => (
        <li key={`${segment.label}-${index}`} data-slot="meter-group-label" className="m-0 inline-flex items-center gap-1.5">
          {segment.icon ? (
            <span
              data-slot="meter-group-label-icon"
              className="inline-flex size-3.5 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5"
              style={{ color: segment.color }}
            >
              {segment.icon}
            </span>
          ) : (
            <span data-slot="meter-group-label-marker" className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
          )}
          <span data-slot="meter-group-label-text">
            {segment.label} ({segment.text})
          </span>
        </li>
      ))}
    </ol>
  )
}

export { MeterGroup, MeterGroupMeters, MeterGroupLegend }
export type { MeterGroupItem, MeterGroupOrientation }
