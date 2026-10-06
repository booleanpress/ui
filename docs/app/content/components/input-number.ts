import type { ComponentDoc } from "../types.ts"

export default {
  slug: "input-number",
  title: "Input number",
  category: "Form",
  purpose: "A number field: typing, the arrow keys and stepper buttons change a number shown in the reader's locale.",
  links: {
    apg: { label: "APG Spinbutton", href: "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/" },
    spec: "specs/004_full-suite-components.md#input-number",
  },
  peers: ["@base-ui/react"],
  usage: `\`\`\`tsx
<InputNumber id="send-limit" defaultValue={500} min={0} buttons="stacked" />
\`\`\``,
  examples: [
    { id: "custom-buttons", title: "Custom stepper icons", description: "Plus and minus icons replace the arrow glyphs on the stepper buttons." },
    { id: "basic", title: "Basic", description: "A labelled field with a number grouped in the provider's locale." },
    {
      id: "decimals",
      title: "Decimals",
      description: "`format` sets the digits: whole, ungrouped, or two to five decimals.",
    },
    {
      id: "locale",
      title: "Locale",
      description: "The same number in English, German and Indian grouping.",
    },
    {
      id: "currency",
      title: "Currency",
      description: "`format={{ style: \"currency\" }}` with dollars, euros, rupees and yen.",
    },
    {
      id: "prefix-suffix",
      title: "Prefix and suffix",
      description: "A unit through `format`, plus a `prefix` and a `suffix` in the field.",
    },
    { id: "buttons", title: "Buttons", description: "`buttons=\"stacked\"` puts an up and a down button at the end." },
    {
      id: "buttons-horizontal",
      title: "Buttons on both sides",
      description: "`buttons=\"horizontal\"` puts minus before the field and plus after it.",
    },
    { id: "vertical", title: "Vertical", description: "`buttons=\"vertical\"` puts the up button above the field and the down button below." },
    {
      id: "min-max",
      title: "Min and max",
      description: "`min` and `max` stop the arrows and buttons at the bounds.",
    },
    { id: "step", title: "Step", description: "`step` sets the arrows and buttons; `largeStep` sets Page Up and Page Down." },
    { id: "float-label", title: "With float label", description: "Inside a `FloatLabel`, over the field and on its edge." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "disabled", title: "Disabled", description: "Neither the text nor the buttons work, and the number is not submitted." },
    { id: "invalid", title: "Invalid", description: "`aria-invalid` shows the error state with a red placeholder." },
    { id: "read-only", title: "Read-only", description: "`readOnly` shows a number that cannot change but can be focused and copied." },
  ],
  accessibility: {
    semantics:
      "A native text `input` described as a number field; the stepper buttons are native `button`s outside the tab order.",
    labels:
      "Name it with a `Label` or `aria-label`. A prefix and suffix are read as its description.",
    focus:
      "The field is one tab stop and the stepper buttons are skipped, since the arrow keys do the same.",
    limits: [
      "The screen reader reads the number as the field shows it, formatted; it has no `spinbutton` role or `aria-valuenow`.",
      "Typed text outside `min` and `max` is kept until the field loses focus, then brought into range.",
      "With a `step` of its own and `min`, a typed number that is not `min` plus whole steps fails the form's step check, as a native number input does; without `step`, any number submits.",
      "Base UI's scrub area (drag a label to change the value) is not part of this component; `allowWheelScrub` turns on the mouse wheel.",
      "The stacked buttons are 32 px wide and divide the field's inner height, so their height is below 24 px. Keyboard arrows provide the same increment/decrement actions; use a larger custom layout when larger individual targets are needed.",
    ],
  },
  keyboard: [
    { keys: ["ArrowUp"], behaviour: "Adds `step`; with Shift, `largeStep`; with Alt, `smallStep`. Stops at `max`." },
    { keys: ["ArrowDown"], behaviour: "Takes away `step`; with Shift, `largeStep`; with Alt, `smallStep`. Stops at `min`." },
    { keys: ["PageUp"], behaviour: "Adds `largeStep`. Stops at `max`." },
    { keys: ["PageDown"], behaviour: "Takes away `largeStep`. Stops at `min`." },
    { keys: ["Home"], behaviour: "Sets the value to `min`, when there is one." },
    { keys: ["End"], behaviour: "Sets the value to `max`, when there is one." },
    { keys: ["0–9"], behaviour: "Types digits; the locale's decimal and group separators, a minus sign and the currency or unit are also taken, other characters are refused." },
  ],
  theming:
    "The field is `--field` (`--field-filled` when filled) with the `--control` edge, `--control-hover` under the pointer and `--ring` on focus; invalid draws `--invalid`; disabled fills `--field-disabled` with `--field-disabled-foreground` text. The stepper icons are `--control-hover`, on `--accent` under the pointer and `--secondary-hover` while pressed.",
  props: {
    InputNumber: {
      incrementIcon: "Replaces the increment arrow. The button keeps the provider increment label.",
      decrementIcon: "Replaces the decrement arrow. The button keeps the provider decrement label.",
      value: "The number, when you control it, or `null` for an empty field. Pair it with `onValueChange`.",
      defaultValue: "The number it starts with, when it controls itself.",
      onValueChange: "Called with the new number (or `null`) and the change's details (`reason`: typing, keyboard, a button press, the wheel) on every change.",
      onValueCommitted: "Called once a change is final: on blur after typing, on releasing a button, or at once for a key or the wheel.",
      min: "The smallest value. The arrows, buttons and Home stop at it.",
      max: "The largest value. The arrows, buttons and End stop at it.",
      step: "What an arrow key or a button adds or takes away. 1 by default.",
      largeStep: "What Page Up, Page Down, or Shift with an arrow, adds or takes away. 10 by default.",
      smallStep: "What Alt with an arrow adds or takes away. 0.1 by default.",
      snapOnStep: "Rounds the value to a multiple of the step when it is stepped.",
      format: "`Intl.NumberFormat` options: currency, percent, a unit, the number of decimals, grouping.",
      allowWheelScrub: "Lets the mouse wheel change the value while the field has focus and the pointer is over it.",
      allowOutOfRange: "Keeps typed values outside `min` and `max`, so the form's own range validation can report them.",
      disabled: "The field and its buttons cannot be used; the value is not submitted.",
      readOnly: "Shows the value, which cannot change; the field can still be focused and copied.",
      required: "The form cannot be submitted while the field is empty.",
      name: "The field name, for the number the form submits.",
      id: "The input's `id`, for a `Label`'s `htmlFor`.",
      inputRef: "A ref to the hidden input that carries the value for forms.",
    },
  },
} satisfies ComponentDoc
