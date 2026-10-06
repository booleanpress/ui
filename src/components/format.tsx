"use client"

// Format: numbers, amounts of money, byte sizes, dates and relative times, written with Intl in the provider's locale and
// time zone. No stock shadcn item and no primitive: each part is a `data` or `time` element holding the formatted text.

import * as React from "react"
import { useUiLocale } from "@booleanpress/ui/provider"
import { BYTE_INTL_UNITS, BYTE_SYMBOLS, formatByteSize, scaleBytes, withUnitSymbol } from "@/lib/format-bytes"

/**
 * A number to format: a `number`, or a `bigint` for counts beyond 2^53.
 *
 * @since 0.1.1
 */
export type FormatNumberValue = number | bigint

/**
 * A date to format: a `Date`, a timestamp in milliseconds, or an ISO 8601 string. A date-only string ("2026-10-14") is a
 * calendar day: it is written as that day in every time zone.
 *
 * @since 0.1.1
 */
export type FormatDateValue = Date | number | string

/**
 * How `formatNumber` writes a number: plain (`decimal`), a fraction as a percentage (`percent`: 0.42 is 42%), short
 * (`compact`: 12,400 is 12K) or with a `unit`.
 *
 * @since 0.1.1
 */
export type FormatNumberStyle = "decimal" | "percent" | "compact" | "unit"

/**
 * Options of `formatNumber`: the locale, the style and any `Intl.NumberFormat` option.
 *
 * @since 0.1.1
 */
export interface FormatNumberOptions extends Omit<Intl.NumberFormatOptions, "style"> {
  /** BCP 47 locale ("de-DE"); undefined is the runtime's default. */
  locale?: string
  /** `decimal` (the default), `percent`, `compact` or `unit` (with a `unit`, such as `"millisecond"`). */
  style?: FormatNumberStyle
}

/**
 * Options of `formatCurrency`: the ISO 4217 `currency` code, the locale and any `Intl.NumberFormat` option.
 *
 * @since 0.1.1
 */
export interface FormatCurrencyOptions extends Omit<Intl.NumberFormatOptions, "style" | "currency"> {
  /** BCP 47 locale ("de-DE"); undefined is the runtime's default. */
  locale?: string
  /** The ISO 4217 code of the currency: `"USD"`, `"EUR"`. */
  currency: string
}

/**
 * Options of `formatBytes`.
 *
 * @since 0.1.1
 */
export interface FormatBytesOptions {
  /** BCP 47 locale ("de-DE"); undefined is the runtime's default. */
  locale?: string
  /**
   * `decimal` (the default): steps of 1,000, with the symbols B, KB, MB, GB. `binary`: steps of 1,024, with the IEC
   * symbols KiB, MiB, GiB.
   */
  units?: "decimal" | "binary"
  /**
   * How the unit is written. By default it is the short symbol, the same in every language ("512 B", "1.5 MB"), as
   * FileUpload and Chat write sizes. `short`, `narrow` and `long` use the locale's own unit through `Intl` ("512 byte",
   * "1,5 Mo" in French, "512 bytes" long); the binary steps keep their IEC symbols.
   */
  unitDisplay?: "short" | "narrow" | "long"
  /** The most decimals shown for kilobytes and above (bytes are whole). Defaults to 1. */
  maximumFractionDigits?: number
}

/**
 * Options of `formatDate`: the locale and any `Intl.DateTimeFormat` option, the time zone among them. With no date or time
 * field, the date is written as `dateStyle: "medium"` ("Oct 14, 2026").
 *
 * @since 0.1.1
 */
export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  /** BCP 47 locale ("de-DE"); undefined is the runtime's default. */
  locale?: string
}

/**
 * The unit of a relative time.
 *
 * @since 0.1.1
 */
export type FormatRelativeTimeUnit = "second" | "minute" | "hour" | "day" | "week" | "month" | "year"

/**
 * Options of `formatRelativeTime`.
 *
 * @since 0.1.1
 */
export interface FormatRelativeTimeOptions {
  /** BCP 47 locale ("de-DE"); undefined is the runtime's default. */
  locale?: string
  /** The moment the value is compared with. Defaults to the current time. */
  now?: FormatDateValue
  /** The unit to write the difference in. By default the largest unit that keeps the number at 1 or more. */
  unit?: FormatRelativeTimeUnit
  /** `auto` (the default) writes "yesterday" and "now"; `always` writes "1 day ago" and "in 0 seconds". */
  numeric?: "always" | "auto"
  /** `long` (the default, "3 hours ago"), `short` ("3 hr. ago") or `narrow` ("3h ago"). */
  style?: "long" | "short" | "narrow"
}

