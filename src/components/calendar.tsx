"use client"

import * as React from "react"
import { cn, fillString } from "@/lib/utils"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DateLib,
  DayPicker,
  getDefaultClassNames,
  type DateLibOptions,
  type DayButton,
  type Formatters,
  type Labels,
  type Modifiers,
  type RootProps,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/button"
import { useUiConfig, useUiLocale, useUiStrings, type UiStrings } from "@booleanpress/ui/provider"

// boolean-ui patch: the calendar in the provider's locale, written with Intl (stock: DayPicker's English, from date-fns).

const intlFormats = new Map<string, Intl.DateTimeFormat>()

/** A cached Gregorian `Intl.DateTimeFormat` read in UTC: the grid is Gregorian whatever the locale's own calendar. */
function calendarFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`
  let format = intlFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { calendar: "gregory", timeZone: "UTC", ...options })
    intlFormats.set(key, format)
  }
  return format
}

/**
 * The day a grid date shows, as noon UTC. DayPicker's dates are local midnights (or midnights in its `timeZone`), so
 * their own year, month and day are the day shown, and Intl writes that day in UTC whatever zone the browser is in.
 */
function utcDay(date: Date): Date {
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12))
  if (date.getFullYear() < 100) day.setUTCFullYear(date.getFullYear())
  return day
}

const isEnglish = (locale: string) => new Intl.Locale(locale).language === "en"

/**
 * The width of the weekday names in the header: English keeps the two letters the calendar has always shown (Su, Mo);
 * other languages take their abbreviation, or the narrow name where one abbreviation is wider than a day cell holds
 * (Arabic's are whole words).
 */
function weekdayWidth(locale: string, numberingSystem?: string): "two" | "short" | "narrow" {
  if (isEnglish(locale)) return "two"
  const format = calendarFormat(locale, { weekday: "short", numberingSystem })
  const names = Array.from({ length: 7 }, (_, index) => format.format(Date.UTC(2026, 9, 4 + index, 12)))
  return names.some((name) => name.length > 4) ? "narrow" : "short"
}

const ORDINAL_SUFFIX: Record<string, string> = { one: "st", two: "nd", few: "rd", other: "th" }

/** A day's full name ("Wednesday, October 14th, 2026"): English reads the day as an ordinal, as DayPicker's labels do. */
function dayName(date: Date, locale: string, numberingSystem?: string): string {
  const parts = calendarFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric", numberingSystem })
    .formatToParts(utcDay(date))
  if (!isEnglish(locale)) return parts.map((part) => part.value).join("")
  const ordinal = new Intl.PluralRules(locale, { type: "ordinal" })
  return parts
    .map((part) => (part.type === "day" ? part.value + ORDINAL_SUFFIX[ordinal.select(Number(part.value))] : part.value))
    .join("")
}

// The regions whose week does not start on Monday (CLDR's week data), for browsers without `Intl.Locale`'s week
// information (Firefox), so they start the week where the others do and render what the server rendered.
const WEEK_FROM_SUNDAY = new Set(
  "AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW".split(
    " "
  )
)
const WEEK_FROM_SATURDAY = new Set("AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".split(" "))
const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

/** The locale's first day of the week, 0 (Sunday) to 6: the browser's week information, else CLDR's by region. */
function firstDayOfWeek(locale: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number }
      weekInfo?: { firstDay: number }
    }
    const firstDay = (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay
    if (firstDay !== undefined) return (firstDay % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const chosen = /-u(?:-[a-z0-9]{2,8})*?-fw-([a-z]{3})/i.exec(locale)?.[1].toLowerCase()
    if (chosen && WEEKDAY_KEYS.includes(chosen)) return WEEKDAY_KEYS.indexOf(chosen) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const region = info.maximize().region ?? ""
    return WEEK_FROM_SUNDAY.has(region) ? 0 : WEEK_FROM_SATURDAY.has(region) ? 6 : region === "MV" ? 5 : 1
  } catch {
    return undefined
  }
}

/** DayPicker's date formatters, written with Intl in the locale. */
function intlFormatters(locale: string, numberingSystem?: string): Partial<Formatters> {
  const width = weekdayWidth(locale, numberingSystem)
  return {
    formatCaption: (month) => calendarFormat(locale, { month: "long", year: "numeric", numberingSystem }).format(utcDay(month)),
    formatDay: (date) => calendarFormat(locale, { day: "numeric", numberingSystem }).format(utcDay(date)),
    formatMonthDropdown: (month) => calendarFormat(locale, { month: "short", numberingSystem }).format(utcDay(month)),
    formatYearDropdown: (year) => calendarFormat(locale, { year: "numeric", numberingSystem }).format(utcDay(year)),
    formatWeekdayName: (weekday) => {
      const name = calendarFormat(locale, { weekday: width === "narrow" ? "narrow" : "short", numberingSystem }).format(
        utcDay(weekday)
      )
      return width === "two" ? name.slice(0, 2) : name
    },
    formatWeekNumber: (week) => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, numberingSystem }).format(week),
  }
}

/**
 * DayPicker's labels with the provider's words ("Today, {date}", "Next month"), and the dates in the locale when one is
 * set (else in DayPicker's English).
 */
function calendarLabels(strings: UiStrings, locale: string | undefined, numberingSystem?: string): Partial<Labels> {
  const dateText = (date: Date, options?: DateLibOptions, dateLib?: DateLib) =>
    locale ? dayName(date, locale, numberingSystem) : (dateLib ?? new DateLib(options)).format(date, "PPPP")
  const marked = (text: string, modifiers: Modifiers | undefined, withSelected: boolean) => {
    let label = modifiers?.today ? fillString(strings.todayDate, { date: text }) : text
    if (withSelected && modifiers?.selected) label = fillString(strings.selectedDate, { date: label })
    return label
  }
  return {
    labelDayButton: (date, modifiers, options, dateLib) => marked(dateText(date, options, dateLib), modifiers, true),
    labelGridcell: (date, modifiers, options, dateLib) => marked(dateText(date, options, dateLib), modifiers, false),
    labelNav: () => strings.monthNavigation,
    labelPrevious: () => strings.previousMonth,
    labelNext: () => strings.nextMonth,
    labelMonthDropdown: () => strings.month,
    labelYearDropdown: () => strings.year,
    labelWeekNumber: (week) =>
      fillString(strings.weekNumber, { week: locale ? new Intl.NumberFormat(locale, { numberingSystem }).format(week) : week }),
    labelWeekNumberHeader: () => strings.weekNumberHeader,
    ...(locale
      ? {
          labelGrid: (month: Date) =>
            calendarFormat(locale, { month: "long", year: "numeric", numberingSystem }).format(utcDay(month)),
          labelWeekday: (weekday: Date) => calendarFormat(locale, { weekday: "long", numberingSystem }).format(utcDay(weekday)),
        }
      : {}),
  }
}

// A stable root keeps pointer targets mounted when a range preview updates.
function CalendarRoot({ className, rootRef, ...props }: RootProps) {
  return <div data-slot="calendar" ref={rootRef} className={className} {...props} />
}

const SelectOutsideDaysContext = React.createContext(true)

/** @since 0.1.1 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selectOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  labels,
  components,
  locale: dayPickerLocale,
  weekStartsOn,
  numerals,
  lang,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  /** Whether a displayed day from a neighbouring month can be clicked. Keyboard navigation still changes months. */
  selectOutsideDays?: boolean
}) {
  const defaultClassNames = getDefaultClassNames()
  const { dir } = useUiConfig()
  const strings = useUiStrings()
  const { locale: providerLocale } = useUiLocale()
  // DayPicker's own `locale` (a date-fns locale with its labels) wins over the provider's.
  const intlLocale = dayPickerLocale ? undefined : providerLocale
  const localised = React.useMemo(
    () => ({
      formatters: intlLocale ? intlFormatters(intlLocale, numerals) : undefined,
      labels: dayPickerLocale ? undefined : calendarLabels(strings, intlLocale, numerals),
      weekStartsOn: intlLocale ? firstDayOfWeek(intlLocale) : undefined,
    }),
    [dayPickerLocale, intlLocale, numerals, strings]
  )

  return (
    <SelectOutsideDaysContext.Provider value={selectOutsideDays}>
    <DayPicker
      // boolean-ui patch: the provider's direction, so the arrow keys follow the reading direction (stock: none).
      dir={dir}
      // boolean-ui patch: the provider's locale: Intl's month and day names, the locale's first day of the week, and the
      // provider's words in the labels (stock: DayPicker's English and Sunday). DayPicker's own `locale` prop still wins.
      locale={dayPickerLocale}
      lang={lang ?? intlLocale}
      numerals={numerals}
      weekStartsOn={weekStartsOn ?? localised.weekStartsOn}
      labels={localised.labels ? { ...localised.labels, ...labels } : labels}
      showOutsideDays={showOutsideDays}
      className={cn(
        // boolean-ui patch: the BooleanPress look — an 8px panel with a 1px edge and an 8px radius, 36px day buttons (stock:
        // no edge, 12px padding, 32px cells). Inside a popover or a card the surrounding panel draws the edge instead.
        "group/calendar w-fit rounded-lg border bg-card p-2 text-card-foreground [--cell-size:--spacing(9)] [[data-slot=card-content]_&]:border-0 [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:border-0 [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...localised.formatters,
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex min-w-64 flex-1 flex-col", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex h-7.5 w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        // boolean-ui patch: the arrows are 30px round, muted, with the lightest hover (stock: a 32px ghost button).
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-7.5 rounded-full p-1 text-muted-foreground select-none hover:bg-subtle hover:text-muted-foreground active:bg-secondary aria-disabled:opacity-60 [&_svg]:size-3.5",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-7.5 rounded-full p-1 text-muted-foreground select-none hover:bg-subtle hover:text-muted-foreground active:bg-secondary aria-disabled:opacity-60 [&_svg]:size-3.5",
          defaultClassNames.button_next
        ),
        // boolean-ui patch: the header is a 30px row above the calendar grid.
        month_caption: cn(
          "flex h-7.5 w-full items-center justify-center",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-7 w-full items-center justify-center gap-0.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        // boolean-ui patch: month and year are plain 14px buttons that take the hover fill (stock: bordered selects).
        dropdown_root: cn(
          "relative rounded-md transition-colors duration-(--bui-duration-control) hover:bg-accent hover:text-accent-foreground has-[select:focus-visible]:outline-solid has-[select:focus-visible]:outline-1 has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-ring",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        // boolean-ui patch: month and year use compact 14px captions.
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm [word-spacing:0.5rem]"
            : "flex h-7 items-center gap-1 rounded-md px-1.5 py-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("mt-2 w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        // boolean-ui patch: weekday names are 12px normal in the field placeholder colour.
        weekday: cn(
          "flex flex-1 min-w-(--cell-size) items-center justify-center p-1 text-xs font-normal text-field-placeholder select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) p-1 text-xs font-normal text-field-placeholder opacity-60 select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "py-px text-sm text-foreground opacity-60 select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative flex h-[38px] min-w-(--cell-size) flex-1 items-center justify-center py-px text-center select-none",
          defaultClassNames.day
        ),
        range_start: cn("bg-linear-to-r from-transparent from-50% to-primary/10 to-50% rtl:bg-linear-to-l", defaultClassNames.range_start),
        range_middle: cn("bg-primary/10", defaultClassNames.range_middle),
        range_end: cn("bg-linear-to-l from-transparent from-50% to-primary/10 to-50% rtl:bg-linear-to-r", defaultClassNames.range_end),
        today: cn(defaultClassNames.today),
        // boolean-ui patch: enabled outside days retain readable text; disabled outside days use the lighter icon colour.
        outside: cn("[&>button:enabled:not([data-selected-single=true]):not([data-range-start=true]):not([data-range-end=true])]:text-field-placeholder [&>button:disabled]:text-field-icon", defaultClassNames.outside),
        disabled: cn("opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            // boolean-ui patch: a header cell, so DayPicker's `scope="row"` is valid and the week names its row (stock: a
            // `td`, which axe reports as scope-attr-valid).
            <th {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center font-normal">
                {children}
              </div>
            </th>
          )
        },
        ...components,
      }}
      {...props}
    />
    </SelectOutsideDaysContext.Provider>
  )
}

/** @since 0.1.1 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const selectOutsideDays = React.useContext(SelectOutsideDaysContext)
  const outsideDisabled = modifiers.outside && !selectOutsideDays
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-today={modifiers.today}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-preview-start={modifiers.range_preview_start || undefined}
      data-range-preview-end={modifiers.range_preview_end || undefined}
      data-range-preview-middle={modifiers.range_preview_middle || undefined}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // boolean-ui patch: a 36px round day: the hover fill, today marked by a dot, the selected day and both ends of a
        // range in the primary colour, the days between in the highlight colour (stock: a square ghost button). Every
        // `after:` class is scoped to today: an `after:` class alone creates the dot's box on any day, and that empty box
        // takes the button's 8px gap and pulls the number 4px off centre.
        "relative size-9 min-w-0 rounded-full border-0 p-0 text-sm font-normal text-card-foreground shadow-none transition-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:ring-0 disabled:opacity-100",
        "data-[today=true]:after:absolute data-[today=true]:after:bottom-1 data-[today=true]:after:start-1/2 data-[today=true]:after:-translate-x-1/2 data-[today=true]:after:size-1 data-[today=true]:after:rounded-full data-[today=true]:after:bg-primary data-[today=true]:data-[selected-single=true]:after:bg-primary-foreground data-[today=true]:data-[range-start=true]:after:bg-primary-foreground data-[today=true]:data-[range-end=true]:after:bg-primary-foreground",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground data-[selected-single=true]:hover:bg-primary-hover data-[range-start=true]:hover:bg-primary-hover data-[range-end=true]:hover:bg-primary-hover",
        "data-range-preview-start:bg-primary data-range-preview-start:text-primary-foreground data-range-preview-end:bg-primary data-range-preview-end:text-primary-foreground data-range-preview-middle:bg-transparent data-range-preview-middle:text-foreground data-[today=true]:data-range-preview-start:after:bg-primary-foreground data-[today=true]:data-range-preview-end:after:bg-primary-foreground",
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        outsideDisabled && "disabled:opacity-40",
        className
      )}
      {...props}
      disabled={props.disabled || outsideDisabled}
    />
  )
}

export { Calendar, CalendarDayButton }
