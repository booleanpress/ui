"use client"
// DateField: built on a plain group of `role="spinbutton"` segments (the React Aria DateField pattern); no primitive.

import * as React from "react"
import {
  dateFromParts,
  dayNumber,
  daysInMonth,
  fieldParts,
  formatNumber,
  getDateParts,
  isoDate,
  monthNames,
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

// A day with no month or year yet may be up to 31, or 29 in February: the leap year 2024 stands in for an unknown year.
function dayLimit(segments: SegmentValues): number {
  if (segments.month === undefined) return 31
  return daysInMonth(segments.year ?? 2024, segments.month)
}

/** @since 0.1.0 */
function DateField({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
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
  /** The date, when you control it: midnight of the day in the provider's time zone. */
  value?: Date | null
  /** The date it starts with, uncontrolled. */
  defaultValue?: Date | null
  /** Called with the new date once day, month and year are filled, and with null when a filled field loses one. */
  onValueChange?: (value: Date | null) => void
  /** The earliest day; an earlier date marks the field invalid. */
  min?: Date
  /** The latest day; a later date marks the field invalid. */
  max?: Date
  /** 28, 35 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Fills the width of its container. */
  fluid?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Submits the date as `YYYY-MM-DD` in a hidden input of this name. */
  name?: string
  /** The id of the form the value belongs to, for a field placed outside it. @since 0.1.0 */
  form?: string
}) {
  const strings = useUiStrings()
  const { locale, timeZone } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const parts = fieldParts(locale, { year: "numeric", month: "2-digit", day: "2-digit" })
  const months = monthNames(locale, "long")

  const toSegments = (date: Date): SegmentValues => {
    const { year, month, day } = getDateParts(date, timeZone)
    return { year, month, day }
  }

  const fromSegments = (segments: SegmentValues): Date | null => {
    const { year, month, day } = segments
    if (year === undefined || month === undefined || day === undefined) return null
    return dateFromParts({ year, month, day, hour: 0, minute: 0, second: 0 }, timeZone)
  }

  const state = useSegmentedValue({ value, defaultValue, onValueChange, toSegments, fromSegments, formatKey: timeZone ?? "" })

  const limits = (type: SegmentType, segments: SegmentValues): SegmentLimits => {
    if (type === "day") return { min: 1, max: dayLimit(segments) }
    if (type === "month") return { min: 1, max: 12 }
    return { min: 1, max: 9999 }
  }

  // A month or year that leaves the day past the month's end brings the day back to the last day.
  const change = (next: SegmentValues) => {
    const limit = dayLimit(next)
    state.change(next.day !== undefined && next.day > limit ? { ...next, day: limit } : next)
  }

  const current = state.value
  const outOfRange =
    current !== null &&
    ((min !== undefined && dayNumber(current, timeZone) < dayNumber(min, timeZone)) ||
      (max !== undefined && dayNumber(current, timeZone) > dayNumber(max, timeZone)))

  return (
    <SegmentedField
      slot="date-field"
      parts={parts}
      values={state.segments}
      onValuesChange={change}
      limits={limits}
      display={(type, number) => formatNumber(number, locale, type === "year" ? 4 : 2)}
      valueText={(type, number) => (type === "month" ? months[number - 1] : formatNumber(number, locale))}
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
      dayPeriods={["", ""]}
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
      formValue={current ? isoDate(current, timeZone) : ""}
      {...props}
    />
  )
}

export { DateField }
