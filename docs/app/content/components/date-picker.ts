import type { ComponentDoc } from "../types.ts"

export default {
  slug: "date-picker",
  title: "Date picker",
  category: "Form",
  purpose: "A field you can type a date into, with a calendar that opens below it.",
  links: {
    apg: {
      label: "APG Date picker dialog",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/",
    },
    spec: "specs/004_full-suite-components.md#date-picker",
  },
  peers: ["react-day-picker"],
  usage: `\`\`\`tsx
const [date, setDate] = useState<Date | null>(null)

<Label htmlFor="send-on">Send on</Label>
<DatePicker id="send-on" value={date} onValueChange={setDate} />
\`\`\``,
  examples: [
    { id: "week-numbers", title: "Week numbers", description: "ISO week numbers, with weeks starting on Monday." },
    { id: "basic", title: "Basic", description: "A field that shows the date in the locale's format and opens a calendar." },
    { id: "format", title: "Format", description: "`format` sets the date pattern, and typed text is read with the same pattern." },
    {
      id: "icon",
      title: "Icon trigger",
      description: "`trigger` chooses what opens the calendar: a button, an icon in the field, or a click in the field.",
    },
    { id: "min-max", title: "Min and max", description: "`min` and `max` block the days outside them; a typed date outside them is invalid." },
    { id: "multiple", title: "Multiple dates", description: "`mode=\"multiple\"` toggles days on and off, and the field lists them." },
    { id: "button-bar", title: "Button bar", description: "`showButtonBar` adds Today and Clear under the calendar." },
    { id: "time", title: "Time", description: "`showTime` adds hours and minutes under the calendar; `hourCycle` forces a 12- or 24-hour clock." },
    { id: "month-picker", title: "Month picker", description: "`view=\"month\"` chooses a month instead of a day." },
    { id: "year-picker", title: "Year picker", description: "`view=\"year\"` chooses a year instead of a day." },
    { id: "two-months", title: "Two months", description: "`numberOfMonths={2}` shows two months side by side." },
    {
      id: "date-template",
      title: "Date template",
      description: "`calendarProps` marks days that have deliveries with a dot, and says so in each day's name.",
    },
    { id: "inline", title: "Inline", description: "`inline` shows the calendar on the page, with no field or popup." },
    { id: "clear", title: "Clear", description: "`clearable` adds a × that empties the field." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "fluid", title: "Fluid", description: "`fluid` makes the field fill the width of its container." },
    { id: "disabled", title: "Disabled", description: "Neither the field nor the button can be used." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "float-label", title: "With a float label", description: "Inside `FloatLabel`, the label sits in the empty field and moves up once there is a date." },
    { id: "with-form", title: "With a form", description: "The picker sits outside its form and belongs to it through `form`; Reset puts the starting date back." },
    { id: "another-locale", title: "Another locale", description: "Bengali and Hindi month names are shown, and read back when typed." },
  ],
  accessibility: {
    semantics:
      'A native text input and a "Choose date" button that opens a non-modal `dialog` holding the calendar `grid`. With `trigger="field"` the input itself is a `combobox`.',
    labels:
      "Name the field with a `Label` or `aria-label`; the button, popup and time fields are named from the provider's strings. Give `inline` an `aria-label`.",
    focus:
      "The button, or Alt+ArrowDown, opens the popup and moves focus to the chosen day. Choosing a day or pressing Escape closes it and returns focus to the field.",
    limits: [
      "The calendar, like the field, follows the provider's `locale` (see Calendar); without one, the calendar's day names are react-day-picker's English.",
      "A typed date is read on blur and on Enter, not as each key lands; a screen reader hears the invalid state when focus returns to the field.",
      "`showTime` is for single dates in the day view.",
      "The dot of a day template is visual: put its meaning in the day's name with `calendarProps.labels.labelDayButton`, as the example does.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On the month or year heading, opens that navigation grid. Choose a year then month to return to days without changing the value." },
    { keys: ["Alt", "ArrowDown"], behaviour: "In the field: opens the calendar and moves focus to the chosen day, or today." },
    { keys: ["Enter"], behaviour: "In the field: reads the typed text now. On the calendar button: opens the calendar." },
    { keys: ["Escape"], behaviour: "Closes the calendar and returns focus to the field." },
    { keys: ["Tab"], behaviour: "Moves to the next control of the popup; from the last it wraps to the first." },
    { keys: ["ArrowRight"], behaviour: "In the month or year grid: the next month or year (the previous in right-to-left). The day grid's keys are the Calendar's." },
    { keys: ["ArrowDown"], behaviour: "In the month or year grid: the cell below. On an hour, minute or AM/PM spinbutton: one less." },
    { keys: ["ArrowUp"], behaviour: "In the month or year grid: the cell above. On a time spinbutton: one more." },
    { keys: ["PageDown"], behaviour: "In the month or year grid: the same cell a year (or a decade) later." },
    { keys: ["Home"], behaviour: "In the month or year grid: the first cell of the page." },
    { keys: ["End"], behaviour: "In the month or year grid: the last cell of the page." },
  ],
  theming:
    "The field is `Input`'s look; the joined button is the `--secondary` fill with the `--control` edge, darkening to `--secondary-hover` and `--secondary-active`. The popup is the popover surface with an 8 px radius and 8 px padding; chosen days, months and years are `--primary`.",
  props: {
    DatePicker: {
      mode: '`"single"` (the default) chooses one `Date`; `"multiple"` a `Date[]`.',
      value: "The chosen date (or dates), when you control it. null (or `[]`) is none.",
      defaultValue: "The date (or dates) it starts with, uncontrolled.",
      onValueChange: "Called with the new value, or null (`[]`) when the field is emptied or holds text that is not a date.",
      trigger: "`field` (default) opens from the input; `button` adds an attached button; `icon` puts the button inside the field.",
      calendarProps: "Calendar options including ISOWeek, firstWeekContainsDate and selectOutsideDays (false here).",
      placeholder: "Text in the empty field.",
      name: "Submits the value in a hidden input: `YYYY-MM-DD`, the full ISO instant with `showTime`, dates joined by commas with `multiple`.",
    },
  },
} satisfies ComponentDoc