const formatters = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat | Intl.RelativeTimeFormat>()

/** A cached formatter: building one is slow, and a table formats the same way on every row. */
function cached<T extends Intl.NumberFormat | Intl.DateTimeFormat | Intl.RelativeTimeFormat>(
  kind: string,
  locale: string | undefined,
  options: object,
  make: () => T
): T {
  const key = `${kind}|${locale ?? ""}|${JSON.stringify(options)}`
  let formatter = formatters.get(key) as T | undefined
  if (!formatter) {
    if (formatters.size > 200) formatters.clear()
    formatter = make()
    formatters.set(key, formatter)
  }
  return formatter
}

const numberFormat = (locale: string | undefined, options: Intl.NumberFormatOptions) =>
  cached("number", locale, options, () => new Intl.NumberFormat(locale, options))

const dateFormat = (locale: string | undefined, options: Intl.DateTimeFormatOptions) =>
  cached("date", locale, options, () => new Intl.DateTimeFormat(locale, options))

const DAY_ONLY = /^\d{4}-\d{2}-\d{2}$/

/** The instant a value names, and whether it is a calendar day ("2026-10-14"), read at midnight UTC. */
function readDate(value: FormatDateValue): { date: Date; day: boolean } {
  if (value instanceof Date) return { date: value, day: false }
  if (typeof value === "string" && DAY_ONLY.test(value)) return { date: new Date(`${value}T00:00:00Z`), day: true }
  return { date: new Date(value), day: false }
}

const isValid = (date: Date) => !Number.isNaN(date.getTime())

/**
 * A number in the locale: `formatNumber(12408.5, { locale: "de-DE" })` is "12.408,5". `style` is `decimal`, `percent`,
 * `compact` or `unit`; any other `Intl.NumberFormat` option applies. NaN gives an empty string.
 *
 * @since 0.1.1
 */
function formatNumber(value: FormatNumberValue, { locale, style = "decimal", ...options }: FormatNumberOptions = {}): string {
  if (typeof value === "number" && Number.isNaN(value)) return ""
  const intl: Intl.NumberFormatOptions = style === "compact" ? { notation: "compact", ...options } : { style, ...options }
  return numberFormat(locale, intl).format(value)
}

/**
 * An amount of money in the locale: `formatCurrency(1234.5, { currency: "EUR", locale: "de-DE" })` is "1.234,50 €". Any
 * other `Intl.NumberFormat` option applies (`currencySign: "accounting"`, `notation: "compact"`). NaN gives an empty string.
 *
 * @since 0.1.1
 */
function formatCurrency(value: FormatNumberValue, { locale, ...options }: FormatCurrencyOptions): string {
  if (typeof value === "number" && Number.isNaN(value)) return ""
  return numberFormat(locale, { style: "currency", ...options }).format(value)
}

/**
 * A size in bytes, in the locale: `formatBytes(1_500_000)` is "1.5 MB", `formatBytes(512)` "512 B",
 * `formatBytes(1_572_864, { units: "binary" })` "1.5 MiB". A value that is not a finite number gives an empty string.
 *
 * @since 0.1.1
 */
function formatBytes(
  value: number,
  { locale, units = "decimal", unitDisplay, maximumFractionDigits = 1 }: FormatBytesOptions = {}
): string {
  // The package's one size formatter, shared with FileUpload and Chat.
  if (!unitDisplay) return formatByteSize(value, { locale, units, maximumFractionDigits })
  if (!Number.isFinite(value)) return ""
  const { size, step, fractionDigits } = scaleBytes(value, { units, maximumFractionDigits })
  const format = numberFormat(locale, {
    style: "unit",
    unit: BYTE_INTL_UNITS[step],
    unitDisplay,
    maximumFractionDigits: fractionDigits,
  })
  if (units === "decimal" || step === 0) return format.format(size)
  // Intl has no units for powers of 1,024: the locale's number, spacing and order, with the IEC symbol as the unit.
  return withUnitSymbol(format, size, BYTE_SYMBOLS.binary[step])
}

const DATE_FIELDS = [
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "dayPeriod",
  "hour",
  "minute",
  "second",
  "fractionalSecondDigits",
  "timeZoneName",
  "dateStyle",
  "timeStyle",
] as const

/**
 * A date in the locale and time zone: `formatDate("2026-10-14T09:30:00Z", { dateStyle: "long", timeStyle: "short",
 * timeZone: "Europe/Berlin" })` is "October 14, 2026 at 11:30 AM". With no date or time field it is `dateStyle: "medium"`.
 * A date-only string is written as that day in every time zone. An invalid date gives an empty string.
 *
 * @since 0.1.1
 */
