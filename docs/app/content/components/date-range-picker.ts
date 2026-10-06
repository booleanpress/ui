import type { ComponentDoc } from "../types.ts"

export default {
  slug: "date-range-picker",
  title: "Date range picker",
  category: "Form",
  purpose: "Chooses a first and a last day in one field, from a two-month calendar or a list of presets.",
  links: {
    apg: {
      label: "APG Date picker combobox",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/",
    },
    spec: "specs/004_full-suite-components.md#date-range-picker",
  },
  peers: ["react-day-picker"],
  usage: `\`\`\`tsx
const [range, setRange] = useState<DateRangeValue | null>(null)

<Label htmlFor="report-period">Report period</Label>
<DateRangePicker id="report-period" value={range} onValueChange={setRange} placeholder="All time" />
\`\`\``,
  examples: [
    { id: "inline", title: "Inline", description: "A range calendar on the page that stays visible after a range is chosen." },
    { id: "three-months", title: "Three months", description: "A range calendar across three months, stacked on narrow screens." },
    { id: "inline-form", title: "Inline form", description: "Apply or cancel a draft range, clear it, submit it, or restore the default with Reset." },
    { id: "basic", title: "Basic", description: "A range field with no presets; two clicks on the calendar choose a range." },
    { id: "presets", title: "Presets", description: "Presets such as Today, Last 7 days and This month sit beside the calendar." },
    { id: "actions", title: "Apply and cancel", description: "`showActions` adds Cancel and Apply, so the range waits for Apply." },
    { id: "min-max", title: "Min and max", description: "`min` and `max` keep the range within the last 30 days, and presets outside it are disabled." },
    { id: "range-length", title: "Range length", description: "`maxDays` caps a range at 14 days: once the first day is chosen, days beyond reach are disabled, as are longer presets. `minDays` sets the fewest." },
    { id: "clear", title: "Clear", description: "`clearable` adds a × that clears the range." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "The field cannot be opened." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "with-form", title: "With a form", description: "`name` submits the range as `YYYY-MM-DD/YYYY-MM-DD`, and Reset puts the starting range back." },
  ],
  accessibility: {
    semantics:
      'The field is a `combobox` button that opens a non-modal `dialog` holding the presets and the range calendar `grid`. Inline uses a named group instead.',
    labels:
      "Name the field with a `Label` or `aria-label`, and an inline calendar with `aria-label` or `aria-labelledby`. The popup, presets and buttons are named from the provider's strings. With `minDays` or `maxDays`, the rule under the calendar describes the popup, or the inline group.",
    focus:
      "Enter, Space or Alt+ArrowDown opens the popup and moves focus to the range's first day. Choosing a range or pressing Escape closes it and returns focus to the field.",
    limits: [
      "The calendar follows the provider's `locale` (see Calendar); without one, its day names are react-day-picker's English.",
      "The range is chosen with the calendar or a preset; it cannot be typed. Pair two `DatePicker`s or `DateField`s where typing matters.",
      "Below 640 px the presets wrap above the calendar and the months stack.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "On the field: opens the popup. On a preset: chooses it." },
    { keys: ["Alt", "ArrowDown"], behaviour: "On the field: opens the popup with focus on the calendar." },
    { keys: ["Escape"], behaviour: "Closes the popup without a change and returns focus to the field." },
    { keys: ["Tab"], behaviour: "Moves to the next control of the popup; from the last it wraps to the first." },
  ],
  theming:
    "The field is the field look of `Input` and `Select`; the popup is the popover surface with an 8 px radius and 8 px padding. The pressed preset is `--highlight`; the range ends are `--primary` and the days between `--primary` at 10% opacity, as in `Calendar`.",
  props: {
    DateRangePicker: {
      inline: "Shows a named group with the calendar and optional controls, without a field or popup; false by default.",
      numberOfMonths: "Months to show, two by default. Three works in either presentation.",
      calendarProps: "Calendar options including showWeekNumber, ISOWeek, firstWeekContainsDate, weekStartsOn and selectOutsideDays (false here).",
      value: "The chosen `{ from, to }`, when you control it; null is none. A `to` before its `from` is read the other way round.",
      defaultValue: "The range it starts with, uncontrolled.",
      onValueChange: "Called with the new range when both ends are chosen, a preset is clicked or Apply is pressed, and with null when it is cleared.",
      minDays: "The fewest days a range may cover, both ends included. Once the first day is chosen, the days too close to it are disabled; shorter presets are disabled.",
      maxDays: "The most days a range may cover, both ends included. Once the first day is chosen, the days out of reach are disabled, for the pointer and the arrow keys; longer presets are disabled.",
    },
  },
} satisfies ComponentDoc
