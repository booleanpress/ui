"use client"

// Statistic: built on semantic HTML — a description list of one label and its value, with no primitive.
import * as React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn, fillString } from "@/lib/utils"

import { Skeleton } from "@/components/skeleton"
import { useControlSize, useUiLocale, useUiStrings, type ControlSize } from "@booleanpress/ui/provider"

/** How a statistic's number is written. @since 0.1.1 */
type StatisticFormat = "number" | "currency" | "percent" | "compact"

/** A statistic on its own, or on a card. @since 0.1.1 */
type StatisticVariant = "plain" | "card"

const StatisticGroupContext = React.createContext<StatisticVariant | undefined>(undefined)

/** The `Intl.NumberFormat` options for each format; `formatOptions` is laid over them. */
function numberOptions(format: StatisticFormat, currency: string | undefined): Intl.NumberFormatOptions {
  switch (format) {
    case "currency":
      return { style: "currency", currency: currency ?? "USD" }
    case "percent":
      return { style: "percent", maximumFractionDigits: 1 }
    case "compact":
      return { notation: "compact", maximumFractionDigits: 1 }
    default:
      return {}
  }
}

/**
 * Writes a number with `Intl.NumberFormat`. A currency code `Intl` does not know (`"EURO"`) throws a RangeError, which would
 * take the page down with it; the number is then written plainly instead.
 */
function formatNumber(value: number, locale: string | undefined, options: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value)
  } catch {
    try {
      return new Intl.NumberFormat(locale).format(value)
    } catch {
      return String(value)
    }
  }
}

/**
 * A number that matters, such as emails sent today: its label, its value written in the provider's locale, and an
 * optional trend, help text and icon. A `StatisticGroup` lays several out as a row of cards.
 *
 * @since 0.1.1
 */
