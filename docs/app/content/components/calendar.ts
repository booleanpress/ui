import type { ComponentDoc } from "../types.ts"

export default {
  slug: "calendar",
  title: "Calendar",
  category: "Form",
  purpose: "A month grid for choosing a date, several dates or a range of dates.",
  links: {
    apg: {
      label: "APG Date picker dialog",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/",
    },
    spec: "specs/003_moved-components.md#calendar",
  },
  peers: ["react-day-picker"],
  usage: `\`\`\`tsx
const [date, setDate] = useState<Date | undefined>()

<Calendar mode="single" selected={date} onSelect={setDate} />
\`\`\``,
  examples: [
    { id: "single", title: "Single date", description: "One date chosen, with today marked." },
    { id: "range", title: "Date range", description: "`mode=\"range\"`: the first click starts the range, the second ends it." },
    {
      id: "disabled-dates",
      title: "Disabled dates",
      description: "`disabled` blocks the days before today and every weekend.",
    },
    {
      id: "dropdown-caption",
      title: "Month and year dropdowns",
      description: "`captionLayout=\"dropdown\"` swaps the title for month and year selects.",
    },
    {
      id: "another-locale",
      title: "Another locale",
      description:
        "The same calendar in German and in Arabic, right to left.",
    },
    {
      id: "date-picker",
      title: "Date picker in a popover",
      description: "A button opens the calendar in a popover; choosing a date fills the button and closes it.",
    },
  ],
  accessibility: {
    semantics:
      'A `role="grid"` named by the month caption. Each day is a `button` named by its full date, in a `gridcell` with `aria-selected` when chosen.',
    labels:
      "Give the calendar a visible heading, or an `aria-label` on the popover or card that holds it.",
    focus:
      "The grid is one tab stop; the arrow keys move between days and turn the page at the edge of the month.",
    limits: [
      "Without a provider `locale`, the dates in the names are DayPicker's English, and the week starts on Sunday unless you pass `weekStartsOn`.",
      "A day is a 36 px round button in a 38 px row, which meets WCAG 2.5.8's 24 px.",
      "The arrow keys skip disabled days.",
    ],
  },
  keyboard: [
    { keys: ["ArrowRight"], behaviour: "Moves focus to the next day. In right-to-left, ArrowLeft moves to the next day instead." },
    { keys: ["ArrowLeft"], behaviour: "Moves focus to the previous day. In right-to-left, ArrowRight moves to the previous day instead." },
    { keys: ["ArrowDown"], behaviour: "Moves focus to the same weekday in the next week." },
    { keys: ["ArrowUp"], behaviour: "Moves focus to the same weekday in the previous week." },
    { keys: ["Home"], behaviour: "Moves focus to the first day of the week." },
    { keys: ["End"], behaviour: "Moves focus to the last day of the week." },
    { keys: ["PageDown"], behaviour: "Moves focus to the same day of the next month, and shows that month." },
    { keys: ["PageUp"], behaviour: "Moves focus to the same day of the previous month, and shows that month." },
    { keys: ["Shift", "PageDown"], behaviour: "Moves focus to the same day of the next year." },
    { keys: ["Shift", "PageUp"], behaviour: "Moves focus to the same day of the previous year." },
    { keys: ["Enter"], behaviour: "Chooses the focused day." },
    { keys: ["Space"], behaviour: "Chooses the focused day." },
  ],
  theming:
    "Chosen days and both ends of a range are `--primary`; the days between use `--primary` at 10% opacity; today has a primary dot; enabled outside days use `--field-placeholder` for readable contrast; disabled outside days use `--field-icon`, and disabled days are at 40% opacity. The cell size is the `--cell-size` custom property (36 px), which you can set on the calendar's `className`. Inside a `Card` or `Popover`, the calendar's own background is transparent.",
  props: {
    Calendar: {
      mode: '`"single"`, `"multiple"` or `"range"`. Without it, days cannot be chosen.',
      selected: "The chosen date, dates or range, when you control it. Its type follows `mode`.",
      onSelect: "Called with the new selection when a day is chosen. Its argument follows `mode`.",
      defaultMonth: "The month shown first. Defaults to the month of `selected`, or today's.",
      month: "The month shown, when you control it. Pair it with `onMonthChange`.",
      onMonthChange: "Called with the first day of the new month when the page turns.",
      disabled: "Days that cannot be chosen: a `Date`, an array, `{ before }`, `{ after }`, `{ from, to }`, `{ dayOfWeek }` or a function.",
      captionLayout: '`"label"` (the default) shows the month name; `"dropdown"`, `"dropdown-months"` and `"dropdown-years"` show selects instead.',
      startMonth: "The earliest month people can reach. Sets the first year in the year dropdown.",
      endMonth: "The latest month people can reach. Sets the last year in the year dropdown.",
      numberOfMonths: "How many months show side by side. Defaults to 1.",
      showOutsideDays: "Shows the days of the neighbouring months in the first and last weeks. Defaults to `true` here.",
      selectOutsideDays: "Whether displayed neighbouring-month dates can be clicked; true by default in Calendar, false in DatePicker and DateRangePicker. Keyboard navigation can still cross months.",
      showWeekNumber: "Adds a column of week numbers.",
      weekStartsOn: "The first day of the week, 0 (Sunday) to 6 (Saturday). Defaults to the provider locale's, else Sunday.",
      today: "The date marked as today. Defaults to the system date; pass one for a fixed screenshot or a test.",
      timeZone: "The IANA time zone the days are shown and returned in (`\"Europe/Berlin\"`). Defaults to the browser's; the provider's `timeZone` is not read.",
      locale:
        "A date-fns locale from `react-day-picker/locale`, for month and day names, labels and the first day of the week. It replaces the provider's locale and strings in this calendar; leave it out to follow the provider.",
      numerals: "The digits the days and years are written in (`\"latn\"`, `\"arab\"`, `\"deva\"`…). Defaults to the locale's.",
      lang: "The calendar's language tag. Defaults to the provider's locale.",
      buttonVariant: "The `Button` variant of the month arrows. Defaults to `ghost`.",
      className: "Classes for the calendar's root. It draws its own edge, except inside a popover or a card.",
    },
    CalendarDayButton: {
      day: "The day this button shows, with its `date`. DayPicker passes it; set it only when replacing the day button.",
      modifiers: "The day's states (selected, today, disabled, outside, range parts). DayPicker passes it.",
    },
  },
} satisfies ComponentDoc
