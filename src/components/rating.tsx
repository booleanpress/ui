"use client"

// A star rating built on Radix RadioGroup: one radio per star (two with half stars), each named "3 of 5".

import * as React from "react"
import { StarIcon } from "lucide-react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn, fillString } from "@/lib/utils"
import { useControlSize, useUiLocale, useUiStrings, type ControlSize } from "@booleanpress/ui/provider"

// The fill of a star: whole, its start half (the right half in RTL) or none.
const ON_CLIP = {
  full: "",
  half: "[clip-path:inset(0_50%_0_0)] rtl:[clip-path:inset(0_0_0_50%)]",
  empty: "[clip-path:inset(0_100%_0_0)] rtl:[clip-path:inset(0_0_0_100%)]",
} as const

type RatingProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange" | "orientation" | "loop" | "asChild"
> & {
  /** The rating, when you control it: 0 (none) to `max`, in halves with `allowHalf`. */
  value?: number
  /** The rating at the start, when it controls itself. 0 by default. */
  defaultValue?: number
  /** Called with the new rating when a star is chosen. */
  onValueChange?: (value: number) => void
  /** The number of stars. 5 by default. */
  max?: number
  /** Enabled by default. Lets people choose half stars: each star takes two radios, its start half and its whole. */
  allowHalf?: boolean
  /** Shows the rating without letting it change: an image named with the value, not a radio group. */
  readOnly?: boolean
  /** Stars of 14, 16 or 20 px. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** The mark of a chosen star, in place of the filled star. */
  icon?: React.ReactNode
  /** The mark of an unchosen star, in place of the outlined star. Defaults to `icon`, else the outlined star. */
  emptyIcon?: React.ReactNode
  /** Renders a mark for each position and layer. `index` starts at zero; `checked` marks the chosen position. */
  renderIcon?: (state: { index: number; active: boolean; checked: boolean; value: number }) => React.ReactNode
  /** `vertical` stacks the stars. `horizontal` by default. */
  orientation?: "horizontal" | "vertical"
  /**
   * Choosing the current rating again (a click, or Space or Enter on the checked star) clears it to 0, as do Backspace and
   * Delete. `true` by default; `false` keeps a rating once one is chosen.
   */
  allowClear?: boolean
}

/**
 * A row of stars people choose a rating from, or that shows one (`readOnly`). Name it with `aria-label` or
 * `aria-labelledby`.
 *
 * @since 0.1.1
 */