function formatDate(value: FormatDateValue, { locale, ...options }: FormatDateOptions = {}): string {
  const { date, day } = readDate(value)
  if (!isValid(date)) return ""
  const fields = DATE_FIELDS.some((field) => options[field] !== undefined)
  const intl: Intl.DateTimeFormatOptions = {
    ...(fields ? options : { ...options, dateStyle: "medium" }),
    ...(day ? { timeZone: "UTC" } : {}),
  }
  return dateFormat(locale, intl).format(date)
}

/** Rounds half away from zero, so 90 seconds ago and in 90 seconds are both 2 minutes. */
const roundAway = (amount: number) => Math.sign(amount) * Math.round(Math.abs(amount)) || 0

const RELATIVE_UNITS: [FormatRelativeTimeUnit, number, number][] = [
  ["second", 1000, 60],
  ["minute", 60_000, 60],
  ["hour", 3_600_000, 24],
  ["day", 86_400_000, 7],
  ["week", 604_800_000, 5],
  ["month", 2_629_800_000, 12],
  ["year", 31_557_600_000, Infinity],
]

/**
 * The time between a date and `now`, in the locale: "3 hours ago", "in 2 days", "yesterday". The unit is the largest that
 * keeps the number at 1 or more, rounded, unless `unit` names one. An invalid date gives an empty string.
 *
 * @since 0.1.1
 */
function formatRelativeTime(
  value: FormatDateValue,
  { locale, now, unit, numeric = "auto", style = "long" }: FormatRelativeTimeOptions = {}
): string {
  const { date } = readDate(value)
  const reference = now === undefined ? new Date() : readDate(now).date
  if (!isValid(date) || !isValid(reference)) return ""
  const difference = date.getTime() - reference.getTime()
  const format = cached("relative", locale, { numeric, style }, () => new Intl.RelativeTimeFormat(locale, { numeric, style }))
  const forced = unit ? RELATIVE_UNITS.find(([name]) => name === unit) : undefined
  if (forced) return format.format(roundAway(difference / forced[1]), forced[0])
  for (const [name, milliseconds, limit] of RELATIVE_UNITS) {
    const amount = roundAway(difference / milliseconds)
    if (Math.abs(amount) < limit) return format.format(amount, name)
  }
  return ""
}

const NUMBER_OPTIONS = [
  "localeMatcher",
  "currency",
  "currencyDisplay",
  "currencySign",
  "unit",
  "unitDisplay",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "useGrouping",
  "notation",
  "compactDisplay",
  "signDisplay",
  "numberingSystem",
  "roundingMode",
  "roundingIncrement",
  "roundingPriority",
  "trailingZeroDisplay",
]

const DATE_OPTIONS = [
  ...DATE_FIELDS,
  "localeMatcher",
  "formatMatcher",
  "hour12",
  "hourCycle",
  "calendar",
  "numberingSystem",
  "timeZone",
]

/** Splits a part's props into the Intl options it names and the props its element takes. */
function splitOptions<Options extends object>(
  props: Record<string, unknown>,
  names: readonly string[]
): [Options, Record<string, unknown>] {
  const options: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}
  for (const [name, value] of Object.entries(props)) {
    if (names.includes(name)) {
      if (value !== undefined) options[name] = value
    } else {
      rest[name] = value
    }
  }
  return [options as Options, rest]
}

type DataProps = Omit<React.ComponentProps<"data">, "value" | "children" | "style">
type TimeProps = Omit<React.ComponentProps<"time">, "dateTime" | "children" | "style">

/**
 * Props of `FormatNumber`: the value, the style, any `Intl.NumberFormat` option, and the `data` element's props.
 *
 * @since 0.1.1
 */
export interface FormatNumberProps extends FormatNumberOptions, DataProps {
  /** The number to write. */
  value: FormatNumberValue
}

/** @since 0.1.1 */
function FormatNumber({ value, locale, style, ...props }: FormatNumberProps) {
  const ui = useUiLocale()
  const [options, rest] = splitOptions<Intl.NumberFormatOptions>(props, NUMBER_OPTIONS)
  const text = formatNumber(value, { ...options, locale: locale ?? ui.locale, style })
  return (
    <data data-slot="format-number" value={text ? String(value) : undefined} {...rest}>
      {text}
    </data>
  )
}

/**
 * Props of `FormatCurrency`: the value, the currency, any `Intl.NumberFormat` option, and the `data` element's props.
 *
 * @since 0.1.1
 */
