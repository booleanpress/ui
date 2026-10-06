"use client"

// One choice drawn as joined segments, built on Radix RadioGroup, with a highlight that slides by transform alone.

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { useControlSize, useUiConfig, type ControlSize } from "@booleanpress/ui/provider"

const SegmentedControlContext = React.createContext<{ size: ControlSize; sliding: boolean }>({
  size: "default",
  sliding: false,
})

/**
 * The `value` of each segment given straight as a child, in order, so the highlight knows where to go; `null` when a
 * child is anything else. Empty children (`false`, `null`, as a condition leaves them) do not count.
 */
function segmentValues(children: React.ReactNode): string[] | null {
  const values: string[] = []
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<{ value?: unknown }>(child) || typeof child.props.value !== "string") return null
    values.push(child.props.value)
  }
  return values
}

/**
 * A row of joined segments people choose one of, such as a view switcher. Name it with `aria-label` or
 * `aria-labelledby`; give an icon-only segment an `aria-label`.
 *
 * @since 0.1.1
 */
function SegmentedControl({
  value,
  defaultValue,
  onValueChange,
  size,
  fluid = false,
  dir,
  className,
  children,
  style,
  ...props
}: Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "value" | "defaultValue" | "orientation"> & {
  /** The chosen segment's value, when you control it. */
  value?: string
  /** The chosen segment's value at the start, when it controls itself. */
  defaultValue?: string
  /** The text size: 12, 14 or 16 px, 32, 35 or 38 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** Fills the width of its container; the segments share it equally. */
  fluid?: boolean
}) {
  const resolvedSize = useControlSize(size)
  const config = useUiConfig()
  const rtl = (dir ?? config.dir) === "rtl"
  const [inner, setInner] = React.useState(defaultValue ?? "")
  const current = value ?? inner

  const direct = segmentValues(children)
  const values = direct ?? []
  const index = values.indexOf(current)
  // The highlight slides only when every segment is a direct child; otherwise each chosen segment draws its own.
  const sliding = values.length > 0
  const context = React.useMemo(() => ({ size: resolvedSize, sliding }), [resolvedSize, sliding])

  return (
    <SegmentedControlContext.Provider value={context}>
      <RadioGroupPrimitive.Root
        data-slot="segmented-control"
        data-size={resolvedSize}
        value={current || null}
        onValueChange={(chosen) => {
          // A form reset to "nothing chosen" reports `null`; the control's value is a string, `""` for none.
          const next = chosen ?? ""
          if (value === undefined) setInner(next)
          onValueChange?.(next)
        }}
        dir={dir}
        className={cn(
          // The BooleanPress look of the visual target's select button: one slate bar (the page colour in dark) with a
          // 1px edge of its own colour, 6px radius, equal segments; `--invalid` edge when invalid; disabled takes the
          // disabled-field fill.
          "group/segmented relative isolate inline-grid w-fit auto-cols-fr grid-flow-col rounded-md border border-muted bg-muted dark:border-background dark:bg-background",
          "aria-invalid:border-invalid dark:aria-invalid:border-invalid data-[disabled]:border-field-disabled data-[disabled]:bg-field-disabled dark:data-[disabled]:border-field-disabled dark:data-[disabled]:bg-field-disabled",
          fluid && "w-full",
          className
        )}
        style={{ "--segment-count": values.length || 1, "--segment-index": Math.max(index, 0), ...style } as React.CSSProperties}
        {...props}
      >
        {sliding && index >= 0 ? (
          <span
            aria-hidden="true"
            data-slot="segmented-control-indicator"
            className={cn(
              "pointer-events-none absolute inset-y-0 start-0 z-0 w-[calc(100%/var(--segment-count))] transition-transform duration-(--bui-duration-base) ease-(--bui-ease-standard)",
              rtl ? "translate-x-[calc(var(--segment-index)*-100%)]" : "translate-x-[calc(var(--segment-index)*100%)]"
            )}
          >
            <span data-slot="segmented-control-plate" className="absolute inset-1 rounded-md bg-background shadow-[0_1px_2px_0_rgb(0_0_0/0.02),0_1px_2px_0_rgb(0_0_0/0.04)] group-data-[disabled]/segmented:bg-muted dark:bg-muted" />
          </span>
        ) : null}
        {children}
      </RadioGroupPrimitive.Root>
    </SegmentedControlContext.Provider>
  )
}

/**
 * One segment of a `SegmentedControl`: text, an icon and text, or an icon alone with an `aria-label`.
 *
 * @since 0.1.1
 */
function SegmentedControlItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const { size, sliding } = React.useContext(SegmentedControlContext)

  return (
    <RadioGroupPrimitive.Item
      data-slot="segmented-control-item"
      data-size={size}
      className={cn(
        // Muted 14px medium text that darkens under the pointer and goes dark when chosen, 4px of frame round 2px 10px
        // of content, 14px icons; keyboard focus is the 1px `--ring` outline 2px away. When the bar is narrower than its
        // segments at their widest, a label of several words wraps, centred, and a single word too long for its segment is
        // clipped at the segment's end: the segments stay equal, and no text runs over the next one.
        "relative z-1 inline-flex min-w-0 cursor-pointer items-center justify-center-safe gap-2 rounded-md px-3.5 py-1.5 overflow-hidden text-center text-sm/normal font-medium wrap-break-word text-muted-foreground transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-secondary-hover-foreground focus-visible:z-2 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid data-[state=checked]:text-accent-foreground disabled:cursor-not-allowed disabled:text-field-disabled-foreground disabled:hover:text-field-disabled-foreground disabled:data-[state=checked]:text-field-disabled-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "data-[size=lg]:text-base/normal data-[size=sm]:text-xs/normal",
        // A disabled segment in a live bar fills its whole cell with the disabled-field colour, as the visual target does;
        // the bar's outer corners stay round.
        "group-not-data-[disabled]/segmented:disabled:rounded-none group-not-data-[disabled]/segmented:disabled:bg-field-disabled group-not-data-[disabled]/segmented:first-of-type:disabled:rounded-s-[calc(var(--radius-md)-1px)] group-not-data-[disabled]/segmented:last:disabled:rounded-e-[calc(var(--radius-md)-1px)]",
        // Without the sliding highlight, the chosen segment draws the raised plate itself.
        !sliding &&
          "before:pointer-events-none before:absolute before:inset-1 before:-z-1 before:rounded-md data-[state=checked]:before:bg-background data-[state=checked]:before:shadow-[0_1px_2px_0_rgb(0_0_0/0.02),0_1px_2px_0_rgb(0_0_0/0.04)] dark:data-[state=checked]:before:bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlItem }
