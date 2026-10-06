"use client"
// TimeField: built on a plain group of `role="spinbutton"` segments (the React Aria TimeField pattern); no primitive.

import * as React from "react"
import {
  dateFromParts,
  dayPeriodNames,
  fieldParts,
  formatNumber,
  getDateParts,
  secondOfDay,
  uses12Hour,
} from "@/lib/dates"
import {
  SegmentedField,
  useSegmentedValue,
  type SegmentLimits,
  type SegmentType,
  type SegmentValues,
} from "@/lib/date-segments"
import {
  useControlSize,
  useFieldVariant,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

const pad = (value: number) => String(value).padStart(2, "0")

/** @since 0.1.1 */
function TimeField({
  value,
  defaultValue,
  onValueChange,
  hourCycle,
  showSeconds = false,
  step = 1,
  min,
  max,
  referenceDate,
  size,
  variant,
  fluid = false,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  form,
  "aria-invalid": ariaInvalid,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "children"> & {
  /** The time, when you control it: a `Date` whose hours and minutes are read in the provider's time zone. */
  value?: Date | null
  /** The time it starts with, uncontrolled. */
  defaultValue?: Date | null
  /** Called with the new `Date` once every segment is filled, and with null when a filled field loses a segment. */
  onValueChange?: (value: Date | null) => void
  /** 12 (with AM/PM) or 24. Defaults to the locale's. */
  hourCycle?: 12 | 24
  /** Adds a seconds segment. */
  showSeconds?: boolean
  /** The minutes the arrow keys move by: 15 steps 00, 15, 30, 45. */
  step?: number
  /** The earliest time of day; only its hours, minutes and seconds count. An earlier time marks the field invalid. */
  min?: Date
  /** The latest time of day; a later time marks the field invalid. */
  max?: Date
  /** The day a new time is put on when the field starts empty. Defaults to today. */
  referenceDate?: Date
  /** 28, 35 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Fills the width of its container. */
  fluid?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Submits the time as `HH:mm` (or `HH:mm:ss`) in a hidden input of this name. */
  name?: string
  /** The id of the form the value belongs to, for a field placed outside it. @since 0.1.1 */
  form?: string
}) {
  const strings = useUiStrings()
  const { locale, timeZone } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const twelveHour = (hourCycle ?? (uses12Hour(locale) ? 12 : 24)) === 12
  const periods = dayPeriodNames(locale)

  const parts = fieldParts(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hourCycle: twelveHour ? "h12" : "h23",
  })

  const toSegments = (date: Date): SegmentValues => {
    const { hour, minute, second } = getDateParts(date, timeZone)
    return twelveHour
      ? { hour: hour % 12 || 12, minute, second, dayPeriod: hour < 12 ? 0 : 1 }
      : { hour, minute, second }
  }

  const fromSegments = (segments: SegmentValues): Date | null => {
    const { hour, minute, second, dayPeriod } = segments
    if (hour === undefined || minute === undefined) return null
    if (showSeconds && second === undefined) return null
    if (twelveHour && dayPeriod === undefined) return null
    const base = getDateParts(value ?? defaultValue ?? referenceDate ?? new Date(), timeZone)
    return dateFromParts(
      {
        ...base,
        hour: twelveHour ? (hour % 12) + (dayPeriod === 1 ? 12 : 0) : hour,
        minute,
        second: showSeconds ? (second ?? 0) : 0,
      },
      timeZone
    )
  }

  const state = useSegmentedValue({
    value,
    defaultValue,
    onValueChange,
    toSegments,
    fromSegments,
    formatKey: `${timeZone ?? ""}|${twelveHour}|${showSeconds}`,
  })

  const limits = (type: SegmentType): SegmentLimits => {
    if (type === "hour") return twelveHour ? { min: 1, max: 12 } : { min: 0, max: 23 }
    if (type === "minute") return { min: 0, max: 59, step: Math.max(1, Math.floor(step)) }
    if (type === "dayPeriod") return { min: 0, max: 1 }
    return { min: 0, max: 59 }
  }

  const current = state.value
  const outOfRange =
    current !== null &&
    ((min !== undefined && secondOfDay(current, timeZone) < secondOfDay(min, timeZone)) ||
      (max !== undefined && secondOfDay(current, timeZone) > secondOfDay(max, timeZone)))

  let formValue = ""
  if (current) {
    const { hour, minute, second } = getDateParts(current, timeZone)
    formValue = `${pad(hour)}:${pad(minute)}${showSeconds ? `:${pad(second)}` : ""}`
  }

  return (
    <SegmentedField
      slot="time-field"
      parts={parts}
      values={state.segments}
      onValuesChange={state.change}
      limits={limits}
      display={(type, number) => (type === "dayPeriod" ? periods[number] : formatNumber(number, locale, 2))}
      valueText={(type, number) => (type === "dayPeriod" ? periods[number] : formatNumber(number, locale))}
      labels={{
        hour: strings.hour,
        minute: strings.minute,
        second: strings.second,
        dayPeriod: strings.dayPeriod,
        day: strings.day,
        month: strings.month,
        year: strings.year,
      }}
      emptyText={strings.emptySegment}
      dayPeriods={periods}
      locale={locale}
      size={resolvedSize}
      variant={resolvedVariant}
      fluid={fluid}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      invalid={ariaInvalid === true || ariaInvalid === "true" || outOfRange}
      name={name}
      form={form}
      onFormReset={state.reset}
      formValue={formValue}
      {...props}
    />
  )
}

export { TimeField }