export interface FormatCurrencyProps extends FormatCurrencyOptions, DataProps {
  /** The amount to write, in the currency's main unit (dollars, not cents). */
  value: FormatNumberValue
}

/** @since 0.1.1 */
function FormatCurrency({ value, locale, currency, ...props }: FormatCurrencyProps) {
  const ui = useUiLocale()
  const [options, rest] = splitOptions<Intl.NumberFormatOptions>(props, NUMBER_OPTIONS)
  const text = formatCurrency(value, { ...options, currency, locale: locale ?? ui.locale })
  return (
    <data data-slot="format-currency" data-currency={currency} value={text ? String(value) : undefined} {...rest}>
      {text}
    </data>
  )
}

/**
 * Props of `FormatBytes`: the size in bytes, the units, and the `data` element's props.
 *
 * @since 0.1.1
 */
export interface FormatBytesProps extends FormatBytesOptions, DataProps {
  /** The size in bytes. */
  value: number
}

/** @since 0.1.1 */
function FormatBytes({ value, locale, units, unitDisplay, maximumFractionDigits, ...props }: FormatBytesProps) {
  const ui = useUiLocale()
  const text = formatBytes(value, { locale: locale ?? ui.locale, units, unitDisplay, maximumFractionDigits })
  return (
    <data data-slot="format-bytes" value={text ? String(value) : undefined} {...props}>
      {text}
    </data>
  )
}

/**
 * Props of `FormatDate`: the date, any `Intl.DateTimeFormat` option (`dateStyle`, `timeStyle`, `timeZone`…), and the
 * `time` element's props.
 *
 * @since 0.1.1
 */
export interface FormatDateProps extends FormatDateOptions, TimeProps {
  /** The date: a `Date`, a timestamp, or an ISO 8601 string ("2026-10-14T09:30:00Z", or "2026-10-14" for a day). */
  value: FormatDateValue
}

/** @since 0.1.1 */
function FormatDate({ value, locale, ...props }: FormatDateProps) {
  const ui = useUiLocale()
  const [options, rest] = splitOptions<Intl.DateTimeFormatOptions>(props, DATE_OPTIONS)
  const text = formatDate(value, { ...options, locale: locale ?? ui.locale, timeZone: options.timeZone ?? ui.timeZone })
  const { date, day } = readDate(value)
  return (
    <time
      data-slot="format-date"
      dateTime={text ? (day ? String(value) : date.toISOString()) : undefined}
      {...rest}
    >
      {text}
    </time>
  )
}

/**
 * Props of `FormatRelativeTime`: the date, the moment it is compared with, the unit and style, and the `time` element's
 * props.
 *
 * @since 0.1.1
 */
export interface FormatRelativeTimeProps extends FormatRelativeTimeOptions, TimeProps {
  /** The date: a `Date`, a timestamp, or an ISO 8601 string. */
  value: FormatDateValue
  /** Writes the time again every minute, against the current time, while it is shown. Ignored when `now` is given. */
  live?: boolean
}

const noSubscription = () => () => {}

/** @since 0.1.1 */
function FormatRelativeTime({ value, now, live = false, locale, unit, numeric, style, ...props }: FormatRelativeTimeProps) {
  const ui = useUiLocale()
  const [clock, setClock] = React.useState<number | undefined>(undefined)
  // False while the page hydrates, true after (and from the start in a page rendered in the browser).
  const hydrated = React.useSyncExternalStore(noSubscription, () => true, () => false)

  React.useEffect(() => {
    if (!live || now !== undefined) return
    const timer = window.setInterval(() => setClock(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [live, now])

  const reference = now ?? clock ?? Date.now()
  const text = formatRelativeTime(value, { locale: locale ?? ui.locale, now: reference, unit, numeric, style })
  const { date } = readDate(value)
  return (
    <time
      // Without `now`, the server's text was written against the server's clock, perhaps long ago (a cached page), and
      // hydration keeps it: once hydrated, the element is written again against the browser's clock.
      key={now === undefined && hydrated ? "browser" : "server"}
      data-slot="format-relative-time"
      dateTime={text ? date.toISOString() : undefined}
      // Without `now`, the server and the browser read the clock at different moments, and may write different text.
      suppressHydrationWarning={now === undefined}
      {...props}
    >
      {text}
    </time>
  )
}

export {
  FormatNumber,
  FormatCurrency,
  FormatBytes,
  FormatDate,
  FormatRelativeTime,
  formatNumber,
  formatCurrency,
  formatBytes,
  formatDate,
  formatRelativeTime,
}
