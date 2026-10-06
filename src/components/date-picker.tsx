"use client"
// DatePicker: built on the package's Input, Calendar (react-day-picker) and Popover (Radix Popover); no stock shadcn item.

import * as React from "react"
import { flushSync } from "react-dom"
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react"
import { getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"
import {
  dateFromParsed,
  dateFromParts,
  dateFormatter,
  dayNumber,
  dayPeriodNames,
  formatDateText,
  formatNumber,
  getDateParts,
  isoDate,
  monthNames,
  parseDateText,
  plainSpaces,
  secondOfDay,
  startOfDay,
  uses12Hour,
  type DateTextOptions,
  type DateView,
} from "@/lib/dates"
import { usePickerPopover } from "@/lib/date-popover"
import { useFormReset } from "@/lib/form-reset"
import { buttonVariants } from "@/components/button"
import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Input } from "@/components/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/input-group"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/popover"
import {
  useControlSize,
  useFieldVariant,
  useUiConfig,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
  type UiStrings,
} from "@booleanpress/ui/provider"

/** The Calendar props a DatePicker passes through: modifiers for a day template, blocked days, week numbers, labels. */
type DatePickerCalendarProps = Pick<
  React.ComponentProps<typeof Calendar>,
  | "modifiers"
  | "modifiersClassNames"
  | "disabled"
  | "hidden"
  | "showWeekNumber"
  | "weekStartsOn"
  | "ISOWeek"
  | "firstWeekContainsDate"
  | "locale"
  | "labels"
  | "components"
  | "formatters"
  | "captionLayout"
  | "showOutsideDays"
  | "selectOutsideDays"
  | "fixedWeeks"
  | "footer"
>

interface DatePickerBaseProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "size" | "type" | "min" | "max" | "className" | "children"
  > {
  /** Classes for the root, which holds the field and its button: set its width here. */
  className?: string
  /** A pattern for the field's text, such as `"dd/MM/yyyy"` or `"d MMM yyyy"`. Defaults to the locale's numeric date. */
  format?: string
  /**
   * The earliest date: days before it cannot be chosen, and typing one marks the field invalid. With `showTime`, a `min`
   * that has a time (any but midnight) also bounds the time on its day.
   */
  min?: Date
  /** The latest date. With `showTime`, a `max` that has a time (any but midnight) also bounds the time on its day. */
  max?: Date
  /** Shows Today and Clear buttons under the calendar. */
  showButtonBar?: boolean
  /** Adds hours and minutes under the calendar. Single mode only. */
  showTime?: boolean
  /** 12 (with AM/PM) or 24, for `showTime`. Defaults to the locale's. */
  hourCycle?: 12 | 24
  /** What is chosen: a day, a month (the 1st of it) or a year (1 January). */
  view?: DateView
  /** How many months the calendar shows side by side. */
  numberOfMonths?: number
  /** Shows the calendar on the page, with no field and no popup. */
  inline?: boolean
  /** Shows a button that empties the field while it has a value. */
  clearable?: boolean
  /**
   * What opens the calendar: `button`, a button joined to the field's end; `icon`, a calendar icon inside the field;
   * `field`, a click on the field itself (and Alt+ArrowDown).
   */
  trigger?: "button" | "icon" | "field"
  /** Replaces the calendar icon of the button. */
  icon?: React.ReactNode
  /** 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Fills the width of its container. */
  fluid?: boolean
  /** The date marked as today, and the one the Today button chooses. Defaults to the system date. */
  today?: Date
  /** The month the calendar opens on when nothing is chosen. Defaults to today's. */
  defaultMonth?: Date
  /** Whether the calendar is open, when you control it. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Props for the Calendar inside: `modifiers` and `modifiersClassNames` for a day template, `disabled` days, and more. */
  calendarProps?: DatePickerCalendarProps
}