function Statistic({
  className,
  label,
  value,
  format = "number",
  currency,
  formatOptions,
  trend,
  trendValue,
  invertTrendColor = false,
  helpText,
  icon,
  iconClassName,
  loading = false,
  variant,
  size,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** What the number counts, such as "Emails sent". */
  label: React.ReactNode
  /** The number, written with `format` in the provider's locale; a string is shown as it is. */
  value?: number | string | null
  /**
   * `number` (12,400), `currency` (with `currency`), `percent` (a fraction: 0.42 is 42%) or `compact` (12.4K).
   */
  format?: StatisticFormat
  /** The ISO 4217 code for `format="currency"`, such as `"EUR"`. Defaults to `"USD"`. */
  currency?: string
  /** `Intl.NumberFormat` options laid over the format's own, such as `{ maximumFractionDigits: 0 }`. */
  formatOptions?: Intl.NumberFormatOptions
  /** The direction of the change: an arrow, coloured, with the words "Up" or "Down" for screen readers. */
  trend?: "up" | "down"
  /** The size of the change as a fraction (0.12 is 12%), written as a percentage beside the arrow. */
  trendValue?: number
  /** Colours a rise red and a fall green, for counts where less is better, such as bounces. */
  invertTrendColor?: boolean
  /** A short note after the trend, such as "since last week". */
  helpText?: React.ReactNode
  /** An icon in a 32 px circle at the end. Decorative: the label says what the number is. */
  icon?: React.ReactNode
  /** Classes for the icon's circle, such as `bg-info-tag text-info-tag-foreground`. */
  iconClassName?: string
  /** Shows a placeholder in place of the value and the trend while the number loads. */
  loading?: boolean
  /** `plain` (the default) or `card`, a bordered card. Inside a `StatisticGroup` it defaults to the group's. */
  variant?: StatisticVariant
  /** The value's size: 16 px (`sm`), 18 px (`default`) or 24 px (`lg`). Defaults to the provider's `controlSize`. */
  size?: ControlSize
}) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const group = React.useContext(StatisticGroupContext)
  const resolvedVariant = variant ?? group ?? "plain"
  const resolvedSize = useControlSize(size)

  // A number is isolated from the text around it, so a minus sign stays in front of it on a right-to-left page
  // ("-$64.00", not "$64.00-"); a string is shown as it is.
  const written =
    typeof value === "number" ? (
      <bdi>{formatNumber(value, locale, { ...numberOptions(format, currency), ...formatOptions })}</bdi>
    ) : (
      (value ?? "")
    )
  const change =
    trendValue !== undefined
      ? formatNumber(Math.abs(trendValue), locale, { style: "percent", maximumFractionDigits: 1 })
      : ""
  const good = trend === undefined ? undefined : (trend === "up") !== invertTrendColor
  const TrendIcon = trend === "down" ? ArrowDownIcon : ArrowUpIcon

  return (
    <div
      data-slot="statistic"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      aria-busy={loading || undefined}
      className={cn(
        "group/statistic flex min-w-0 items-start justify-between gap-8",
        // The card: the content edge, a 12px radius, a soft shadow and 1.125rem padding, as the visual target's cards.
        "data-[variant=card]:rounded-xl data-[variant=card]:border data-[variant=card]:bg-card data-[variant=card]:p-4.5 data-[variant=card]:text-card-foreground data-[variant=card]:shadow-sm",
        className
      )}
      {...props}
    >
      <dl className="m-0 flex min-w-0 flex-col gap-1">
        <dt data-slot="statistic-label" className="m-0 text-sm/5 text-muted-foreground">
          {label}
        </dt>
        <dd
          data-slot="statistic-value"
          className="m-0 text-lg/7 font-bold text-foreground tabular-nums group-data-[size=lg]/statistic:text-2xl/8 group-data-[size=sm]/statistic:text-base/6"
        >
          {loading ? (
            <>
              <Skeleton aria-hidden="true" className="my-1 h-5 w-24 group-data-[size=lg]/statistic:h-6 group-data-[size=sm]/statistic:h-4" />
              <span className="sr-only">{strings.loading}</span>
            </>
          ) : (
            written
          )}
        </dd>
        {(trend || helpText) && !loading ? (
          <dd data-slot="statistic-help" className="m-0 flex flex-wrap items-center gap-x-1.5 text-sm/5 text-muted-foreground">
            {trend ? (
              <span
                data-slot="statistic-trend"
                data-trend={trend}
                // A rise in the deep green and a fall in the deep red of the status tags, which keep 4.5:1 on the page and
                // the card in both themes (`--success-strong` is 3.3:1 on white).
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  good ? "text-success-tag-foreground" : "text-destructive-tag-foreground"
                )}
              >
                <TrendIcon aria-hidden="true" className="size-3.5" />
                <span aria-hidden="true">{change}</span>
                <span className="sr-only">{fillString(trend === "up" ? strings.trendUp : strings.trendDown, { value: change }).trim()}</span>
              </span>
            ) : null}
            {helpText}
          </dd>
        ) : null}
      </dl>
      {icon ? (
        <span
          aria-hidden="true"
          data-slot="statistic-icon"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
            iconClassName
          )}
        >
          {icon}
        </span>
      ) : null}
    </div>
  )
}

/**
 * A row of statistics that wraps to fit, each at least 12rem wide; its statistics are cards unless `variant` says
 * otherwise.
 *
 * @since 0.1.1
 */
function StatisticGroup({
  className,
  variant = "card",
  ...props
}: React.ComponentProps<"div"> & {
  /** The look of the statistics inside, unless one sets its own: `card` (the default) or `plain`. */
  variant?: StatisticVariant
}) {
  return (
    <StatisticGroupContext.Provider value={variant}>
      <div
        data-slot="statistic-group"
        className={cn("grid grid-cols-[repeat(auto-fit,minmax(min(12rem,100%),1fr))] gap-4", className)}
        {...props}
      />
    </StatisticGroupContext.Provider>
  )
}

export { Statistic, StatisticGroup }
export type { StatisticFormat, StatisticVariant }
