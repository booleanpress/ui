"use client"
// DateRangePicker: built on the package's Calendar (react-day-picker, range mode) and Popover (Radix Popover); no stock
// shadcn item.

import * as React from "react"
import { CalendarIcon, XIcon } from "lucide-react"
import { getDefaultClassNames, type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import {
  dateFormatter,
  dateFromParts,
  dayNumber,
  daysInMonth,
  getDateParts,
  isoDate,
  plainSpaces,
  shiftParts,
  type DateParts,
} from "@/lib/dates"
import { usePickerPopover } from "@/lib/date-popover"
import { useFormReset } from "@/lib/form-reset"
import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/popover"
import {
  useControlSize,
  useFieldVariant,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

/**
 * A chosen range: both days at midnight in the provider's time zone. `to` is the last day of the range, included.
 *
 * @since 0.1.0
 */
interface DateRangeValue {
  from: Date
  to: Date
}

/**
 * A preset of the list beside the calendar: its label, and the range it chooses for a given today.
 *
 * @since 0.1.0
 */
interface DateRangePreset {
  label: string
  range: (today: Date) => DateRangeValue
}

/** The Calendar props a DateRangePicker passes through. */
type DateRangePickerCalendarProps = Pick<
  React.ComponentProps<typeof Calendar>,
  "modifiers" | "modifiersClassNames" | "disabled" | "showWeekNumber" | "weekStartsOn" | "selectOutsideDays" | "ISOWeek" | "firstWeekContainsDate" | "locale" | "labels" | "components"
>

const midnight = (parts: DateParts, timeZone?: string) =>
  dateFromParts({ ...parts, hour: 0, minute: 0, second: 0 }, timeZone)

/** The range with its ends in order: a value whose `to` comes before its `from` is read the other way round. */
const ordered = (range: DateRangeValue | null | undefined): DateRangeValue | null =>
  !range ? null : range.to.getTime() < range.from.getTime() ? { from: range.to, to: range.from } : range

/** @since 0.1.0 */
function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  today,
  defaultMonth,
  presets = true,
  showActions = false,
  numberOfMonths = 2,
  inline = false,
  clearable = false,
  placeholder,
  size,
  variant,
  fluid = false,
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
  calendarProps,
  name,
  className,
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "children"> & {
  /** The chosen range, when you control it; null is none. */
  value?: DateRangeValue | null
  /** The range it starts with, uncontrolled. */
  defaultValue?: DateRangeValue | null
  /** Called with the new range once both ends are chosen (or on Apply), and with null when it is cleared. */
  onValueChange?: (value: DateRangeValue | null) => void
  /** The earliest day that can be chosen. */
  min?: Date
  /** The latest day that can be chosen. */
  max?: Date
  /** The day the presets count from, and the one marked as today. Defaults to the system date. */
  today?: Date
  /** The first month shown when nothing is chosen. Defaults to today's. */
  defaultMonth?: Date
  /** The list beside the calendar: `true` for Today, Yesterday, Last 7 days, Last 30 days, This month and Last month; your own list; or `false` for none. */
  presets?: boolean | DateRangePreset[]
  /** Adds Cancel and Apply under the calendar: a choice waits for Apply. */
  showActions?: boolean
  /** How many months show side by side. */
  numberOfMonths?: number
  /** Shows the range calendar on the page without a field or popup. */
  inline?: boolean
  /** Shows a button that clears the range while there is one. */
  clearable?: boolean
  /** Text in the field while no range is chosen. */
  placeholder?: string
  /** 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Fills the width of its container. */
  fluid?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Props for the Calendar inside. */
  calendarProps?: DateRangePickerCalendarProps
  /** Submits the range as `YYYY-MM-DD/YYYY-MM-DD` in a hidden input of this name. */
  name?: string
}) {
  const strings = useUiStrings()
  const { locale, timeZone } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const contentId = React.useId()

  const controlled = value !== undefined
  const [uncontrolled, setUncontrolled] = React.useState<DateRangeValue | null>(defaultValue ?? null)
  const range = ordered(controlled ? value : uncontrolled)
  const commit = (next: DateRangeValue | null) => {
    const plain = next ? { from: new Date(next.from.getTime()), to: new Date(next.to.getTime()) } : null
    if (!controlled) setUncontrolled(plain)
    onValueChange?.(plain)
  }

  const todayDate = today ?? new Date()
  const [draft, setDraft] = React.useState<DateRange | undefined>(range ?? undefined)
  const [hoveredDay, setHoveredDay] = React.useState<Date | null>(null)
  const [month, setMonth] = React.useState<Date>(range?.from ?? defaultMonth ?? todayDate)

  // A form's reset puts the default range back; a controlled range is the parent's to reset.
  useFormReset(rootRef, () => {
    setUncontrolled(defaultValue ?? null)
    setDraft(ordered(defaultValue) ?? undefined)
    if (inline) setMonth(ordered(defaultValue)?.from ?? defaultMonth ?? todayDate)
  }, { enabled: !controlled, form: props.form })

  // boolean-ui patch: inline uses the same range draft and calendar as the popup; accepted external changes reset it.
  const rangeKey = `${range?.from.getTime() ?? ""}/${range?.to.getTime() ?? ""}`
  const [shownRangeKey, setShownRangeKey] = React.useState(rangeKey)
  if (rangeKey !== shownRangeKey) {
    setShownRangeKey(rangeKey)
    if (inline) setDraft(range ?? undefined)
  }

  const popover = usePickerPopover({
    open,
    defaultOpen,
    onOpenChange,
    anchorRef: rootRef,
    returnFocusRef: triggerRef,
  })

  // Each opening starts from the chosen range, on its first month, whether the picker or its parent opens it.
  const [wasOpen, setWasOpen] = React.useState(popover.open)
  if (popover.open !== wasOpen) {
    setWasOpen(popover.open)
    if (popover.open) {
      setDraft(range ?? undefined)
      setMonth(range?.from ?? defaultMonth ?? todayDate)
    }
  }

  const dayKey = (date: Date | undefined) => (date ? dayNumber(date, timeZone) : 0)
  const inRange = (candidate: DateRangeValue) =>
    (!min || dayKey(candidate.from) >= dayKey(min)) && (!max || dayKey(candidate.to) <= dayKey(max))

  const t = getDateParts(todayDate, timeZone)
  const builtIn: DateRangePreset[] = [
    { label: strings.presetToday, range: () => ({ from: midnight(t, timeZone), to: midnight(t, timeZone) }) },
    {
      label: strings.presetYesterday,
      range: () => {
        const day = midnight(shiftParts(t, { days: -1 }), timeZone)
        return { from: day, to: day }
      },
    },
    {
      label: strings.presetLast7Days,
      range: () => ({ from: midnight(shiftParts(t, { days: -6 }), timeZone), to: midnight(t, timeZone) }),
    },
    {
      label: strings.presetLast30Days,
      range: () => ({ from: midnight(shiftParts(t, { days: -29 }), timeZone), to: midnight(t, timeZone) }),
    },
    { label: strings.presetThisMonth, range: () => ({ from: midnight({ ...t, day: 1 }, timeZone), to: midnight(t, timeZone) }) },
    {
      label: strings.presetLastMonth,
      range: () => {
        const first = shiftParts({ ...t, day: 1 }, { months: -1 })
        return {
          from: midnight(first, timeZone),
          to: midnight({ ...first, day: daysInMonth(first.year, first.month) }, timeZone),
        }
      },
    },
  ]
  const presetList = presets === true ? builtIn : presets === false ? [] : presets
  const shown = inline || popover.open ? draft : (range ?? undefined)

  const choosePreset = (preset: DateRangePreset) => {
    const next = preset.range(todayDate)
    if (showActions) {
      setDraft(next)
      setMonth(next.from)
      return
    }
    commit(next)
    if (!inline) popover.setOpen(false)
  }

  const text = range
    ? plainSpaces(
        dateFormatter(locale, { month: "short", day: "numeric", year: "numeric", timeZone }).formatRange(range.from, range.to)
      )
    : ""
  const showClear = clearable && range !== null && !disabled
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"

  const disabledDays = [
    ...(min ? [{ before: min }] : []),
    ...(max ? [{ after: max }] : []),
    ...(calendarProps?.disabled ? (Array.isArray(calendarProps.disabled) ? calendarProps.disabled : [calendarProps.disabled]) : []),
  ]
  const defaults = getDefaultClassNames()

  const preview = hoveredDay && draft?.from && !draft.to
    ? ordered({ from: draft.from, to: hoveredDay }) : null
  const previewModifiers = preview ? {
    range_preview_start: preview.from,
    range_preview_end: preview.to,
    range_preview_middle: { after: preview.from, before: preview.to },
  } : {}

  const hiddenInput = name ? (
    <input type="hidden" name={name}
      value={range ? `${isoDate(range.from, timeZone)}/${isoDate(range.to, timeZone)}` : ""}
      disabled={disabled} form={props.form} />
  ) : null
  // Inline, Clear sits at the start of the Cancel and Apply row when there is one, else under the calendar.
  const inlineClear = inline && clearable && range ? (
    <Button type="button" variant="ghost" size="sm" disabled={disabled}
      onClick={() => { commit(null); setDraft(controlled ? range ?? undefined : undefined) }}>{strings.clear}</Button>
  ) : null

  const panel = (
    <div className="flex flex-col sm:flex-row" onMouseLeave={() => setHoveredDay(null)}>
      {presetList.length ? (
        <div
          data-slot="date-range-picker-presets"
          className="mb-2 flex flex-wrap gap-0.5 border-b pb-2 sm:mb-0 sm:me-2.5 sm:min-w-32 sm:flex-col sm:flex-nowrap sm:border-e sm:border-b-0 sm:pe-2.5 sm:pb-0"
        >
          {presetList.map((preset) => {
            const candidate = preset.range(todayDate)
            const pressed =
              dayKey(shown?.from) === dayKey(candidate.from) && dayKey(shown?.to) === dayKey(candidate.to)
            return (
              <button
                key={preset.label}
                type="button"
                data-slot="date-range-picker-preset"
                aria-pressed={pressed}
                disabled={disabled || !inRange(candidate)}
                className="flex items-center rounded-sm px-2.5 py-1 text-start text-sm whitespace-nowrap text-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60 aria-pressed:bg-highlight aria-pressed:text-highlight-foreground aria-pressed:hover:bg-highlight-focus"
                onClick={() => choosePreset(preset)}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      ) : null}
      <div className="flex flex-col">
        <Calendar
          // Months side by side hide the days of their neighbours, so a range is not drawn twice.
          showOutsideDays={numberOfMonths === 1}
          selectOutsideDays={false}
          {...calendarProps}
          modifiers={{ ...calendarProps?.modifiers, ...previewModifiers }}
          modifiersClassNames={{ ...calendarProps?.modifiersClassNames,
            range_preview_middle: "bg-primary/10",
            range_preview_start: "bg-linear-to-r from-transparent from-50% to-primary/10 to-50% rtl:bg-linear-to-l",
            range_preview_end: "bg-linear-to-l from-transparent from-50% to-primary/10 to-50% rtl:bg-linear-to-r",
          }}
          onDayMouseEnter={(day, modifiers) => { if (draft?.from && !draft.to) setHoveredDay(modifiers.disabled ? null : day) }}
          mode="range"
          resetOnSelect
          selected={draft}
          onSelect={(next) => {
            const completes = Boolean(draft?.from && !draft.to && next?.from && next.to)
            setDraft(next)
            setHoveredDay(null)
            if (!showActions && completes && next?.from && next.to) {
              commit({ from: next.from, to: next.to })
              if (inline && controlled) setDraft(range ?? undefined)
              if (!inline) popover.setOpen(false)
            }
          }}
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={numberOfMonths}
          today={todayDate}
          timeZone={timeZone}
          startMonth={min}
          endMonth={max}
          disabled={disabled || (disabledDays.length ? disabledDays : undefined)}
          className="max-w-full rounded-none border-0 bg-transparent p-0"
          classNames={
            numberOfMonths > 1
              ? {
                  // boolean-ui patch: months that do not fit side by side wrap to the next row at their own width,
                  // instead of running out of their container (stock: one row, cut off).
                  months: cn("relative flex flex-col gap-4 sm:flex-row sm:flex-wrap", defaults.months),
                  month: cn(
                    "flex w-64 flex-none flex-col",
                    defaults.month
                  ),
                }
              : undefined
          }
        />
        {showActions ? (
          <div data-slot="date-range-picker-actions" className="mt-2 flex items-center justify-end gap-2 border-t pt-2">
            {inlineClear ? <div className="me-auto">{inlineClear}</div> : null}
            <Button type="button" variant="ghost" size="sm" onClick={() => { setDraft(range ?? undefined); if (!inline) popover.setOpen(false) }}>
              {strings.cancel}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={disabled || !draft?.from || !draft.to}
              onClick={() => {
                if (!draft?.from || !draft.to) return
                commit({ from: draft.from, to: draft.to })
                if (inline && controlled) setDraft(range ?? undefined)
                if (!inline) popover.setOpen(false)
              }}
            >
              {strings.apply}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )

  if (inline) {
    return (
      <div ref={rootRef} data-slot="date-range-picker" data-inline="" role="group"
        id={props.id} aria-label={props["aria-label"] ?? (props["aria-labelledby"] ? undefined : strings.chooseDateRange)}
        aria-labelledby={props["aria-labelledby"]} aria-describedby={props["aria-describedby"]}
        aria-disabled={disabled || undefined} data-invalid={invalid || undefined}
        className={cn("w-fit max-w-full text-foreground", disabled && "opacity-60", className)}>
        <div inert={disabled || undefined}>{panel}</div>
        {showActions ? null : inlineClear}
        {hiddenInput}
      </div>
    )
  }

  return (
    <Popover open={popover.open} onOpenChange={(next) => popover.setOpen(next)}>
      <PopoverAnchor asChild>
        <div
          ref={rootRef}
          data-slot="date-range-picker"
          className={cn("group/date-range-picker relative flex w-fit max-w-full min-w-0", fluid && "w-full", className)}
        >
          <PopoverTrigger asChild>
            <button
              ref={triggerRef}
              type="button"
              // A combobox whose popup is a dialog (the APG date picker combobox), so it can carry `aria-invalid`.
              role="combobox"
              aria-expanded={popover.open}
              aria-controls={popover.open ? contentId : undefined}
              data-slot="date-range-picker-trigger"
              data-size={resolvedSize}
              data-variant={resolvedVariant}
              data-placeholder={range ? undefined : ""}
              disabled={disabled}
              className={cn(
                "flex w-full min-w-0 items-center justify-between gap-5.25 rounded-md border border-control bg-field py-1.5 ps-2.5 pe-2.75 text-start text-sm whitespace-nowrap text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none hover:border-control-hover focus-visible:border-ring data-[state=open]:border-ring disabled:cursor-not-allowed disabled:border-control disabled:bg-field-disabled disabled:text-field-disabled-foreground data-[placeholder]:text-field-placeholder",
                "data-[size=sm]:py-1 data-[size=sm]:ps-2 data-[size=sm]:pe-2.25 data-[size=sm]:text-xs data-[size=lg]:py-2 data-[size=lg]:ps-3 data-[size=lg]:pe-2.75 data-[size=lg]:text-base",
                "data-[variant=filled]:enabled:bg-field-filled",
                "aria-invalid:border-invalid aria-invalid:data-[placeholder]:text-field-invalid-foreground aria-invalid:focus-visible:border-ring aria-invalid:data-[state=open]:border-ring",
                clearable && "group-hover/date-range-picker:border-control-hover",
                showClear && "gap-8.75 data-[size=lg]:gap-9 data-[size=sm]:gap-8.5"
              )}
              onKeyDown={(event) => {
                onKeyDown?.(event)
                if (event.defaultPrevented || !(event.altKey && event.key === "ArrowDown")) return
                event.preventDefault()
                popover.setOpen(true, "keyboard")
              }}
              {...props}
              aria-invalid={invalid || undefined}
            >
              <span data-slot="date-range-picker-value" className="truncate">
                {text || placeholder}
              </span>
              <CalendarIcon
                aria-hidden="true"
                className="size-3.5 shrink-0 text-field-icon group-data-[size=lg]/date-range-picker:size-4 group-data-[size=sm]/date-range-picker:size-3"
              />
            </button>
          </PopoverTrigger>
          {showClear ? (
            <button
              type="button"
              data-slot="date-range-picker-clear"
              aria-label={strings.clear}
              className="absolute end-8 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-field-icon transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-ring"
              onClick={() => {
                commit(null)
                triggerRef.current?.focus()
              }}
            >
              <XIcon aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
          {hiddenInput}
        </div>
      </PopoverAnchor>
      <PopoverContent
        {...popover.contentProps}
        id={contentId}
        align="start"
        sideOffset={4}
        aria-label={strings.chooseDateRange}
        // boolean-ui patch: no taller than the room the window leaves it; a calendar that is (two months stacked on a phone)
        // scrolls inside the popup instead of running off the screen.
        className="max-h-(--radix-popover-content-available-height) overflow-y-auto w-auto max-w-[calc(100vw-1rem)] min-w-(--radix-popover-trigger-width) rounded-lg p-2 shadow-md"
      >
        {panel}
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }
export type { DateRangeValue, DateRangePreset }
