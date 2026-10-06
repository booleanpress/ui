import type { ComponentDoc } from "../types.ts"

export default {
  slug: "time-field",
  title: "Time field",
  category: "Form",
  purpose: "A time typed or stepped one part at a time: hours, minutes, optional seconds and AM/PM.",
  links: {
    apg: { label: "APG Spinbutton", href: "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/" },
    spec: "specs/004_full-suite-components.md#time-field",
  },
  usage: `\`\`\`tsx
const [time, setTime] = useState<Date | null>(null)

<Label id="digest-time">Send the daily digest at</Label>
<TimeField aria-labelledby="digest-time" value={time} onValueChange={setTime} />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Hours, minutes and AM/PM in the locale's order." },
    { id: "24-hour", title: "24-hour", description: "`hourCycle={24}` drops AM/PM." },
    { id: "seconds", title: "Seconds", description: "`showSeconds` adds a seconds segment." },
    { id: "step", title: "Step (15 min)", description: "`step={15}` makes the arrow keys move the minutes in quarters of an hour." },
    { id: "min-max", title: "Min and max", description: "A time outside `min` and `max` marks the field invalid." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "A disabled field cannot be focused or changed." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message." },
    { id: "with-form", title: "With a form", description: "`name` submits the time as `HH:mm`, and the form's Reset restores `defaultValue`." },
    { id: "read-only", title: "Read-only", description: "`readOnly` shows the time and keeps the segments focusable, but nothing changes." },
  ],
  accessibility: {
    semantics: "A `group` holding one `spinbutton` per segment, in the locale's order.",
    labels: "Name the group with `aria-labelledby` or `aria-label`; each segment is named hour, minute, second or period.",
    focus: "Each segment is a tab stop, and the left and right arrows also move between them. A filled segment moves focus to the next.",
    limits: [
      "On a phone, the segments are editable text so the number keyboard opens; typing goes through the same rules as a key press.",
      "`min` and `max` mark the field invalid; they do not stop the arrows or clamp the value.",
      "The value carries a date as well as the time; read only its hours and minutes, in the provider's time zone.",
      "In right-to-left text a time is written with AM/PM before the hours (\"م ٠٩:٣٠\" in Arabic); the segments keep the locale's left-to-right order, AM/PM last.",
      "A time that does not happen on its day (in the hour the clocks go forward) becomes the time just after the jump, as a `Date` does.",
    ],
  },
  keyboard: [
    { keys: ["ArrowUp"], behaviour: "Adds one (or `step` minutes) to the segment, wrapping from the highest value to the lowest; AM/PM switches." },
    { keys: ["ArrowDown"], behaviour: "Takes one (or `step` minutes) from the segment, wrapping from the lowest to the highest." },
    { keys: ["ArrowRight"], behaviour: "Moves to the next segment." },
    { keys: ["ArrowLeft"], behaviour: "Moves to the previous segment." },
    { keys: ["0–9"], behaviour: "Types into the segment, moving on once it is complete." },
    { keys: ["A", "P"], behaviour: "On AM/PM: chooses AM or PM (the first letter of the locale's names)." },
    { keys: ["Backspace"], behaviour: "Removes the segment's last digit; on an empty segment, moves to the previous one." },
    { keys: ["Delete"], behaviour: "Empties the segment." },
    { keys: ["Home"], behaviour: "Sets the segment to its lowest value." },
    { keys: ["End"], behaviour: "Sets the segment to its highest value." },
  ],
  theming:
    "The field is `Input`'s look (`--field`, `--control`, `--ring`); the focused segment is `--primary` with `--primary-foreground` text, like selected text; empty segments are `--muted-foreground`.",
  props: {
    TimeField: {
      "aria-labelledby": "The id of the visible label that names the field.",
      "aria-invalid": "Marks the field and every segment invalid.",
      disabled: "Takes the segments out of the tab order and stops every change.",
      readOnly: "Keeps the segments focusable but stops every change.",
      required: "Sets `aria-required` on every segment.",
    },
  },
} satisfies ComponentDoc