function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  allowHalf = true,
  readOnly = false,
  disabled = false,
  size,
  icon,
  emptyIcon,
  renderIcon,
  orientation = "horizontal",
  allowClear = true,
  className,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: RatingProps) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const [inner, setInner] = React.useState(defaultValue)
  const current = value ?? inner
  const valueId = React.useId()

  const number = React.useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }), [locale])
  const valueText = (n: number) => fillString(strings.ratingValue, { value: number.format(n), max: number.format(max) })

  // A polite message for a cleared rating: a radio group has no way to say that none is chosen any more.
  const [announcement, setAnnouncement] = React.useState("")

  const set = (n: number) => {
    if (value === undefined) setInner(n)
    onValueChange?.(n)
    setAnnouncement(n === 0 ? strings.ratingCleared : "")
  }

  const choose = (next: string) => set(Number(next))

  const clear = () => {
    if (!allowClear || disabled || current === 0) return false
    set(0)
    return true
  }

  const filled = icon ?? <StarIcon className="fill-current" />
  const empty = emptyIcon ?? icon ?? <StarIcon />
  const stars = Array.from({ length: max }, (_, index) => index + 1)

  const star = (n: number, radios?: React.ReactNode) => {
    const state = current >= n ? "full" : current >= n - 0.5 ? "half" : "empty"
    return (
      <span
        key={n}
        data-slot="rating-item"
        data-state={state}
        data-checked={current > n - 1 && current <= n || undefined}
        className={cn(
          // boolean-ui patch: primary marks, a small hover scale and a 2px keyboard outline; no inter-item gap.
          "relative inline-flex size-4 shrink-0 rounded-sm text-primary transition-transform duration-(--bui-duration-base) group-data-[size=lg]/rating:size-5 group-data-[size=sm]/rating:size-3.5 [&_svg]:pointer-events-none [&_svg]:size-full [&_svg]:shrink-0",
          radios && !disabled && "cursor-pointer hover:scale-110",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-solid"
        )}
      >
        <span data-slot="rating-empty-icon" aria-hidden="true" className="flex size-full">
          {renderIcon ? renderIcon({ index: n - 1, active: false, checked: current > n - 1 && current <= n, value: current }) : empty}
        </span>
        <span data-slot="rating-icon" aria-hidden="true" className={cn("absolute inset-0 flex text-primary", state === "half" && orientation === "vertical" ? "[clip-path:inset(0_0_50%_0)]" : ON_CLIP[state])}>
          {renderIcon ? renderIcon({ index: n - 1, active: true, checked: current > n - 1 && current <= n, value: current }) : filled}
        </span>
        {radios}
      </span>
    )
  }

  if (readOnly) {
    return (
      <div
        role="img"
        data-slot="rating"
        data-size={resolvedSize}
        data-orientation={orientation}
        data-readonly=""
        aria-labelledby={ariaLabelledby ? `${ariaLabelledby} ${valueId}` : undefined}
        aria-label={ariaLabelledby ? undefined : [ariaLabel, valueText(current)].filter(Boolean).join(" ")}
        className={cn("group/rating inline-flex items-center data-[orientation=vertical]:flex-col", className)}
        onKeyDown={onKeyDown}
        {...(props as React.ComponentProps<"div">)}
      >
        {stars.map((n) => star(n))}
        {ariaLabelledby ? (
          <span id={valueId} hidden>
            {valueText(current)}
          </span>
        ) : null}
      </div>
    )
  }

  const radio = (n: number, half: boolean) => (
    <RadioGroupPrimitive.Item
      key={n}
      value={String(n)}
      aria-label={valueText(n)}
      data-slot="rating-radio"
      // The checked star chosen again clears the rating: a click or Space (the radio's own click runs after this one and
      // does nothing on a checked radio), or Enter, which a radio group otherwise ignores.
      onClick={() => {
        if (current === n) clear()
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return
        event.preventDefault()
        if (current === n) clear()
        else choose(String(n))
      }}
      className={cn(
        "absolute cursor-[inherit] rounded-sm outline-none",
        // In a half-star rating the half's radio covers the start half of the star, the whole star's the end half.
        orientation === "vertical"
          ? half ? "inset-x-0 top-0 h-1/2" : allowHalf ? "inset-x-0 bottom-0 h-1/2" : "inset-0"
          : half ? "inset-y-0 start-0 w-1/2" : allowHalf ? "inset-y-0 end-0 w-1/2" : "inset-0"
      )}
    />
  )

  return (
    <>
      <RadioGroupPrimitive.Root
        data-slot="rating"
        data-size={resolvedSize}
        data-orientation={orientation}
        data-allow-clear={allowClear || undefined}
        value={current > 0 ? String(current) : null}
        onValueChange={choose}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || (event.key !== "Backspace" && event.key !== "Delete")) return
          if (clear()) event.preventDefault()
        }}
        className={cn(
          "group/rating inline-flex items-center data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        {stars.map((n) =>
          star(
            n,
            allowHalf ? (
              <>
                {radio(n - 0.5, true)}
                {radio(n, false)}
              </>
            ) : (
              radio(n, false)
            )
          )
        )}
      </RadioGroupPrimitive.Root>
      {/* Beside the group, not in it: a radio group holds radios only. */}
      <span role="status" data-slot="rating-status" className="sr-only">
        {announcement}
      </span>
    </>
  )
}

export { Rating }