/** @since 0.1.1 */
type DatePickerSingleProps = DatePickerBaseProps & {
  /** `single` chooses one date. */
  mode?: "single"
  /** The chosen date, when you control it. */
  value?: Date | null
  defaultValue?: Date | null
  /** Called with the new date, or null when the field is emptied or its text is not a date. */
  onValueChange?: (value: Date | null) => void
}

/** @since 0.1.1 */
type DatePickerMultipleProps = DatePickerBaseProps & {
  /** `multiple` chooses several dates; the field lists them with commas (semicolons when a date's text has a comma). */
  mode: "multiple"
  value?: Date[]
  defaultValue?: Date[]
  onValueChange?: (value: Date[]) => void
}

/** @since 0.1.1 */
type DatePickerProps = DatePickerSingleProps | DatePickerMultipleProps

const toList = (value: Date | Date[] | null | undefined): Date[] =>
  value == null ? [] : Array.isArray(value) ? value : [value]

// The month arrows' look, as the Calendar's: 26px round, muted, the lightest hover.
const navButtonClasses = cn(
  buttonVariants({ variant: "ghost" }),
  "size-7.5 rounded-full p-1 text-muted-foreground select-none hover:bg-subtle hover:text-muted-foreground active:bg-secondary disabled:opacity-60 [&_svg]:size-3.5"
)

// Today and Clear: small text buttons in the muted colour.
const barButtonClasses =
  "text-muted-foreground hover:bg-subtle hover:text-muted-foreground active:bg-secondary active:text-muted-foreground"

