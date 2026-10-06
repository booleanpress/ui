import type { ComponentDoc } from "../types.ts"

export default {
  slug: "date-field",
  title: "Date field",
  category: "Form",
  purpose: "A date typed or stepped one part at a time, in the locale's order, with no calendar.",
  links: {
    apg: { label: "APG Spinbutton", href: "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/" },
    spec: "specs/004_full-suite-components.md#date-field",
  },
  usage: `\`\`\`tsx
const [date, setDate] = useState<Date | null>(null)

<Label id="invoice-date">Invoice date</Label>
<DateField aria-labelledby="invoice-date" value={date} onValueChange={setDate} />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Month, day and year in the locale's order." },
    {
      id: "locale-order",
      title: "Locale order",
      description: "With a German locale the field reads day, month, year, divided by dots.",
    },
    { id: "min-max", title: "Min and max", description: "`min` and `max` limit the date; a date outside them marks the field invalid." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "A disabled field cannot be changed and leaves the tab order." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "with-form", title: "With a form", description: "`name` submits the date as `YYYY-MM-DD`, and Reset puts the starting date back." },
    { id: "controlled-rule", title: "Controlled with a rule", description: "The parent refuses weekends, and the field shows only the `value` it is given." },
    { id: "read-only", title: "Read-only", description: "`readOnly` shows the date and stays focusable, but cannot be changed." },
  ],
  accessibility: {
    semantics:
      'A `group` of three `spinbutton` segments for day, month and year, in the locale\'s order.',
    labels:
      "Name the group with `aria-labelledby` or `aria-label`; each segment is named day, month or year after it.",
    focus:
      "Each segment is a tab stop, and the left and right arrows move between them. A filled segment moves focus to the next.",
    limits: [
      "On a phone, the segments are editable text so the number keyboard opens; typing goes through the same rules as a key press.",
      "`min` and `max` mark the field invalid; they do not stop the arrows or clamp the value.",
      "Dates are on the Gregorian calendar in every locale.",
      "In Arabic locales the segments read left to right, the day at the left, where Arabic text (and `DatePicker`'s field) writes a numeric date right to left, the day at the right.",
    ],
  },
  keyboard: [
    { keys: ["ArrowUp"], behaviour: "Adds one to the segment, wrapping from the highest value to the lowest." },
    { keys: ["ArrowDown"], behaviour: "Takes one from the segment, wrapping from the lowest to the highest." },
    { keys: ["ArrowRight"], behaviour: "Moves to the next segment." },
    { keys: ["ArrowLeft"], behaviour: "Moves to the previous segment." },
    { keys: ["0–9"], behaviour: "Types into the segment, moving on once it is complete (two digits, or four for the year)." },
    { keys: ["Backspace"], behaviour: "Removes the segment's last digit; on an empty segment, moves to the previous one." },
    { keys: ["Delete"], behaviour: "Empties the segment." },
    { keys: ["Home"], behaviour: "Sets the segment to its lowest value." },
    { keys: ["End"], behaviour: "Sets the segment to its highest value." },
  ],
  theming:
    "The field is `Input`'s look (`--field`, `--control`, `--ring`); the focused segment is `--primary` with `--primary-foreground` text, like selected text; empty segments are `--muted-foreground`.",
  props: {
    DateField: {
      "aria-labelledby": "The id of the visible label that names the field.",
      "aria-invalid": "Marks the field and every segment invalid.",
      disabled: "Takes the segments out of the tab order and stops every change.",
      readOnly: "Keeps the segments focusable but stops every change.",
      required: "Sets `aria-required` on every segment.",
    },
  },
} satisfies ComponentDoc