/** A month or a year grid: the month and year views, with the arrow keys moving between cells. */
function PickerGrid({
  view,
  selected,
  focusStart,
  min,
  max,
  onPick,
}: {
  view: "month" | "year"
  selected: Date[]
  /** The date whose month or year is focusable first. */
  focusStart: Date
  min?: Date
  max?: Date
  onPick: (year: number, month: number) => void
}) {
  const strings = useUiStrings()
  const { dir } = useUiConfig()
  const { locale, timeZone } = useUiLocale()
  const start = getDateParts(focusStart, timeZone)
  // The month view can switch to years (from its title) and back.
  const [mode, setMode] = React.useState<"month" | "year">(view)
  // The focusable cell as one number: year × 12 + month index in the month view, the year in the year view.
  const [focused, setFocused] = React.useState(view === "month" ? start.year * 12 + start.month - 1 : start.year)
  const gridRef = React.useRef<HTMLDivElement | null>(null)
  const moveFocus = React.useRef(false)

  React.useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
  }, [focused, mode])

  const unit = (date: Date) => {
    const parts = getDateParts(date, timeZone)
    return mode === "month" ? parts.year * 12 + parts.month - 1 : parts.year
  }
  const minUnit = min ? unit(min) : -Infinity
  const maxUnit = max ? unit(max) : Infinity
  const chosen = new Set(selected.map(unit))
  const pageStart = mode === "month" ? Math.floor(focused / 12) * 12 : Math.floor(focused / 10) * 10
  const pageSize = mode === "month" ? 12 : 10
  const columns = mode === "month" ? 3 : 2
  const cells = Array.from({ length: pageSize }, (_, index) => pageStart + index)
  const shortMonths = monthNames(locale, "short")
  const fullName = (cell: number) =>
    mode === "month"
      ? plainSpaces(
          dateFormatter(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
            Date.UTC(Math.floor(cell / 12), cell % 12, 15)
          )
        )
      : formatNumber(cell, locale)
  const pageYear = Math.floor(focused / 12)
  const title =
    mode === "month"
      ? formatNumber(pageYear, locale)
      : `${formatNumber(pageStart, locale)} – ${formatNumber(pageStart + 9, locale)}`

  const move = (next: number) => {
    moveFocus.current = true
    setFocused(next)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const forward = dir === "rtl" ? -1 : 1
    const steps: Record<string, number> = {
      ArrowRight: forward,
      ArrowLeft: -forward,
      ArrowDown: columns,
      ArrowUp: -columns,
      PageDown: pageSize,
      PageUp: -pageSize,
    }
    if (event.key in steps) {
      event.preventDefault()
      move(focused + steps[event.key])
    } else if (event.key === "Home") {
      event.preventDefault()
      move(pageStart)
    } else if (event.key === "End") {
      event.preventDefault()
      move(pageStart + pageSize - 1)
    }
  }

  const pick = (cell: number) => {
    if (cell < minUnit || cell > maxUnit) return
    if (mode === "month") onPick(Math.floor(cell / 12), (cell % 12) + 1)
    else if (view === "year") onPick(cell, 1)
    else {
      // From the month view's year list back to its months, in the chosen year.
      moveFocus.current = true
      setMode("month")
      setFocused(cell * 12 + (start.year === cell ? start.month - 1 : 0))
    }
  }

  const previousLabel = mode === "month" ? strings.previousYear : strings.previousYears
  const nextLabel = mode === "month" ? strings.nextYear : strings.nextYears

  return (
    <div data-slot="date-picker-view" data-view={mode} className="min-w-64">
      <div
        data-slot="date-picker-header"
        className="flex h-7.5 items-center justify-between"
      >
        <button
          type="button"
          aria-label={previousLabel}
          disabled={pageStart - 1 < minUnit}
          className={navButtonClasses}
          onClick={() => setFocused(focused - pageSize)}
        >
          <ChevronLeftIcon aria-hidden="true" className="rtl:rotate-180" />
        </button>
        {mode === "month" ? (
          <button
            type="button"
            aria-label={`${strings.chooseYear}, ${title}`}
            className="rounded-md px-2 py-1 text-sm font-medium transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => {
              moveFocus.current = true
              setMode("year")
              setFocused(pageYear)
            }}
          >
            {title}
          </button>
        ) : (
          <span className="py-1 text-sm font-medium whitespace-nowrap">{title}</span>
        )}
        <button
          type="button"
          aria-label={nextLabel}
          disabled={pageStart + pageSize > maxUnit}
          className={navButtonClasses}
          onClick={() => setFocused(focused + pageSize)}
        >
          <ChevronRightIcon aria-hidden="true" className="rtl:rotate-180" />
        </button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus roves over the cells, one of which is in the tab order. */}
      <div ref={gridRef} role="grid" aria-label={title} className="mt-2" onKeyDown={handleKeyDown}>
        {Array.from({ length: pageSize / columns }, (_, row) => (
          <div key={row} role="row" className="flex">
            {cells.slice(row * columns, row * columns + columns).map((cell) => {
              const isSelected = chosen.has(cell)
              const disabled = cell < minUnit || cell > maxUnit
              return (
                <div
                  key={cell}
                  role="gridcell"
                  aria-selected={isSelected}
                  className={cn("flex justify-center p-1", mode === "month" ? "w-1/3" : "w-1/2")}
                >
                  <button
                    type="button"
                    data-slot="date-picker-cell"
                    data-selected={isSelected || undefined}
                    tabIndex={cell === focused ? 0 : -1}
                    aria-label={fullName(cell)}
                    aria-disabled={disabled || undefined}
                    className={cn(
                      "inline-flex h-9 w-full items-center justify-center rounded-md px-1 text-sm font-normal text-card-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:opacity-40 data-[selected]:bg-primary data-[selected]:text-primary-foreground",
                      mode === "year" && "w-full"
                    )}
                    onFocus={() => setFocused(cell)}
                    onClick={() => pick(cell)}
                  >
                    {mode === "month" ? shortMonths[cell % 12] : formatNumber(cell, locale)}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/** One column of the time row: a spin button between an up and a down arrow. */
function TimeSpinner({
  label,
  text,
  valueText,
  now,
  min,
  max,
  onStep,
}: {
  label: string
  text: string
  valueText: string
  now: number
  min: number
  max: number
  onStep: (delta: 1 | -1) => void
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={navButtonClasses}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onStep(1)}
      >
        <ChevronUpIcon />
      </button>
      <span
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={now}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={valueText}
        data-slot="date-picker-time-segment"
        className="inline-flex h-8 min-w-9 items-center justify-center rounded-md bg-subtle px-2 text-sm font-medium tabular-nums outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onKeyDown={(event) => {
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
          event.preventDefault()
          onStep(event.key === "ArrowUp" ? 1 : -1)
        }}
      >
        {text}
      </span>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={navButtonClasses}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onStep(-1)}
      >
        <ChevronDownIcon />
      </button>
    </div>
  )
}

/** The time row under the calendar: hours, minutes and, on a 12-hour clock, AM/PM. */
function TimeRow({
  date,
  twelveHour,
  onChange,
  strings,
}: {
  date: Date | null
  twelveHour: boolean
  onChange: (hour: number, minute: number) => void
  strings: UiStrings
}) {
  const { locale, timeZone } = useUiLocale()
  const { hour, minute } = date ? getDateParts(date, timeZone) : { hour: 0, minute: 0 }
  const periods = dayPeriodNames(locale)
  const shownHour = twelveHour ? hour % 12 || 12 : hour
  const period = hour < 12 ? 0 : 1
  return (
    <div
      data-slot="date-picker-time"
      className="-mx-2 mt-2 flex items-center justify-center gap-1 border-t px-2 pt-3 text-sm"
      dir="ltr"
    >
      <TimeSpinner
        label={strings.hour}
        text={formatNumber(shownHour, locale, 2)}
        valueText={formatNumber(shownHour, locale)}
        now={shownHour}
        min={twelveHour ? 1 : 0}
        max={twelveHour ? 12 : 23}
        onStep={(delta) => onChange((hour + delta + 24) % 24, minute)}
      />
      <span aria-hidden="true">:</span>
      <TimeSpinner
        label={strings.minute}
        text={formatNumber(minute, locale, 2)}
        valueText={formatNumber(minute, locale)}
        now={minute}
        min={0}
        max={59}
        onStep={(delta) => onChange(hour, (minute + delta + 60) % 60)}
      />
      {twelveHour ? (
        <TimeSpinner
          label={strings.dayPeriod}
          text={periods[period]}
          valueText={periods[period]}
          now={period}
          min={0}
          max={1}
          onStep={() => onChange((hour + 12) % 24, minute)}
        />
      ) : null}
    </div>
  )
}

/** @since 0.1.1 */
function DatePicker(props: DatePickerProps) {
  const {
    mode = "single",
    value,
    defaultValue,
    onValueChange,
    className,
    format,
    min,
    max,
    showButtonBar = false,
    showTime = false,
    hourCycle,
    view = "day",
    numberOfMonths = 1,
    inline = false,
    clearable = false,
    trigger = "field",
    icon,
    size,
    variant,
    fluid = false,
    today,
    defaultMonth,
    open,
    defaultOpen,
    onOpenChange,
    calendarProps,
    name,
    disabled = false,
    readOnly = false,
    "aria-invalid": ariaInvalid,
    onBlur,
    onKeyDown,
    onClick,
    ...inputProps
  } = props as DatePickerBaseProps & {
    mode?: "single" | "multiple"
    value?: Date | Date[] | null
    defaultValue?: Date | Date[] | null
    onValueChange?: (value: never) => void
  }
  const strings = useUiStrings()
  const { locale, timeZone } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const multiple = mode === "multiple"
  const withTime = showTime && !multiple && view === "day"
  const twelveHour = (hourCycle ?? (uses12Hour(locale) ? 12 : 24)) === 12

  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const contentId = React.useId()

  // The value, controlled or not, as a list: none or one date in single mode.
  const controlled = value !== undefined
  const [uncontrolled, setUncontrolled] = React.useState<Date[]>(() => toList(defaultValue))
  const dates = controlled ? toList(value) : uncontrolled

  const todayDate = today ?? new Date()
  const textOptions: DateTextOptions = {
    locale,
    timeZone,
    format,
    view,
    showTime: withTime,
    hourCycle: twelveHour ? 12 : 24,
    referenceYear: getDateParts(todayDate, timeZone).year,
  }
  // Dates are listed with commas, or semicolons when a date's own text has a comma ("Wed, 14 Oct 2026").
  const separator = multiple && formatDateText(new Date(2026, 9, 14), textOptions).includes(",") ? "; " : ", "
  const formatList = (list: Date[]) => list.map((date) => formatDateText(date, textOptions)).join(separator)
  const keyOf = (list: Date[]) =>
    `${list.map((date) => date.getTime()).join(",")}|${locale}|${timeZone}|${format}|${view}|${withTime}|${twelveHour}`

  // The field's text follows the value, unless the value is the one the text just made.
  const [text, setText] = React.useState(() => formatList(dates))
  const [shownKey, setShownKey] = React.useState(() => keyOf(dates))
  const [textInvalid, setTextInvalid] = React.useState(false)
  const currentKey = keyOf(dates)
  if (currentKey !== shownKey) {
    setShownKey(currentKey)
    setText(formatList(dates))
    setTextInvalid(false)
  }

  const emit = (next: Date[]) => {
    if (!controlled) setUncontrolled(next)
    const handler = onValueChange as ((value: Date | Date[] | null) => void) | undefined
    handler?.(multiple ? next : (next[0] ?? null))
  }

  /** Sets the value from a choice in the popup, a button or valid text, and writes the field's text from it. */
  const choose = (next: Date[]) => {
    const plain = next.map((date) => new Date(date.getTime()))
    setShownKey(keyOf(plain))
    setText(formatList(plain))
    setTextInvalid(false)
    if (keyOf(plain) !== keyOf(dates)) emit(plain)
  }

  // A form's reset puts the default back, in the field's text too; a controlled value is the parent's to reset.
  useFormReset(
    rootRef,
    () => {
      const start = toList(defaultValue)
      setUncontrolled(start)
      setShownKey(keyOf(start))
      setText(formatList(start))
      setTextInvalid(false)
    },
    { enabled: !controlled, form: inputProps.form }
  )

  const unitOf = (date: Date) => {
    const parts = getDateParts(date, timeZone)
    return view === "year" ? parts.year : view === "month" ? parts.year * 12 + parts.month : dayNumber(date, timeZone)
  }
  // With a time, a `min` or `max` that has one (any time but midnight) bounds the time on its day as well.
  const minTime = withTime && min && secondOfDay(min, timeZone) !== 0 ? min.getTime() : undefined
  const maxTime = withTime && max && secondOfDay(max, timeZone) !== 0 ? max.getTime() : undefined
  const inRange = (date: Date) =>
    (!min || unitOf(date) >= unitOf(min)) &&
    (!max || unitOf(date) <= unitOf(max)) &&
    (minTime === undefined || date.getTime() >= minTime) &&
    (maxTime === undefined || date.getTime() <= maxTime)
  /** A date and time chosen in the popup, brought inside `min` and `max` when it has a time. */
  const clampTime = (date: Date) =>
    minTime !== undefined && date.getTime() < minTime
      ? new Date(minTime)
      : maxTime !== undefined && date.getTime() > maxTime
        ? new Date(maxTime)
        : date

  /** Reads the typed text: a valid date becomes the value; anything else stays, marks the field invalid and empties the value. */
  const commitText = () => {
    const typed = text.trim()
    if (!typed) {
      if (dates.length) choose([])
      setTextInvalid(false)
      return
    }
    // Text that still says what the value says changes nothing (it may not hold the value's seconds, or its day in a
    // month view).
    if (dates.length && text === formatList(dates)) {
      setTextInvalid(false)
      return
    }
    const pieces = multiple
      ? typed
          .split(separator === "; " ? ";" : /[;,]/)
          .map((piece) => piece.trim())
          .filter(Boolean)
      : [typed]
    const base = dates[0] ? getDateParts(dates[0], timeZone) : undefined
    const parsed = pieces.map((piece) => parseDateText(piece, textOptions))
    const next = parsed.map((result) => (result ? dateFromParsed(result, timeZone, withTime ? base : undefined) : null))
    if (next.some((date) => date === null || !inRange(date))) {
      setTextInvalid(true)
      if (dates.length) {
        setShownKey(keyOf([]))
        emit([])
      }
      return
    }
    choose(next as Date[])
    if (next[0]) setMonth(next[0])
  }

  const { open: isOpen, setOpen, contentProps } = usePickerPopover({
    open,
    defaultOpen,
    onOpenChange,
    anchorRef: rootRef,
    returnFocusRef: inputRef,
  })

  const startMonth = dates[0] ?? defaultMonth ?? todayDate

  // The month shown: each opening starts on the value's month (else defaultMonth, else today's); Today and typed text
  // move it to their date.
  const [month, setMonth] = React.useState<Date>(startMonth)
  const [navigationView, setNavigationView] = React.useState<"month" | "year" | null>(null)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const movePanelFocus = React.useRef(false)
  React.useEffect(() => {
    if (!movePanelFocus.current) return
    movePanelFocus.current = false
    panelRef.current?.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus()
  }, [navigationView])
  const navigateView = (next: "month" | "year" | null) => {
    movePanelFocus.current = true
    setNavigationView(next)
  }
  const [wasOpen, setWasOpen] = React.useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) { setMonth(startMonth); setNavigationView(null) }
  }

  const withTimeOf = (day: Date) => {
    const kept = dates[0] ? getDateParts(dates[0], timeZone) : { hour: 0, minute: 0, second: 0 }
    return dateFromParts({ ...getDateParts(day, timeZone), hour: kept.hour, minute: kept.minute, second: 0 }, timeZone)
  }

  const rangeMatchers = [...(min ? [{ before: min }] : []), ...(max ? [{ after: max }] : [])]
  const extraDisabled = calendarProps?.disabled
  const disabledDays = [...rangeMatchers, ...(extraDisabled ? (Array.isArray(extraDisabled) ? extraDisabled : [extraDisabled]) : [])]
  const defaults = getDefaultClassNames()
  const calendarShared = {
    selectOutsideDays: false,
    ...calendarProps,
    components: {
      ...(numberOfMonths === 1 && view === "day" && !calendarProps?.captionLayout ? {
        CaptionLabel: ({ id, className }: React.ComponentProps<"span">) => (
          <span id={id} className={cn(className, "relative z-1 flex items-center gap-0.5")}>
            <button type="button" className="rounded px-1.5 py-1 text-sm font-medium hover:bg-accent focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => navigateView("month")}>{dateFormatter(locale, { month: "long", timeZone }).format(month)}</button>
            <button type="button" className="rounded px-1.5 py-1 text-sm font-medium hover:bg-accent focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => navigateView("year")}>{formatNumber(getDateParts(month, timeZone).year, locale)}</button>
          </span>
        ),
      } : {}),
      ...calendarProps?.components,
    },
    disabled: disabled || readOnly || (disabledDays.length ? disabledDays : undefined),
    numberOfMonths,
    month,
    onMonthChange: setMonth,
    today: todayDate,
    timeZone,
    startMonth: min,
    endMonth: max,
    // The popup draws the edge; months are separated by a 16px gap.
    className: "rounded-none border-0 bg-transparent p-0",
    classNames:
      numberOfMonths > 1
        ? {
            months: cn("relative flex flex-col gap-4 sm:flex-row", defaults.months),
            month: cn(
              "flex min-w-64 flex-1 flex-col",
              defaults.month
            ),
          }
        : undefined,
  }

  const calendar = multiple ? (
    <Calendar {...calendarShared} mode="multiple" selected={dates} onSelect={(next) => choose(next ?? [])} />
  ) : (
    <Calendar
      {...calendarShared}
      mode="single"
      required
      selected={dates[0]}
      onSelect={(day) => {
        if (withTime) {
          choose([clampTime(withTimeOf(day))])
          return
        }
        choose([day])
        if (!inline) setOpen(false)
      }}
    />
  )

  const panel = (
    <div ref={panelRef} data-slot="date-picker-panel" className="flex flex-col">
      {view === "day" && navigationView === null ? (
        calendar
      ) : (
        <PickerGrid
          key={navigationView ?? view}
          view={navigationView ?? (view === "day" ? "month" : view)}
          selected={dates}
          focusStart={navigationView ? month : startMonth}
          min={min}
          max={max}
          onPick={(year, chosenMonth) => {
            if (navigationView) {
              setMonth(dateFromParts({ year, month: navigationView === "year" ? getDateParts(month, timeZone).month : chosenMonth, day: 1, hour: 0, minute: 0, second: 0 }, timeZone))
              navigateView(navigationView === "year" ? "month" : null)
              return
            }
            choose([dateFromParts({ year, month: chosenMonth, day: 1, hour: 0, minute: 0, second: 0 }, timeZone)])
            if (!inline) setOpen(false)
          }}
        />
      )}
      {withTime ? (
        <TimeRow
          date={dates[0] ?? null}
          twelveHour={twelveHour}
          strings={strings}
          onChange={(hour, minute) => {
            const day = getDateParts(dates[0] ?? startOfDay(todayDate, timeZone), timeZone)
            choose([clampTime(dateFromParts({ ...day, hour, minute, second: 0 }, timeZone))])
          }}
        />
      ) : null}
      {showButtonBar ? (
        <div data-slot="date-picker-buttonbar" className="flex items-center justify-between border-t pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={barButtonClasses}
            onClick={() => {
              // Today's day, or its month's 1st in the month view, or its 1 January in the year view.
              const parts = getDateParts(todayDate, timeZone)
              const day = dateFromParts(
                { ...parts, month: view === "year" ? 1 : parts.month, day: view === "day" ? parts.day : 1, hour: 0, minute: 0, second: 0 },
                timeZone
              )
              const chosen = withTime ? clampTime(withTimeOf(day)) : day
              setMonth(day)
              if (multiple) {
                if (!dates.some((date) => dayNumber(date, timeZone) === dayNumber(day, timeZone))) choose([...dates, day])
                return
              }
              choose([chosen])
              if (!inline && !withTime) setOpen(false)
            }}
          >
            {strings.today}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={barButtonClasses}
            onClick={() => {
              choose([])
              if (!inline) setOpen(false)
            }}
          >
            {strings.clear}
          </Button>
        </div>
      ) : null}
    </div>
  )

  const formValue = dates.map((date) => isoDate(date, timeZone, withTime)).join(",")
  const hiddenInput = name ? (
    <input type="hidden" name={name} value={formValue} disabled={disabled} form={inputProps.form} />
  ) : null

  if (inline) {
    return (
      <div
        ref={rootRef}
        role="group"
        aria-label={inputProps["aria-label"]}
        aria-labelledby={inputProps["aria-labelledby"]}
        data-slot="date-picker"
        data-inline=""
        aria-disabled={disabled || undefined}
        inert={disabled || readOnly || undefined}
        // Inline, the calendar sits on the page with no panel round it, as the visual target's inline calendar does.
        className={cn("w-fit text-foreground", disabled && "opacity-60", className)}
      >
        {panel}
        {hiddenInput}
      </div>
    )
  }

  const invalid = ariaInvalid === true || ariaInvalid === "true" || textInvalid
  const fieldTriggers = trigger === "field"

  const inputHandlers = {
    value: text,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value)
      if (event.target.value === "") {
        choose([])
      }
    },
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
      commitText()
      onBlur?.(event)
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.altKey && event.key === "ArrowDown") {
        event.preventDefault()
        if (!disabled && !readOnly) setOpen(true, "keyboard")
      } else if (event.key === "Enter") {
        // At once, so a form that submits on this Enter sends the new value.
        flushSync(commitText)
      }
    },
    onClick: (event: React.MouseEvent<HTMLInputElement>) => {
      onClick?.(event)
      if (fieldTriggers && !disabled && !readOnly && !isOpen) setOpen(true, "field")
    },
  }

  const sharedInputProps = {
    ...inputProps,
    ...inputHandlers,
    ref: (node: HTMLInputElement | null) => {
      inputRef.current = node
      const forwarded = inputProps.ref
      if (typeof forwarded === "function") forwarded(node)
      else if (forwarded) forwarded.current = node
    },
    autoComplete: "off",
    disabled,
    readOnly,
    clearable,
    "aria-invalid": invalid || undefined,
    // With the field as the trigger it is a combobox whose popup is a dialog: the APG date picker combobox.
    ...(fieldTriggers
      ? {
          role: "combobox",
          "aria-haspopup": "dialog" as const,
          "aria-expanded": isOpen,
          "aria-controls": isOpen ? contentId : undefined,
          "aria-autocomplete": "none" as const,
        }
      : {}),
  }

  const triggerIcon = icon ?? <CalendarIcon aria-hidden="true" />

  let field: React.ReactNode
  if (trigger === "icon") {
    field = (
      <InputGroup size={resolvedSize} variant={resolvedVariant}>
        <InputGroupInput {...sharedInputProps} />
        <InputGroupAddon align="inline-end">
          <PopoverTrigger asChild>
            <InputGroupButton
              size="icon-xs"
              aria-label={strings.chooseDate}
              aria-controls={isOpen ? contentId : undefined}
              disabled={disabled || readOnly}
              data-slot="date-picker-trigger"
              className="text-field-icon hover:bg-transparent hover:text-foreground active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent"
            >
              {triggerIcon}
            </InputGroupButton>
          </PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
    )
  } else {
    field = (
      <>
        <Input
          {...sharedInputProps}
          size={resolvedSize}
          variant={resolvedVariant}
          className={cn(trigger === "button" && "rounded-e-none")}
        />
        {trigger === "button" ? (
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={strings.chooseDate}
              aria-controls={isOpen ? contentId : undefined}
              disabled={disabled || readOnly}
              data-slot="date-picker-trigger"
              data-size={resolvedSize}
              className="flex w-9 shrink-0 items-center justify-center self-stretch rounded-e-md border border-s-0 border-control bg-secondary text-secondary-foreground transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none hover:bg-secondary-hover hover:text-secondary-hover-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-secondary-active active:text-accent-foreground disabled:pointer-events-none disabled:opacity-60 data-[size=lg]:w-[2.625rem] data-[size=sm]:w-7 [&_svg]:size-3.5 data-[size=lg]:[&_svg]:size-4 data-[size=sm]:[&_svg]:size-3"
            >
              {triggerIcon}
            </button>
          </PopoverTrigger>
        ) : null}
      </>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={(next) => setOpen(next)}>
      <PopoverAnchor asChild>
        <div
          ref={rootRef}
          data-slot="date-picker"
          data-size={resolvedSize}
          className={cn("flex w-fit max-w-full min-w-0 items-stretch", fluid && "w-full", className)}
        >
          {field}
          {hiddenInput}
        </div>
      </PopoverAnchor>
      <PopoverContent
        {...contentProps}
        id={contentId}
        align="start"
        sideOffset={4}
        aria-label={strings.chooseDate}
        // boolean-ui patch: no taller than the room the window leaves it; a calendar that is (two months stacked on a phone)
        // scrolls inside the popup instead of running off the screen.
        className="max-h-(--radix-popover-content-available-height) overflow-y-auto w-auto min-w-(--radix-popover-trigger-width) rounded-lg p-2 shadow-md"
      >
        {panel}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
export type { DatePickerProps, DatePickerSingleProps, DatePickerMultipleProps }
